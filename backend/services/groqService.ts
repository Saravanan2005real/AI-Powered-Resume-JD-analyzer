import Groq from 'groq-sdk';

export const analyzeResume = async (jdText: string, resumeText: string, resumeName: string) => {
  // Validate API Key before initializing
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is missing. Please configure it in your .env file or system environment variables.');
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const prompt = `You are an expert ATS (Applicant Tracking System), Senior Technical Recruiter, and Career Coach.
Please perform a deep, comprehensive analysis of the following resume against the provided job description.
Return ONLY a valid JSON object matching the exact structure and keys below. Provide detailed, professional, recruiter-grade analysis for all string values.

CRITICAL INSTRUCTION: NEVER return null, undefined, or 'N/A' for any field. If data is missing or not applicable, strictly use the string "Not Available".

JSON SCHEMA:
{
  "candidateName": "string (extract from resume)",
  "matchPercentage": "number (overall match 0-100)",
  "executiveSummary": {
    "profile": "string (1 paragraph candidate profile summary)",
    "suitability": "string (1 paragraph on their suitability for this specific role)",
    "strengths": ["array of 3-5 strings (core strengths)"],
    "opportunities": ["array of 2-3 strings (major improvement opportunities)"]
  },
  "matchScores": {
    "overall": "number (same as matchPercentage)",
    "skills": "number (0-100)",
    "experience": "number (0-100)",
    "ats": "number (0-100)",
    "keywords": "number (0-100)",
    "education": "number (0-100)"
  },
  "jdAnalysis": {
    "title": "string",
    "requiredSkills": ["array of strings"],
    "preferredSkills": ["array of strings"],
    "requiredExperience": "string",
    "responsibilities": ["array of strings"],
    "keywords": ["array of strings"],
    "techStack": ["array of strings"]
  },
  "resumeAnalysis": {
    "skills": ["array of strings"],
    "projects": ["array of short strings (names or brief desc)"],
    "experience": ["array of short strings (roles & companies)"],
    "certifications": ["array of strings"],
    "education": ["array of strings"],
    "techStack": ["array of strings"]
  },
  "educationAnalysis": "string (detailed evaluation of the candidate's education against the JD)",
  "experienceAnalysis": "string (detailed evaluation of the candidate's work experience against the JD)",
  "projectAnalysis": "string (detailed evaluation of the candidate's projects against the JD)",
  "certificationAnalysis": "string (detailed evaluation of the candidate's certifications against the JD)",
  "skillGapAnalysis": {
    "matchedSkills": ["array of strings"],
    "missingSkills": ["array of strings"],
    "partiallyMatchedSkills": ["array of strings"],
    "prioritySkillsToLearn": ["array of strings"]
  },
  "atsAnalysis": {
    "score": "number (0-100)",
    "formatting": "string (evaluation of resume formatting for ATS)",
    "keywords": "string (evaluation of keyword usage)",
    "sectionStructure": "string (evaluation of section headings)",
    "readability": "string (evaluation of readability)",
    "industryStandards": "string (evaluation against industry norms)",
    "recommendations": ["array of strings to improve ATS score"]
  },
  "keywordAnalysis": {
    "found": ["array of strings"],
    "missing": ["array of strings"],
    "criticalMissing": ["array of strings"],
    "impactScore": "number (0-100)",
    "coveragePercentage": "number (0-100)"
  },
  "recruiterVerdict": {
    "verdict": "string (Must be exactly one of: 'Strong Hire', 'Hire', 'Consider', 'Needs Improvement', 'Not Recommended')",
    "reasoning": "string (detailed reasoning for the verdict)"
  },
  "interviewReadiness": {
    "potentialQuestions": ["array of 3-5 strings"],
    "technicalTopics": ["array of 3-5 strings"],
    "conceptsToLearn": ["array of strings"],
    "recommendations": ["array of strings"]
  },
  "roadmap": {
    "currentDNA": "string (short description of current career state)",
    "targetDNA": "string (short description of target state based on JD)",
    "gapAnalysis": "string (summary of the gap)",
    "learningRoadmap": ["array of strings (steps to take)"],
    "recommendedTechnologies": ["array of strings"],
    "suggestedCertifications": ["array of strings"],
    "estimatedTimeline": "string (e.g. '3-6 months')",
    "careerGrowthPath": "string (future career trajectory)"
  },
  "actionPlan": {
    "day30": ["array of strings (tasks for first 30 days)"],
    "day60": ["array of strings (tasks for day 31-60)"],
    "day90": ["array of strings (tasks for day 61-90)"]
  }
}

Job Description:
${jdText.substring(0, 4000)}

Resume (${resumeName}):
${resumeText.substring(0, 4000)}`;

  try {
    console.log(`[DEBUG] Groq request started.`);
    console.log(`[DEBUG] Model name: llama-3.3-70b-versatile`);
    console.log(`[DEBUG] Prompt size: ${prompt.length} characters`);

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '{}';
    
    console.log(`[DEBUG] Raw response length: ${responseContent.length} characters`);
    console.log(`[DEBUG] First 500 characters: ${responseContent.substring(0, 500).replace(/\n/g, ' ')}`);

    try {
      const parsed = JSON.parse(responseContent);
      console.log(`[DEBUG] Parsed JSON success`);
      return parsed;
    } catch (parseError) {
      console.warn("[DEBUG] Direct JSON parsing failed. Attempting to extract JSON from markdown block.");
      // Fallback: extract JSON from markdown if Groq included it
      const jsonMatch = responseContent.match(/```(?:json)?([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsedFallback = JSON.parse(jsonMatch[1].trim());
        console.log(`[DEBUG] Parsed JSON success (via markdown extraction)`);
        return parsedFallback;
      }
      console.error(`[DEBUG] Parsed JSON failure:`, parseError);
      throw parseError; // Re-throw if extraction fails
    }
  } catch (error: any) {
    console.error(`[ERROR] Full Groq error:`, error);
    console.error(`[ERROR] Status code:`, error.status || error.statusCode || 'N/A');
    console.error(`[ERROR] Response payload:`, error.error || error.response?.data || 'N/A');
    console.error(`[ERROR] Stack trace:`, error.stack);
    throw new Error(`AI Analysis failed: ${error.message || 'Unknown Groq error'}`);
  }
};
