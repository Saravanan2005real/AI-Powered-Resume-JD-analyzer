import PDFDocument from 'pdfkit';

export const generateProfessionalPdf = (data: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);

      // Colors
      const PRIMARY = '#0ea5e9'; // Neon blue
      const SECONDARY = '#a855f7'; // Purple
      const TEXT_MAIN = '#1e293b';
      const TEXT_MUTED = '#64748b';
      const BG_LIGHT = '#f8fafc';

      // Helper function for headers
      const addHeader = (text: string) => {
        doc.moveDown(2);
        doc.rect(50, doc.y, 495, 30).fill(BG_LIGHT);
        doc.fill(PRIMARY).fontSize(16).font('Helvetica-Bold').text(text, 60, doc.y - 22);
        doc.moveDown(1);
      };

      // Helper for bullet points
      const addBullets = (items: string[]) => {
        if (!items || items.length === 0) {
          doc.fill(TEXT_MUTED).fontSize(11).font('Helvetica-Oblique').text('Not Available', { indent: 20 });
          doc.moveDown(0.5);
          return;
        }
        items.forEach(item => {
          doc.fill(TEXT_MAIN).fontSize(11).font('Helvetica').text(`• ${item}`, { indent: 20, lineGap: 4 });
        });
        doc.moveDown(0.5);
      };

      // Helper for text fallback
      const safeText = (text: string | undefined | null) => {
        return text ? text : 'Not Available';
      };

      // ================= COVER PAGE =================
      doc.rect(0, 0, 595, 842).fill('#0f172a'); // Dark background for cover

      doc.fill(PRIMARY).fontSize(48).font('Helvetica-Bold').text('CareerDNA AI', 50, 160, { align: 'center' });
      doc.fill(SECONDARY).fontSize(18).font('Helvetica').text('Talent Intelligence Report', 50, 220, { align: 'center' });
      
      if (data.rank) {
        doc.fill('#fbbf24').fontSize(20).font('Helvetica-Bold').text(`Rank: #${data.rank}`, 50, 260, { align: 'center' });
      }

      doc.moveDown(4);
      doc.fill('#ffffff').fontSize(24).font('Helvetica-Bold').text(safeText(data.candidateName), { align: 'center' });
      doc.moveDown(1);
      doc.fill('#cbd5e1').fontSize(16).font('Helvetica').text(`Target Role: ${safeText(data.jdAnalysis?.title)}`, { align: 'center' });
      
      doc.moveDown(3);
      doc.rect(200, doc.y, 195, 100).fill('#1e293b').stroke('#0ea5e9');
      doc.fill('#0ea5e9').fontSize(14).text('CareerDNA Match Score', 200, doc.y - 85, { align: 'center' });
      doc.fill('#ffffff').fontSize(42).font('Helvetica-Bold').text(data.matchPercentage != null ? `${data.matchPercentage}%` : 'Not Available', 200, doc.y - 50, { align: 'center' });

      doc.fill('#64748b').fontSize(10).font('Helvetica').text(`Generated on ${new Date().toLocaleDateString()}`, 50, 750, { align: 'center' });
      
      doc.addPage();
      // ================= END COVER PAGE =================

      // Global resets for internal pages
      doc.fill(TEXT_MAIN);

      // 1. EXECUTIVE SUMMARY
      addHeader('1. EXECUTIVE SUMMARY');
      doc.fontSize(12).font('Helvetica-Bold').text('Candidate Profile');
      doc.font('Helvetica').fontSize(11).text(safeText(data.executiveSummary?.profile), { lineGap: 4, align: 'justify' });
      doc.moveDown();
      
      doc.font('Helvetica-Bold').text('Role Suitability');
      doc.font('Helvetica').text(safeText(data.executiveSummary?.suitability), { lineGap: 4, align: 'justify' });
      doc.moveDown();

      doc.font('Helvetica-Bold').text('Core Strengths');
      addBullets(data.executiveSummary?.strengths);

      doc.font('Helvetica-Bold').text('Improvement Opportunities');
      addBullets(data.executiveSummary?.opportunities);

      // 2. MATCH SCORE BREAKDOWN
      addHeader('2. MATCH SCORE BREAKDOWN');
      const scores = data.matchScores || {};
      const scoreItems = [
        { label: 'Overall Match', val: scores.overall },
        { label: 'Skills Match', val: scores.skills },
        { label: 'Experience Fit', val: scores.experience },
        { label: 'ATS Optimization', val: scores.ats },
        { label: 'Keyword Match', val: scores.keywords }
      ];

      let yPos = doc.y;
      scoreItems.forEach((s, idx) => {
        const y = yPos + (idx * 30);
        doc.fill(TEXT_MAIN).fontSize(11).font('Helvetica-Bold').text(s.label, 50, y);
        // Bar background
        doc.rect(200, y, 300, 15).fill('#e2e8f0');
        // Bar fill
        if (s.val != null) doc.rect(200, y, (s.val / 100) * 300, 15).fill(PRIMARY);
        // Text value
        doc.fill(TEXT_MAIN).fontSize(11).text(s.val != null ? `${s.val}%` : 'Not Available', 510, y);
      });
      doc.y = yPos + (scoreItems.length * 30) + 20;

      // 3. DEEP DIVE ANALYSIS
      addHeader('3. DEEP DIVE ANALYSIS');
      doc.font('Helvetica-Bold').text('Education Analysis');
      doc.font('Helvetica').text(safeText(data.educationAnalysis), { lineGap: 4 });
      doc.moveDown();
      
      doc.font('Helvetica-Bold').text('Experience Analysis');
      doc.font('Helvetica').text(safeText(data.experienceAnalysis), { lineGap: 4 });
      doc.moveDown();

      doc.font('Helvetica-Bold').text('Project Analysis');
      doc.font('Helvetica').text(safeText(data.projectAnalysis), { lineGap: 4 });
      doc.moveDown();

      doc.font('Helvetica-Bold').text('Certification Analysis');
      doc.font('Helvetica').text(safeText(data.certificationAnalysis), { lineGap: 4 });
      doc.moveDown();

      doc.addPage();

      // 4. SKILL GAP ANALYSIS
      addHeader('4. SKILL GAP ANALYSIS');
      doc.font('Helvetica-Bold').text('Matched Skills (Strengths):');
      addBullets(data.skillGapAnalysis?.matchedSkills);
      
      doc.font('Helvetica-Bold').fill('#ef4444').text('Missing Skills (Gaps):');
      doc.fill(TEXT_MAIN);
      addBullets(data.skillGapAnalysis?.missingSkills);
      
      doc.font('Helvetica-Bold').text('Priority Skills to Learn:');
      addBullets(data.skillGapAnalysis?.prioritySkillsToLearn);

      // 5. ATS & KEYWORD ANALYSIS
      addHeader('5. ATS & KEYWORD ANALYSIS');
      doc.font('Helvetica-Bold').text(`ATS Score: ${data.atsAnalysis?.score != null ? `${data.atsAnalysis.score}%` : 'Not Available'}`);
      doc.moveDown();
      doc.font('Helvetica-Bold').text('Formatting & Structure:');
      doc.font('Helvetica').text(safeText(data.atsAnalysis?.formatting), { lineGap: 4 });
      doc.moveDown();
      
      doc.font('Helvetica-Bold').text('Missing Keywords:');
      addBullets(data.keywordAnalysis?.missing);

      doc.font('Helvetica-Bold').text('ATS Optimization Recommendations:');
      addBullets(data.atsAnalysis?.recommendations);

      doc.addPage();

      // 6. RECRUITER VERDICT & INTERVIEW READINESS
      addHeader('6. RECRUITER VERDICT & INTERVIEW READINESS');
      doc.fontSize(14).font('Helvetica-Bold').fill(data.recruiterVerdict?.verdict === 'Strong Hire' ? PRIMARY : SECONDARY)
         .text(`Verdict: ${safeText(data.recruiterVerdict?.verdict)}`);
      doc.fill(TEXT_MAIN).fontSize(11).font('Helvetica').text(safeText(data.recruiterVerdict?.reasoning), { lineGap: 4 });
      doc.moveDown();

      doc.font('Helvetica-Bold').text('Suggested Interview Questions:');
      addBullets(data.interviewReadiness?.potentialQuestions);

      // 7. CAREER DNA ROADMAP
      addHeader('7. CAREER DNA ROADMAP');
      doc.font('Helvetica-Bold').text('Current vs Target State');
      doc.font('Helvetica').text(`Current: ${safeText(data.roadmap?.currentDNA)}`, { lineGap: 4 });
      doc.text(`Target: ${safeText(data.roadmap?.targetDNA)}`, { lineGap: 4 });
      doc.moveDown();

      doc.font('Helvetica-Bold').text('Learning Roadmap');
      addBullets(data.roadmap?.learningRoadmap);

      doc.font('Helvetica-Bold').text('Recommended Technologies & Certifications');
      const allRecs = [...(data.roadmap?.recommendedTechnologies || []), ...(data.roadmap?.suggestedCertifications || [])];
      addBullets(allRecs);

      doc.font('Helvetica-Bold').text(`Estimated Timeline: ${safeText(data.roadmap?.estimatedTimeline)}`);
      doc.moveDown();

      doc.addPage();

      // 8. ACTION PLAN (30-60-90)
      addHeader('8. ACTION PLAN');
      
      doc.font('Helvetica-Bold').fill(PRIMARY).text('First 30 Days:');
      doc.fill(TEXT_MAIN);
      addBullets(data.actionPlan?.day30);

      doc.font('Helvetica-Bold').fill(PRIMARY).text('60 Days:');
      doc.fill(TEXT_MAIN);
      addBullets(data.actionPlan?.day60);

      doc.font('Helvetica-Bold').fill(PRIMARY).text('90 Days:');
      doc.fill(TEXT_MAIN);
      addBullets(data.actionPlan?.day90);

      // Footer on all pages
      const pages = doc.bufferedPageRange();
      for (let i = 1; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.font('Helvetica').fontSize(9).fill(TEXT_MUTED)
           .text(`CareerDNA AI Report - Confidential - Page ${i + 1}`, 50, 800, { align: 'center' });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
