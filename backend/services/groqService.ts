import Groq from 'groq-sdk';

export const analyzeResume = async (jdText: string, resumeText: string, resumeName: string) => {
  // Validate API Key before initializing
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is missing. Please configure it in your .env file or system environment variables.');
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const prompt = `You are an expert Technical Recruiter and Intelligent Recruitment Analysis System.
Please perform a deep, comprehensive analysis of the following resume against the provided job description.
DO NOT use simple keyword matching. Use strict evidence-based validation. Reward skills only if there is evidence they were used in Projects, Internships, or Experience.

Return ONLY a valid JSON object matching the exact structure below.

CRITICAL INSTRUCTION: NEVER return null, undefined, or 'N/A' for any field. Use empty arrays [] or the string "Not Available" if data is missing.

JSON SCHEMA:
{
  "candidateName": "string (extract from resume)",
  "skillMatchScore": "number (0-100, based on evidence of skill usage)",
  "projectScore": "number (0-100, based on project relevance and complexity)",
  "internshipScore": "number (0-100, based on relevant experience/internships)",
  "technicalDepthScore": "number (0-100, based on technical complexity demonstrated)",
  "educationScore": "number (0-100, based on education requirements)",
  "certificationScore": "number (0-100, based on relevant certifications)",
  "growthPotentialScore": "number (0-100, based on hackathons, leadership, achievements, open source)",
  
  "skillsMatched": ["array of strings (skills with evidence)"],
  "missingSkills": ["array of strings (mandatory/preferred skills missing)"],
  "strengths": ["array of strings"],
  "weaknesses": ["array of strings"],
  "recommendations": ["array of strings (how to improve)"],

  "educationAnalysis": "string (detailed evaluation of education)",
  "experienceAnalysis": "string (detailed evaluation of internships/experience)",
  "projectAnalysis": "string (detailed evaluation of projects)",
  "certificationAnalysis": "string (detailed evaluation of certifications)",

  "careerPotential": "string (evaluation of long-term potential)",
  "interviewRecommendation": "string (topics to test in interview)",

  "scoreEvidence": {
    "skills": ["array of strings (evidence of skill usage)"],
    "projects": ["array of strings (evidence of strong projects)"],
    "internships": ["array of strings (evidence of relevant work)"],
    "certifications": ["array of strings"],
    "education": ["array of strings"]
  },

  "matchPercentage": "number (this will be overwritten, but output a realistic 0-100 number)",
  "matchScores": {
    "ats": "number (0-100, purely formatting/ATS check for legacy compatibility)",
    "skills": "number (0-100)",
    "experience": "number (0-100)"
  },
  "executiveSummary": {
    "profile": "string (1 paragraph profile)",
    "suitability": "string (1 paragraph suitability)",
    "strengths": ["array of strings"],
    "opportunities": ["array of strings"]
  },
  "atsAnalysis": {
    "score": "number (0-100)",
    "recommendations": ["array of strings"]
  },
  "recruiterVerdict": {
    "verdict": "string",
    "reasoning": "string"
  }
}

Job Description:
${jdText.substring(0, 4000)}

Resume (${resumeName}):
${resumeText.substring(0, 4000)}`;

  try {
    console.log(`[DEBUG] Groq request started for ${resumeName}`);
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '{}';

    try {
      const parsed = JSON.parse(responseContent);
      return parsed;
    } catch (parseError) {
      const jsonMatch = responseContent.match(/\`\`\`(?:json)?([\s\S]*?)\`\`\`/);
      if (jsonMatch && jsonMatch[1]) {
         return JSON.parse(jsonMatch[1].trim());
      }
      throw parseError;
    }
  } catch (error: any) {
    console.error(`[ERROR] AI Analysis failed:`, error.message);
    throw new Error(`AI Analysis failed: ${error.message}`);
  }
};

export const compareResumes = async (jdText: string, candidatesData: any[]) => {
  if (!process.env.GROQ_API_KEY) return candidatesData;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  // Extract minimal candidate summaries for comparison to fit in context window
  const candidateSummaries = candidatesData.map(c => ({
    name: c.candidateName || c.originalName,
    finalScore: c.finalScore,
    skills: c.skillsMatched,
    experience: c.experienceAnalysis,
    projects: c.projectAnalysis
  }));

  const prompt = `You are an Expert Technical Recruiter comparing multiple candidates for a specific Job Description.
Review the candidates and provide ranking reasons and awards. Be strictly objective. Explain WHY a higher ranked candidate beat a lower ranked candidate based on evidence.

Return ONLY a valid JSON object matching this schema:
{
  "comparisons": [
    {
      "candidateName": "string",
      "rankingReason": "string (Explain exactly why this candidate deserves their rank compared to others. e.g. 'Beat Candidate B due to superior project evidence in React.')"
    }
  ],
  "awards": {
    "bestTechnicalCandidate": "string (Candidate Name)",
    "bestProjectPortfolio": "string (Candidate Name)",
    "bestIndustryExperience": "string (Candidate Name)",
    "bestLearningPotential": "string (Candidate Name)",
    "bestOverallFit": "string (Candidate Name)"
  }
}

Job Description:
${jdText.substring(0, 3000)}

Candidates:
${JSON.stringify(candidateSummaries)}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(responseContent);
    } catch(e) {
      const jsonMatch = responseContent.match(/\`\`\`(?:json)?([\s\S]*?)\`\`\`/);
      if (jsonMatch && jsonMatch[1]) {
        parsed = JSON.parse(jsonMatch[1].trim());
      } else {
        return candidatesData; // Fallback to returning original data
      }
    }

    // Attach ranking reason back to the data
    const enrichedData = candidatesData.map(c => {
      const name = c.candidateName || c.originalName;
      const comp = parsed.comparisons?.find((p: any) => p.candidateName === name);
      return {
        ...c,
        rankingReason: comp ? comp.rankingReason : "Candidate matches profile requirements.",
        comparisonAwards: parsed.awards || {}
      };
    });

    return enrichedData;
  } catch (error) {
    console.error('[ERROR] Multi-resume comparison failed:', error);
    return candidatesData; // Fallback to individual analysis without comparison
  }
};
