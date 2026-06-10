import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateReportPDF = (analysisResults: any[]) => {
  const doc = new jsPDF();
  
  // Add Title
  doc.setFontSize(22);
  doc.setTextColor(14, 165, 233);
  doc.text("CareerDNA AI Analysis Report", 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  let startY = 40;

  analysisResults.forEach((result: any, index: number) => {
    if (index > 0) {
      doc.addPage();
      startY = 20;
    }

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`Rank #${result.rank}: ${result.candidateName}`, 14, startY);
    
    doc.setFontSize(12);
    doc.text(`Match: ${result.matchPercentage}%  |  ATS Score: ${result.atsScore}`, 14, startY + 8);
    
    const bodyData = [
      ["Strengths", result.strengths?.join(", ") || "None"],
      ["Weaknesses", result.weaknesses?.join(", ") || "None"],
      ["Skills Match", result.skillsMatch?.join(", ") || "None"],
      ["Missing Skills", result.missingSkills?.join(", ") || "None"],
      ["Recommendations", result.recommendations?.join("\n") || "None"]
    ];

    autoTable(doc, {
      startY: startY + 16,
      head: [['Category', 'Details']],
      body: bodyData,
      theme: 'grid',
      headStyles: { fillColor: [14, 165, 233] },
      styles: { cellPadding: 4, fontSize: 10, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 'auto' }
      }
    });
    
    // update startY for the next iteration (if we were drawing multiple tables on one page, but here we add a page per candidate)
    startY = (doc as any).lastAutoTable.finalY + 10;
  });

  doc.save("CareerDNA_Report.pdf");
};
