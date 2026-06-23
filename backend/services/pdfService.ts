const PDFDocument = require('pdfkit');

export const generateProfessionalPdf = (data: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      // autoFirstPage: true is default, bufferPages: true for footers
      const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true, autoFirstPage: true });
      const buffers: Buffer[] = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);

      const DARK_BLUE = '#0f172a';
      const CYAN = '#0ea5e9';
      const TEXT_MAIN = '#1e293b';
      const TEXT_MUTED = '#64748b';
      const BG_LIGHT = '#f8fafc';
      const GREEN = '#16a34a';
      const RED = '#dc2626';
      
      const cleanText = (text: string | null | undefined): string => {
        if (!text) return "";
        let cleaned = text
          .replace(/[\u2018\u2019]/g, "'")
          .replace(/[\u201C\u201D]/g, '"')
          .replace(/[\u2013\u2014]/g, "-")
          .replace(/[\u2022\u00B7]/g, "-")
          .replace(/→/g, "->")
          .replace(/⇒/g, "=>")
          .replace(/[“”]/g, '"')
          .replace(/[‘’]/g, "'")
          .replace(/\*\*/g, "")
          .replace(/\*/g, "")
          .replace(/#{1,6}\s?/g, "")
          .replace(/`/g, "'");
        return cleaned.replace(/[^\x20-\x7E\n\r\t]/g, "").trim();
      };

      const checkPageBreak = (heightNeeded: number) => {
        // More conservative margin to prevent text wrapping triggering an automatic blank page
        if (doc.y + heightNeeded > 730) {
          doc.addPage();
        }
      };

      const addSectionHeader = (title: string) => {
        checkPageBreak(50);
        const startY = doc.y;
        doc.rect(40, startY, 515, 25).fill(DARK_BLUE);
        doc.fill('#ffffff').fontSize(12).font('Helvetica-Bold').text(title, 50, startY + 7);
        doc.y = startY + 35; 
      };

      // --- Page Header ---
      doc.rect(0, 0, 595, 100).fill(DARK_BLUE);
      
      doc.fill(CYAN).fontSize(28).font('Helvetica-Bold').text('CareerDNA AI', 40, 30);
      doc.fill('#ffffff').fontSize(14).font('Helvetica').text('Evidence-Based Analysis Report', 40, 65);
      
      const candidateName = cleanText(data.candidateName) || "Candidate";
      doc.fill('#ffffff').fontSize(12).font('Helvetica-Bold').text(candidateName, 300, 35, { align: 'right', width: 255 });
      doc.fill('#cccccc').fontSize(10).font('Helvetica').text(`Date: ${new Date().toLocaleString()}`, 300, 65, { align: 'right', width: 255 });

      doc.y = 120;

      // --- Section 1: Overall Analysis (Cards) ---
      checkPageBreak(100);
      const cardWidth = 150;
      const cardSpacing = 32.5;
      let startX = 40;
      const currentY = doc.y;

      doc.rect(startX, currentY, cardWidth, 65).fillAndStroke(BG_LIGHT, CYAN);
      doc.fill(TEXT_MUTED).fontSize(11).font('Helvetica').text('Match Score', startX, currentY + 15, { width: cardWidth, align: 'center' });
      doc.fill(CYAN).fontSize(22).font('Helvetica-Bold').text(`${data.finalScore || data.matchPercentage || 0}%`, startX, currentY + 35, { width: cardWidth, align: 'center' });

      startX += cardWidth + cardSpacing;
      doc.rect(startX, currentY, cardWidth, 65).fillAndStroke(CYAN, CYAN);
      doc.fill('#ffffff').fontSize(11).font('Helvetica').text('ATS Quality Score', startX, currentY + 15, { width: cardWidth, align: 'center' });
      doc.fill('#ffffff').fontSize(22).font('Helvetica-Bold').text(`${data.calculatedScores?.atsScore || data.atsScore || 0}%`, startX, currentY + 35, { width: cardWidth, align: 'center' });

      startX += cardWidth + cardSpacing;
      doc.rect(startX, currentY, cardWidth, 65).fillAndStroke(CYAN, CYAN);
      doc.fill('#ffffff').fontSize(11).font('Helvetica').text('Resume Rank', startX, currentY + 15, { width: cardWidth, align: 'center' });
      doc.fill('#ffffff').fontSize(22).font('Helvetica-Bold').text(`#${data.rank || 1}`, startX, currentY + 35, { width: cardWidth, align: 'center' });

      doc.y = currentY + 85;

      // Score Breakdown Section
      if (data.calculatedScores) {
        addSectionHeader('Deterministic Score Breakdown');
        const scores = data.calculatedScores;
        const weights = scores.weights || { skillWeight: 0.35, projectWeight: 0.20, internshipWeight: 0.15, certWeight: 0.10, eduWeight: 0.10, atsWeight: 0.10 };
        
        doc.fontSize(10).font('Helvetica');
        const renderScore = (label: string, weight: number, score: number, yPos: number, xPos: number) => {
           const wText = Math.round(weight * 100);
           const valText = weight > 0 ? `${score}%` : 'N/A';
           doc.fill(TEXT_MAIN).text(`${label} (${wText}%): `, xPos, yPos, { continued: true }).fill(CYAN).font('Helvetica-Bold').text(valText);
           doc.font('Helvetica');
        };

        checkPageBreak(30);
        renderScore('Skill Match', weights.skillWeight, scores.skillMatchScore, doc.y, 50);
        renderScore('Project Relevance', weights.projectWeight, scores.projectScore, doc.y, 300);
        doc.y += 20;
        
        renderScore('Experience Relevance', weights.internshipWeight, scores.internshipScore, doc.y, 50);
        renderScore('Certification Relevance', weights.certWeight, scores.certificationScore, doc.y, 300);
        doc.y += 20;
        
        renderScore('Education Match', weights.eduWeight, scores.educationScore, doc.y, 50);
        renderScore('ATS Quality', weights.atsWeight, scores.atsScore, doc.y, 300);
        doc.y += 30;
      }

      // --- Section 2: Executive Summary ---
      if (data.executiveSummary) {
         addSectionHeader('Executive Summary');
         checkPageBreak(50);
         doc.fill(TEXT_MAIN).fontSize(10).font('Helvetica').text(cleanText(data.executiveSummary), 40, doc.y, { width: 515, lineGap: 3 });
         doc.y += 15;
      }

      // --- Section 3: Ranking Reason ---
      if (data.rankingReason) {
         addSectionHeader('Ranking Reason');
         checkPageBreak(50);
         doc.fill(TEXT_MAIN).fontSize(10).font('Helvetica').text(cleanText(data.rankingReason), 40, doc.y, { width: 515, lineGap: 3 });
         doc.y += 15;
      }

      // --- Section 4: Top Relevant Skills ---
      if (data.skillMatrix && data.skillMatrix.length > 0) {
        addSectionHeader('Top Relevant Skills');
        doc.fill(DARK_BLUE).fontSize(10).font('Helvetica-Bold');
        doc.text('Skill', 40, doc.y, { width: 150, continued: true }).text('Confidence', 190, doc.y, { width: 80, continued: true }).text('Evidence Found', 270, doc.y);
        doc.y += doc.currentLineHeight() * 0.5;
        
        data.skillMatrix.forEach((sm: any) => {
          const skillText = cleanText(sm.skill);
          const evidenceText = cleanText(sm.evidence);
          doc.fontSize(10).font('Helvetica-Bold');
          const h1 = doc.heightOfString(skillText, { width: 140 });
          doc.font('Helvetica');
          const h2 = doc.heightOfString(evidenceText, { width: 285 });
          const rowHeight = Math.max(h1, h2, 15);
          
          checkPageBreak(rowHeight + 5);
          const startY = doc.y;
          doc.fill(TEXT_MAIN).font('Helvetica-Bold').text(skillText, 40, startY, { width: 140 });
          const color = sm.confidence === 'Highest' ? GREEN : (sm.confidence === 'High' ? CYAN : (sm.confidence === 'Medium' ? '#eab308' : TEXT_MUTED));
          doc.fill(color).font('Helvetica').text(cleanText(sm.confidence), 190, startY, { width: 70 });
          doc.fill(TEXT_MAIN).text(evidenceText, 270, startY, { width: 285 });
          doc.y = startY + rowHeight + 5;
        });
      }

      // --- Item Renderer Helper ---
      const renderItems = (title: string, items: any[], color: string) => {
        if (!items || items.length === 0) return;
        addSectionHeader(title);
        items.forEach((item: any) => {
           doc.fontSize(10).font('Helvetica');
           const relevanceText = `JD Relevance Score: ${item.relevanceScore || 0}/100`;
           const reasonText = `Evidence: ${cleanText(item.evidenceReasoning || item.reason || item.evidence)}`;
           
           const reasonH = doc.heightOfString(reasonText, { width: 505 });
           const rowHeight = 15 + 15 + reasonH + 20; 
           
           checkPageBreak(rowHeight);
           doc.fill(DARK_BLUE).fontSize(11).font('Helvetica-Bold').text(`• ${cleanText(item.projectName || item.certification || item.company)}`, 40, doc.y, { continued: (item.role || item.provider) ? true : false });
           if (item.role) doc.font('Helvetica').text(` - ${cleanText(item.role)}`);
           else if (item.provider) doc.font('Helvetica').text(` - ${cleanText(item.provider)}`);
           else doc.text(''); // Newline
           
           doc.y += doc.currentLineHeight() * 0.2;
           if (item.technologies) {
             doc.fill(TEXT_MAIN).fontSize(10).font('Helvetica').text(`Technologies: ${item.technologies?.join(', ')}`, 50, doc.y);
           }
           if (item.duration) {
             doc.fill(TEXT_MUTED).fontSize(10).font('Helvetica').text(`Duration: ${cleanText(item.duration)}`, 50, doc.y);
           }
           doc.fill(color).font('Helvetica-Bold').text(relevanceText, 50, doc.y);
           doc.fill(TEXT_MAIN).font('Helvetica').text(reasonText, 50, doc.y, { width: 505 });
           doc.y += 10;
        });
      };

      const arrays = data.processedArrays || {};

      // --- Section 5 & 6: Projects ---
      renderItems('Top Relevant Projects', arrays.topProjects, GREEN);
      renderItems('Other Projects', arrays.otherProjects, TEXT_MUTED);

      // --- Section 7 & 8: Internships / Experience ---
      renderItems('Top Relevant Internships & Experience', arrays.topExperience, GREEN);
      renderItems('Other Experience', arrays.otherExperience, TEXT_MUTED);

      // --- Section 9: Certifications ---
      renderItems('Relevant Certifications', arrays.topCerts, CYAN);
      renderItems('Other Certifications', arrays.otherCerts, TEXT_MUTED);

      // --- Section 10: Education ---
      if (data.extractedResumeInfo?.education?.length > 0) {
        addSectionHeader('Education');
        data.extractedResumeInfo.education.forEach((edu: string) => {
           checkPageBreak(20);
           doc.fill(TEXT_MAIN).fontSize(10).font('Helvetica').text(`• ${cleanText(edu)}`, 40, doc.y, { width: 515 });
        });
      }

      // --- Strengths, Weaknesses, Missing Skills Helper ---
      const renderList = (title: string, items: string[], isStrength: boolean, isMissing: boolean = false) => {
         if (!items || items.length === 0) return;
         addSectionHeader(title);
         items.forEach(i => {
            const text = `• ${cleanText(i)}`;
            doc.fontSize(10).font('Helvetica');
            const h = doc.heightOfString(text, { width: 505 });
            checkPageBreak(h + 5);
            doc.fill(isStrength ? GREEN : (isMissing ? RED : TEXT_MUTED)).text(text, 50, doc.y, { width: 505 });
         });
         doc.y += 5;
      };

      // --- Section 11 & 12: Strengths & Weaknesses ---
      renderList('Strengths', data.strengths, true);
      renderList('Weaknesses', data.weaknesses, false);

      // --- Section 13: Missing Skills ---
      const missingAll = [];
      if (data.missingSkills) {
         if (data.missingSkills.critical) missingAll.push(...data.missingSkills.critical.map((s: string) => `${s} (Critical)`));
         if (data.missingSkills.important) missingAll.push(...data.missingSkills.important.map((s: string) => `${s} (Important)`));
         if (data.missingSkills.optional) missingAll.push(...data.missingSkills.optional.map((s: string) => `${s} (Optional)`));
      }
      renderList('Missing Skills', missingAll, false, true);

      // --- Section 14: Growth Potential ---
      if (data.careerGrowthPotential) {
         addSectionHeader('Growth Potential');
         checkPageBreak(50);
         doc.fill(TEXT_MAIN).fontSize(10).font('Helvetica').text(cleanText(data.careerGrowthPotential), 40, doc.y, { width: 515, lineGap: 3 });
         doc.y += 15;
      }

      // --- Section 15: Interview Recommendation ---
      if (data.interviewRecommendation) {
         addSectionHeader('Interview Recommendation');
         checkPageBreak(50);
         doc.fill(TEXT_MAIN).fontSize(10).font('Helvetica').text(cleanText(data.interviewRecommendation), 40, doc.y, { width: 515, lineGap: 3 });
         doc.y += 15;
      }

      // --- Section 16: Final Verdict ---
      const verdict = cleanText(data.finalVerdict || "Analysis Complete");
      const reasoning = cleanText(data.verdictReasoning || "Candidate analyzed.");

      addSectionHeader('CareerDNA Recruiter Verdict');

      doc.font('Helvetica').fontSize(10);
      const reasoningHeight = doc.heightOfString(reasoning, { width: 495 }) + 20;
      
      checkPageBreak(25 + reasoningHeight + 20);
      const verdictStartY = doc.y;
      
      doc.rect(40, verdictStartY, 515, 25).fill(BG_LIGHT).stroke(CYAN);
      doc.fill(CYAN).fontSize(11).font('Helvetica-Bold').text(`Verdict: ${verdict}`, 50, verdictStartY + 7);
      
      const reasoningY = verdictStartY + 25;
      
      doc.rect(40, reasoningY, 515, reasoningHeight).fill(BG_LIGHT).stroke(CYAN);
      doc.fill(TEXT_MAIN).fontSize(10).font('Helvetica').text(reasoning, 50, reasoningY + 10, { width: 495, lineGap: 3 });

      // Update y safely
      doc.y = reasoningY + reasoningHeight + 20;

      // Footer on all pages
      const pages = doc.bufferedPageRange();
      
      // Prune trailing blank pages if any exist
      // pdfkit doesn't allow removing pages easily, but ensuring doc.y > 780 is not crossed manually prevents them.
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.font('Helvetica').fontSize(9).fill(TEXT_MUTED)
           .text(`CareerDNA AI Report - Page ${i + 1} of ${pages.count}`, 40, 810, { align: 'center', width: 515 });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
