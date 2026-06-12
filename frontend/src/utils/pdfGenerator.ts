import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DARK_BLUE = [15, 23, 42] as [number, number, number];
const CYAN = [14, 165, 233] as [number, number, number];
const TEXT_MAIN = [30, 41, 59] as [number, number, number];
const TEXT_MUTED = [100, 116, 139] as [number, number, number];
const BG_LIGHT = [248, 250, 252] as [number, number, number];

const cleanText = (text: string | null | undefined): string => {
  if (!text) return "";
  let cleaned = text
    .replace(/[\u2018\u2019]/g, "'") // Smart single quotes
    .replace(/[\u201C\u201D]/g, '"') // Smart double quotes
    .replace(/[\u2013\u2014]/g, "-") // En and em dashes
    .replace(/[\u2022\u00B7]/g, "-") // Unicode bullets
    .replace(/→/g, "->")             // Right arrow
    .replace(/⇒/g, "=>")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    // Remove markdown artifacts
    .replace(/\*\*/g, "")            // Bold
    .replace(/\*/g, "")              // Italic
    .replace(/#{1,6}\s?/g, "")       // Headers
    .replace(/`/g, "'");             // Code backticks
    
  // Remove any remaining non-ASCII characters to prevent jsPDF corruption
  cleaned = cleaned.replace(/[^\x20-\x7E\n\r\t]/g, "");
  
  return cleaned.trim();
};

export const generateReportPDF = (data: any) => {
  const doc = new jsPDF();
  let currentY = 20;

  const checkPageBreak = (heightNeeded: number) => {
    if (currentY + heightNeeded > 280) {
      doc.addPage();
      currentY = 20;
      return true;
    }
    return false;
  };

  const addHeader = (title: string) => {
    checkPageBreak(25);
    doc.setFillColor(DARK_BLUE[0], DARK_BLUE[1], DARK_BLUE[2]);
    doc.rect(14, currentY, 182, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, 20, currentY + 7);
    currentY += 15;
  };

  // --- Page Header ---
  doc.setFillColor(DARK_BLUE[0], DARK_BLUE[1], DARK_BLUE[2]);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(CYAN[0], CYAN[1], CYAN[2]);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("CareerDNA AI", 14, 20);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Analysis Report", 14, 28);

  // Right side header
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  const candidateName = data.candidateName || "Candidate";
  doc.text(candidateName, 196, 20, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text(`Date: ${new Date().toLocaleString()}`, 196, 28, {
    align: "right",
  });

  currentY = 50;

  // --- Section 1: Overall Analysis (Cards) ---
  checkPageBreak(30);
  const cardWidth = 55;
  const cardSpacing = 8;
  const startX = 14;

  // Match %
  doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
  doc.setDrawColor(CYAN[0], CYAN[1], CYAN[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(startX, currentY, cardWidth, 25, 3, 3, "FD");
  doc.setFontSize(10);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text("Match Score", startX + cardWidth / 2, currentY + 8, {
    align: "center",
  });
  doc.setFontSize(18);
  doc.setTextColor(CYAN[0], CYAN[1], CYAN[2]);
  doc.setFont("helvetica", "bold");
  doc.text(`${data.matchPercentage || 0}%`, startX + cardWidth / 2, currentY + 18, {
    align: "center",
  });

  // ATS Score
  const atsScore = data.atsAnalysis?.score || data.matchScores?.ats || data.atsScore || 0;
  doc.roundedRect(
    startX + cardWidth + cardSpacing,
    currentY,
    cardWidth,
    25,
    3,
    3,
    "FD"
  );
  doc.setFontSize(10);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text(
    "ATS Score",
    startX + cardWidth + cardSpacing + cardWidth / 2,
    currentY + 8,
    { align: "center" }
  );
  doc.setFontSize(18);
  doc.setTextColor(CYAN[0], CYAN[1], CYAN[2]);
  doc.text(
    `${atsScore}%`,
    startX + cardWidth + cardSpacing + cardWidth / 2,
    currentY + 18,
    { align: "center" }
  );

  // Resume Rank
  doc.roundedRect(
    startX + 2 * (cardWidth + cardSpacing),
    currentY,
    cardWidth,
    25,
    3,
    3,
    "FD"
  );
  doc.setFontSize(10);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text(
    "Resume Rank",
    startX + 2 * (cardWidth + cardSpacing) + cardWidth / 2,
    currentY + 8,
    { align: "center" }
  );
  doc.setFontSize(18);
  doc.setTextColor(CYAN[0], CYAN[1], CYAN[2]);
  doc.text(
    `#${data.rank || 1}`,
    startX + 2 * (cardWidth + cardSpacing) + cardWidth / 2,
    currentY + 18,
    { align: "center" }
  );

  currentY += 35;

  // --- Section 2: Skills Analysis ---
  addHeader("Skills Analysis");

  const matchedSkills =
    data.skillGapAnalysis?.matchedSkills || data.skillsMatch || [];
  const missingSkills =
    data.skillGapAnalysis?.missingSkills || data.missingSkills || [];

  if (matchedSkills.length > 0 || missingSkills.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [["Matching Skills", "Missing Skills"]],
      body: [
        [
          matchedSkills.map((s: string) => `+ ${cleanText(s)}`).join("\n") || "None",
          missingSkills.map((s: string) => `- ${cleanText(s)}`).join("\n") || "None",
        ],
      ],
      theme: "grid",
      headStyles: {
        fillColor: BG_LIGHT,
        textColor: DARK_BLUE,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        textColor: TEXT_MAIN,
        valign: "top",
        overflow: "linebreak",
      },
      columnStyles: {
        0: { cellWidth: 91, textColor: [22, 163, 74] }, // Greenish
        1: { cellWidth: 91, textColor: [220, 38, 38] }, // Reddish
      },
      margin: { left: 14, right: 14 },
    });
    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // --- Section 3: Strengths & Weaknesses ---
  const strengths =
    data.executiveSummary?.strengths || data.strengths || [];
  const weaknesses =
    data.executiveSummary?.opportunities || data.weaknesses || [];

  if (strengths.length > 0 || weaknesses.length > 0) {
    addHeader("Strengths & Weaknesses");
    autoTable(doc, {
      startY: currentY,
      head: [["Core Strengths", "Areas of Improvement"]],
      body: [
        [
          strengths.map((s: string) => `- ${cleanText(s)}`).join("\n") || "None",
          weaknesses.map((s: string) => `- ${cleanText(s)}`).join("\n") || "None",
        ],
      ],
      theme: "grid",
      headStyles: {
        fillColor: BG_LIGHT,
        textColor: DARK_BLUE,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        textColor: TEXT_MAIN,
        valign: "top",
        overflow: "linebreak",
      },
      columnStyles: {
        0: { cellWidth: 91 },
        1: { cellWidth: 91 },
      },
      margin: { left: 14, right: 14 },
    });
    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // --- Section 4: Detailed Analysis ---
  addHeader("Detailed Analysis");

  const details = [
    { title: "Education Analysis", content: cleanText(data.educationAnalysis) },
    { title: "Experience Analysis", content: cleanText(data.experienceAnalysis) },
    { title: "Project Analysis", content: cleanText(data.projectAnalysis) },
    { title: "Certification Analysis", content: cleanText(data.certificationAnalysis) },
  ];

  details.forEach((item) => {
    if (item.content) {
      autoTable(doc, {
        startY: currentY,
        head: [[item.title]],
        body: [[item.content]],
        theme: "plain",
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: DARK_BLUE,
          fontSize: 11,
          fontStyle: "bold",
          cellPadding: { top: 4, bottom: 2, left: 0, right: 0 },
        },
        styles: {
          fontSize: 10,
          textColor: TEXT_MAIN,
          cellPadding: { top: 0, bottom: 6, left: 0, right: 0 },
          overflow: "linebreak",
        },
        margin: { left: 14, right: 14 },
      });
      currentY = (doc as any).lastAutoTable.finalY + 2;
    }
  });

  // --- Section 5: Recommendations ---
  const recommendations =
    data.atsAnalysis?.recommendations || data.recommendations || [];
  if (recommendations.length > 0) {
    addHeader("Recommendations");
    autoTable(doc, {
      startY: currentY,
      body: recommendations.map((r: string) => [`- ${cleanText(r)}`]),
      theme: "plain",
      styles: {
        fontSize: 10,
        textColor: TEXT_MAIN,
        cellPadding: { top: 2, bottom: 2, left: 0, right: 0 },
        overflow: "linebreak",
      },
      margin: { left: 14, right: 14 },
    });
    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // --- Section 6: Final Verdict ---
  const verdict = cleanText(data.recruiterVerdict?.verdict || "Analysis Complete");
  const reasoning = cleanText(
    data.recruiterVerdict?.reasoning ||
    "Candidate matches the profile based on the provided data."
  );

  addHeader("Final Verdict");

  autoTable(doc, {
    startY: currentY,
    head: [[`Verdict: ${verdict}`]],
    body: [[reasoning]],
    theme: "grid",
    headStyles: {
      fillColor: BG_LIGHT,
      textColor: CYAN,
      fontSize: 12,
      fontStyle: "bold",
      lineColor: CYAN,
      lineWidth: 0.5,
    },
    styles: {
      fontSize: 10,
      textColor: TEXT_MAIN,
      fillColor: BG_LIGHT,
      lineColor: CYAN,
      lineWidth: 0.5,
      cellPadding: 6,
      overflow: "linebreak",
    },
    margin: { left: 14, right: 14 },
  });

  // Footer on all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(
      `CareerDNA AI Report - Page ${i} of ${pageCount}`,
      105,
      290,
      { align: "center" }
    );
  }

  const fileName = `CareerDNA_Report_${candidateName.replace(
    /\s+/g,
    "_"
  )}.pdf`;
  doc.save(fileName);
};
