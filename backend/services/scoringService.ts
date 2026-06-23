export const calculateDeterministicScores = (parsedAnalysis: any) => {
  // Safe extraction of objects
  const skillMatrix = parsedAnalysis.skillMatrix || [];
  
  // Safe parser
  const getScore = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  // Sort projects by relevanceScore
  let projects = parsedAnalysis.projects || [];
  projects.sort((a: any, b: any) => getScore(b.relevanceScore) - getScore(a.relevanceScore));
  const topProjects = projects.filter((p: any) => getScore(p.relevanceScore) >= 70); // Loosen threshold to 70 for grouping
  const otherProjects = projects.filter((p: any) => getScore(p.relevanceScore) < 70);

  // Sort internships & experience
  let internships = parsedAnalysis.internships || [];
  let experience = parsedAnalysis.experience || [];
  const allExp = [...internships, ...experience];
  allExp.sort((a: any, b: any) => getScore(b.relevanceScore) - getScore(a.relevanceScore));
  
  const topExperience = allExp.filter((e: any) => getScore(e.relevanceScore) >= 70);
  const otherExperience = allExp.filter((e: any) => getScore(e.relevanceScore) < 70);

  // Sort certifications
  let certs = parsedAnalysis.certifications || [];
  certs.sort((a: any, b: any) => getScore(b.relevanceScore) - getScore(a.relevanceScore));
  const topCerts = certs.filter((c: any) => getScore(c.relevanceScore) >= 70);
  const otherCerts = certs.filter((c: any) => getScore(c.relevanceScore) < 70);

  // 1. Skill Match Score (35%)
  let skillPoints = 0;
  skillMatrix.forEach((sm: any) => {
    if (sm.confidence === 'Highest') skillPoints += 10;
    else if (sm.confidence === 'High') skillPoints += 8;
    else if (sm.confidence === 'Medium') skillPoints += 5;
    else if (sm.confidence === 'Low') skillPoints += 2;
  });
  
  // Base expectation: Cap at 40 points (approx 5 High confidence skills) 
  // so JDs with 30 skills don't artificially destroy the score.
  const jdSkillsCount = parsedAnalysis.extractedJdInfo?.requiredSkills?.length || 5;
  const expectedPoints = Math.min(Math.max(jdSkillsCount * 5, 20), 40); 
  let skillMatchScore = skillMatrix.length > 0 ? Math.min(Math.round((skillPoints / expectedPoints) * 100), 100) : 0;

  // 2. Project Relevance Score (20%)
  // Sum of relevance scores, capped at 100
  let projectScore = 0;
  if (projects.length > 0) {
     const projSum = projects.reduce((acc: number, p: any) => acc + getScore(p.relevanceScore), 0);
     projectScore = Math.min(Math.round(projSum), 100);
  }

  // 3. Internship/Experience Relevance Score (15%)
  let internshipScore = 0;
  if (allExp.length > 0) {
     const expSum = allExp.reduce((acc: number, e: any) => acc + getScore(e.relevanceScore), 0);
     internshipScore = Math.min(Math.round(expSum), 100);
  }

  // 4. Certification Relevance Score (10%)
  let certificationScore = 0;
  if (certs.length > 0) {
     const certSum = certs.reduce((acc: number, c: any) => acc + getScore(c.relevanceScore), 0);
     certificationScore = Math.min(Math.round(certSum), 100);
  }

  // 5. Education Match (10%)
  // Baseline 80 if exists, up to 100 with achievements
  const education = parsedAnalysis.extractedResumeInfo?.education || [];
  let educationScore = education.length > 0 ? 80 : 0;
  if (parsedAnalysis.extractedResumeInfo?.achievements?.length > 0) educationScore += 10;
  if (parsedAnalysis.extractedResumeInfo?.leadership?.length > 0) educationScore += 10;
  educationScore = Math.min(educationScore, 100);

  // 6. ATS Quality & Technical Depth (10%)
  let atsScore = 0;
  if (skillMatrix.length > 0) atsScore += 20;
  if (projects.length > 0) atsScore += 20;
  if (allExp.length > 0) atsScore += 20;
  if (education.length > 0) atsScore += 20;
  if (certs.length > 0) atsScore += 20;

  // Dynamic Weight Distribution
  let skillWeight = 0.35;
  let projectWeight = 0.20;
  let internshipWeight = 0.15;
  let certWeight = 0.10;
  const eduWeight = 0.10;
  const atsWeight = 0.10;

  if (projects.length === 0) {
    internshipWeight += projectWeight; // Shift project weight to experience
    projectWeight = 0;
  }
  if (certs.length === 0) {
    skillWeight += certWeight; // Shift cert weight to skills
    certWeight = 0;
  }

  // Final Weighted Rank Score
  const finalScore = Math.round(
    (skillMatchScore * skillWeight) +
    (projectScore * projectWeight) +
    (internshipScore * internshipWeight) +
    (certificationScore * certWeight) +
    (educationScore * eduWeight) +
    (atsScore * atsWeight)
  );

  return {
    skillMatchScore,
    projectScore,
    internshipScore,
    educationScore,
    certificationScore,
    atsScore,
    finalScore,
    
    // Export weights for the PDF to render accurately
    weights: {
       skillWeight,
       projectWeight,
       internshipWeight,
       certWeight,
       eduWeight,
       atsWeight
    },
    
    // Processed grouped arrays
    processedArrays: {
       topProjects,
       otherProjects,
       topExperience,
       otherExperience,
       topCerts,
       otherCerts
    }
  };
};
