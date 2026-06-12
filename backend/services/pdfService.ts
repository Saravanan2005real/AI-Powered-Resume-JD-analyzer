const PDFDocument = require('pdfkit');

export const generateProfessionalPdf = (data: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });
      const buffers: Buffer[] = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);

      // Colors matching Screenshot 2
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
        if (doc.y + heightNeeded > 780) {
          doc.addPage();
        }
      };

      const addSectionHeader = (title: string) => {
        checkPageBreak(50);
        doc.moveDown(1);
        const startY = doc.y;
        doc.rect(40, startY, 515, 25).fill(DARK_BLUE);
        doc.fill('#ffffff').fontSize(12).font('Helvetica-Bold').text(title, 50, startY + 7);
        doc.y = startY + 35; // Advance past the rect
      };

      // --- Page Header ---
      doc.rect(0, 0, 595, 100).fill(DARK_BLUE);
      
      doc.fill(CYAN).fontSize(28).font('Helvetica-Bold').text('CareerDNA AI', 40, 30);
      doc.fill('#ffffff').fontSize(14).font('Helvetica').text('Analysis Report', 40, 65);
      
      const candidateName = cleanText(data.candidateName) || "Candidate";
      doc.fill('#ffffff').fontSize(12).font('Helvetica-Bold').text(candidateName, 300, 35, { align: 'right', width: 255 });
      doc.fill('#cccccc').fontSize(10).font('Helvetica').text(`Date: ${new Date().toLocaleString()}`, 300, 65, { align: 'right', width: 255 });

      doc.y = 130;

      // --- Section 1: Overall Analysis (Cards) ---
      checkPageBreak(100);
      const cardWidth = 150;
      const cardSpacing = 32.5; // (515 - 450) / 2 = 32.5
      let startX = 40;
      const currentY = doc.y;

      // Match Score
      doc.rect(startX, currentY, cardWidth, 65).fillAndStroke(BG_LIGHT, CYAN);
      doc.fill(TEXT_MUTED).fontSize(11).font('Helvetica').text('Match Score', startX, currentY + 15, { width: cardWidth, align: 'center' });
      doc.fill(CYAN).fontSize(22).font('Helvetica-Bold').text(`${data.matchPercentage || data.finalScore || 0}%`, startX, currentY + 35, { width: cardWidth, align: 'center' });

      // ATS Score
      startX += cardWidth + cardSpacing;
      const atsScore = data.atsAnalysis?.score || data.matchScores?.ats || data.atsScore || 0;
      doc.rect(startX, currentY, cardWidth, 65).fillAndStroke(CYAN, CYAN);
      doc.fill('#ffffff').fontSize(11).font('Helvetica').text('ATS Score', startX, currentY + 15, { width: cardWidth, align: 'center' });
      doc.fill('#ffffff').fontSize(22).font('Helvetica-Bold').text(`${atsScore}%`, startX, currentY + 35, { width: cardWidth, align: 'center' });

      // Resume Rank
      startX += cardWidth + cardSpacing;
      doc.rect(startX, currentY, cardWidth, 65).fillAndStroke(CYAN, CYAN);
      doc.fill('#ffffff').fontSize(11).font('Helvetica').text('Resume Rank', startX, currentY + 15, { width: cardWidth, align: 'center' });
      doc.fill('#ffffff').fontSize(22).font('Helvetica-Bold').text(`#${data.rank || 1}`, startX, currentY + 35, { width: cardWidth, align: 'center' });

      doc.y = currentY + 95;

      // --- Section 2: Skills Analysis ---
      const matchedSkills = data.skillGapAnalysis?.matchedSkills || data.skillsMatched || data.resumeAnalysis?.skills || [];
      const missingSkills = data.skillGapAnalysis?.missingSkills || data.missingSkills || [];

      if (matchedSkills.length > 0 || missingSkills.length > 0) {
        addSectionHeader('Skills Analysis');
        
        const matchText = matchedSkills.length > 0 ? matchedSkills.map((s: string) => `+ ${cleanText(s)}`).join('\n') : 'None';
        const missingText = missingSkills.length > 0 ? missingSkills.map((s: string) => `- ${cleanText(s)}`).join('\n') : 'None';

        const startY = doc.y;
        doc.rect(40, startY, 515, 20).fill('#f8fafc');
        doc.rect(40, startY, 515, 20).stroke('#e2e8f0');
        
        doc.fill(DARK_BLUE).fontSize(10).font('Helvetica-Bold').text('Matching Skills', 50, startY + 6);
        doc.text('Missing Skills', 40 + 515/2 + 10, startY + 6);

        const colWidth = 515/2 - 20;
        doc.font('Helvetica').fontSize(10);
        const h1 = doc.heightOfString(matchText, { width: colWidth });
        const h2 = doc.heightOfString(missingText, { width: colWidth });
        const rowHeight = Math.max(h1, h2) + 20;
        
        checkPageBreak(rowHeight + 30);
        const contentY = startY + 20;
        
        // Save current doc.y before drawing table to restore it after
        doc.rect(40, contentY, 515, rowHeight).stroke('#e2e8f0');
        doc.moveTo(40 + 515/2, contentY).lineTo(40 + 515/2, contentY + rowHeight).stroke('#e2e8f0');

        doc.fill(GREEN).text(matchText, 50, contentY + 10, { width: colWidth });
        doc.fill(RED).text(missingText, 40 + 515/2 + 10, contentY + 10, { width: colWidth });

        doc.y = contentY + rowHeight + 20;
      }

      // --- Section 3: Strengths & Weaknesses ---
      const strengths = data.executiveSummary?.strengths || data.strengths || [];
      const weaknesses = data.executiveSummary?.opportunities || data.weaknesses || [];

      if (strengths.length > 0 || weaknesses.length > 0) {
        addSectionHeader('Strengths & Weaknesses');
        
        const strengthsText = strengths.length > 0 ? strengths.map((s: string) => `- ${cleanText(s)}`).join('\n') : 'None';
        const weaknessesText = weaknesses.length > 0 ? weaknesses.map((s: string) => `- ${cleanText(s)}`).join('\n') : 'None';

        const startY = doc.y;
        doc.rect(40, startY, 515, 20).fill('#f8fafc');
        doc.rect(40, startY, 515, 20).stroke('#e2e8f0');
        
        doc.fill(DARK_BLUE).fontSize(10).font('Helvetica-Bold').text('Core Strengths', 50, startY + 6);
        doc.text('Areas of Improvement', 40 + 515/2 + 10, startY + 6);

        const colWidth = 515/2 - 20;
        doc.font('Helvetica').fontSize(10);
        const h1 = doc.heightOfString(strengthsText, { width: colWidth });
        const h2 = doc.heightOfString(weaknessesText, { width: colWidth });
        const rowHeight = Math.max(h1, h2) + 20;
        
        checkPageBreak(rowHeight + 30);
        const contentY = startY + 20;
        
        doc.rect(40, contentY, 515, rowHeight).stroke('#e2e8f0');
        doc.moveTo(40 + 515/2, contentY).lineTo(40 + 515/2, contentY + rowHeight).stroke('#e2e8f0');

        doc.fill(TEXT_MAIN).text(strengthsText, 50, contentY + 10, { width: colWidth });
        doc.fill(TEXT_MAIN).text(weaknessesText, 40 + 515/2 + 10, contentY + 10, { width: colWidth });

        doc.y = contentY + rowHeight + 20;
      }

      // --- Section 4: Evidence Deep Dive ---
      const projects = data.scoreEvidence?.projects || data.resumeAnalysis?.projects || [];
      const internships = data.scoreEvidence?.internships || data.resumeAnalysis?.experience || [];
      const certifications = data.scoreEvidence?.certifications || data.resumeAnalysis?.certifications || [];

      if (projects.length > 0 || internships.length > 0 || certifications.length > 0) {
        addSectionHeader('Evidence Deep Dive');
        
        if (projects.length > 0) {
          doc.fill(DARK_BLUE).fontSize(11).font('Helvetica-Bold').text('Relevant Projects (Evidence):', 40, doc.y);
          doc.moveDown(0.5);
          projects.forEach((p: string) => {
            checkPageBreak(15);
            doc.x = 40;
            doc.fill(TEXT_MAIN).fontSize(10).font('Helvetica').text(`• ${cleanText(p)}`, { width: 515, lineGap: 3, indent: 10 });
          });
          doc.moveDown(1);
        }

        if (internships.length > 0) {
          checkPageBreak(30);
          doc.fill(DARK_BLUE).fontSize(11).font('Helvetica-Bold').text('Relevant Internship / Experience (Evidence):', 40, doc.y);
          doc.moveDown(0.5);
          internships.forEach((p: string) => {
            checkPageBreak(15);
            doc.x = 40;
            doc.fill(TEXT_MAIN).fontSize(10).font('Helvetica').text(`• ${cleanText(p)}`, { width: 515, lineGap: 3, indent: 10 });
          });
          doc.moveDown(1);
        }

        if (certifications.length > 0) {
          checkPageBreak(30);
          doc.fill(DARK_BLUE).fontSize(11).font('Helvetica-Bold').text('Certifications (Evidence):', 40, doc.y);
          doc.moveDown(0.5);
          certifications.forEach((p: string) => {
            checkPageBreak(15);
            doc.x = 40;
            doc.fill(TEXT_MAIN).fontSize(10).font('Helvetica').text(`• ${cleanText(p)}`, { width: 515, lineGap: 3, indent: 10 });
          });
          doc.moveDown(1);
        }
      }

      // --- Section 5: Detailed Analysis ---
      addSectionHeader('Detailed Analysis');

      const details = [
        { title: "Candidate Overview", content: cleanText(data.candidateOverview || data.executiveSummary?.overview) },
        { title: "Match Analysis", content: cleanText(data.matchAnalysis || data.rankingReason) },
        { title: "ATS Analysis", content: cleanText(data.atsAnalysis?.details || data.atsAnalysis?.feedback) },
        { title: "Education Analysis", content: cleanText(data.educationAnalysis) },
        { title: "Experience Relevance", content: cleanText(data.experienceAnalysis) },
        { title: "Project Relevance", content: cleanText(data.projectAnalysis) },
        { title: "Certification Relevance", content: cleanText(data.certificationAnalysis) },
        { title: "Career Growth Potential", content: cleanText(data.careerPotential) },
        { title: "Interview Recommendation", content: cleanText(data.interviewRecommendation) },
      ];

      // Comparison Awards
      if (data.comparisonAwards) {
        let awardsText = "";
        const name = data.candidateName || data.originalName;
        if (data.comparisonAwards.bestTechnicalCandidate === name) awardsText += "- Best Technical Candidate\n";
        if (data.comparisonAwards.bestProjectPortfolio === name) awardsText += "- Best Project Portfolio\n";
        if (data.comparisonAwards.bestIndustryExperience === name) awardsText += "- Best Industry Experience\n";
        if (data.comparisonAwards.bestLearningPotential === name) awardsText += "- Best Learning Potential\n";
        if (data.comparisonAwards.bestOverallFit === name) awardsText += "- Best Overall Fit\n";
        
        if (awardsText) {
           details.push({ title: "Multi-Resume Comparison Awards", content: cleanText(awardsText) });
        }
      }

      details.forEach((item) => {
        if (item.content) {
          checkPageBreak(80);
          doc.x = 40;
          doc.fill(DARK_BLUE).fontSize(11).font('Helvetica-Bold').text(item.title);
          doc.moveDown(0.5);
          doc.x = 40;
          doc.fill(TEXT_MAIN).fontSize(10).font('Helvetica').text(item.content, { width: 515, align: 'justify', lineGap: 3 });
          doc.moveDown(1.5);
        }
      });

      // --- Section 6: Recommendations ---
      const recommendations = data.atsAnalysis?.recommendations || data.recommendations || [];
      if (recommendations.length > 0) {
        addSectionHeader('Improvement Suggestions');
        recommendations.forEach((r: string) => {
           checkPageBreak(20);
           doc.x = 40;
           doc.fill(TEXT_MAIN).fontSize(10).font('Helvetica').text(`• ${cleanText(r)}`, { width: 515, lineGap: 3, indent: 10 });
        });
        doc.moveDown(1);
      }

      // --- Section 7: Final Verdict ---
      const verdict = cleanText(data.recruiterVerdict?.verdict || data.verdict || "Analysis Complete");
      const reasoning = cleanText(
        data.recruiterVerdict?.reasoning || data.verdictReasoning ||
        "Candidate matches the profile based on the provided data."
      );

      addSectionHeader('Final Hiring Verdict');

      const verdictStartY = doc.y;
      // Ensure we have enough space for the title box and reasoning block
      doc.font('Helvetica').fontSize(10);
      const reasoningHeight = doc.heightOfString(reasoning, { width: 495 }) + 20;
      if (verdictStartY + 25 + reasoningHeight + 20 > 780) {
        doc.addPage();
      }
      
      const newVerdictStartY = doc.y;
      doc.rect(40, newVerdictStartY, 515, 25).fill(BG_LIGHT).stroke(CYAN);
      doc.fill(CYAN).fontSize(11).font('Helvetica-Bold').text(`Verdict: ${verdict}`, 50, newVerdictStartY + 7);
      
      const reasoningY = newVerdictStartY + 25;
      doc.rect(40, reasoningY, 515, reasoningHeight).fill(BG_LIGHT).stroke(CYAN);
      doc.fill(TEXT_MAIN).fontSize(10).font('Helvetica').text(reasoning, 50, reasoningY + 10, { width: 495, lineGap: 3 });

      doc.y = reasoningY + reasoningHeight + 20;

      // Footer on all pages
      const pages = doc.bufferedPageRange();
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
