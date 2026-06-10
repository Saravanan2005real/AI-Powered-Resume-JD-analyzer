import Groq from 'groq-sdk';

const groq = new Groq();

export const analyzeResume = async (jdText: string, resumeText: string, resumeName: string) => {
  const prompt = `You are an expert ATS (Applicant Tracking System) and senior technical recruiter. 
Please analyze the following resume against the provided job description.
Return ONLY a valid JSON object with the following exact keys and types:
{
  "candidateName": "string (extract from resume)",
  "matchPercentage": "number (0-100)",
  "atsScore": "number (0-100)",
  "skillsMatch": ["array", "of", "strings"],
  "missingSkills": ["array", "of", "strings"],
  "strengths": ["array", "of", "strings"],
  "weaknesses": ["array", "of", "strings"],
  "recommendations": ["array", "of", "strings"]
}

Job Description:
${jdText.substring(0, 3000)}

Resume (${resumeName}):
${resumeText.substring(0, 3000)}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '{}';
    return JSON.parse(responseContent);
  } catch (error) {
    console.error("Groq AI Error in analyzeResume:", error);
    throw error;
  }
};

export const calculateMatch = async () => {
  // Placeholder for future use
  return 85;
};

export const generateRecommendations = async () => {
  // Placeholder for future use
  return ["Improve keywords", "Add certifications"];
};
