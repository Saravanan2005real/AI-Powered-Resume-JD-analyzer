export const analyzeResume = async (jdText: string, resumeText: string, resumeName: string) => {
  // TODO: Integrate Groq AI here in the future
  // For now, return realistic mock data based on the requirements
  
  // Create some simple variability based on resume name length
  const scoreBase = 70 + (resumeName.length % 25);
  
  return {
    candidateName: resumeName.split('.')[0] || "Candidate",
    matchPercentage: Math.min(100, scoreBase + 5),
    atsScore: Math.min(100, scoreBase),
    skillsMatch: ["JavaScript", "React", "Node.js", "TypeScript", "Next.js"].slice(0, 3 + (resumeName.length % 3)),
    missingSkills: ["Docker", "AWS", "GraphQL", "Kubernetes"].slice(0, 1 + (resumeName.length % 3)),
    strengths: [
      "Strong project portfolio",
      "Relevant industry experience",
      "Good educational background"
    ].slice(0, 2),
    weaknesses: [
      "Limited certifications",
      "Could improve ATS keyword optimization"
    ].slice(0, 1),
    recommendations: [
      "Add cloud deployment projects",
      "Incorporate more quantifiable achievements",
      "Expand on backend experience"
    ].slice(0, 2)
  };
};

export const calculateMatch = async () => {
  // Placeholder for future use
  return 85;
};

export const generateRecommendations = async () => {
  // Placeholder for future use
  return ["Improve keywords", "Add certifications"];
};
