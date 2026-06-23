import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseStructuredResume } from './structuredParser';
export const analyzeResume = async (jdText: string, resumeText: string, resumeName: string) => {
  // Validate API Key before initializing
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is missing. Please configure it in your .env file or system environment variables.');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1, // Low temperature for deterministic output and consistent relevance scores
      topP: 0.1,
    },
  });

  // Parse raw resume text into structured JSON before sending to Gemini
  const structuredResume = parseStructuredResume(resumeText);
  const structuredResumeString = JSON.stringify(structuredResume, null, 2);

  const prompt = `You are an expert Technical Recruiter, ATS Expert, Hiring Manager, and Career Assessment Specialist.
Please perform a deep, comprehensive extraction and analysis of the following structured resume against the provided job description.
Your output must be 100% EVIDENCE-BASED.

CRITICAL REQUIREMENT:
1. Extract ALL information comprehensively without losing data. NEVER output "No certifications" or "No projects" if they exist in the structured resume. The resume has been pre-parsed into sections (skills, certifications, education, projects, experience, contactInfo). You MUST map all items from these pre-parsed sections to the final output.
2. For EVERY Project, Internship, Experience, Certification, and Achievement, you must calculate a "relevanceScore" (0 to 100 integer) based on JD overlap (technology, domain, complexity, impact, recency).
3. Provide an "evidenceReasoning" for every score (e.g. "Matches Python, LLMs, RAG, NLP and Backend APIs.").
4. Skill Confidence Mapping: In the skillMatrix, assign confidence based on evidence:
   - "Highest": Skill demonstrated multiple times with measurable outcomes.
   - "High": Skill used in an internship or professional experience.
   - "Medium": Skill used in a project.
   - "Low": Skill only listed in skills section.
5. Provide an "executiveSummary" written like an experienced senior recruiter (Avoid generic ATS phrasing).

Return STRICT JSON ONLY matching the exact structure below. DO NOT include markdown formatting (\`\`\`json).
All "relevanceScore" fields MUST be integers between 0 and 100.

{
  "candidateName": "string",
  "extractedJdInfo": {
    "requiredSkills": ["string"],
    "preferredSkills": ["string"],
    "requiredTechnologies": ["string"],
    "preferredTechnologies": ["string"],
    "responsibilities": ["string"],
    "requiredExperienceYears": 0,
    "certifications": ["string"],
    "domain": "string",
    "keywords": ["string"]
  },
  "extractedResumeInfo": {
    "education": ["string"],
    "skills": ["string"],
    "programmingLanguages": ["string"],
    "frameworks": ["string"],
    "databases": ["string"],
    "aiTechnologies": ["string"],
    "achievements": ["string"],
    "leadership": ["string"],
    "publications": ["string"],
    "research": ["string"],
    "awards": ["string"]
  },
  "executiveSummary": "string",
  "evidenceMapping": [
    { "jdRequirement": "string", "resumeEvidence": "string" }
  ],
  "certifications": [
    { "certification": "string", "provider": "string", "relevanceScore": 0, "evidenceReasoning": "string" }
  ],
  "projects": [
    { "projectName": "string", "technologies": ["string"], "relevanceScore": 0, "evidenceReasoning": "string", "impact": "string" }
  ],
  "internships": [
    { "company": "string", "role": "string", "duration": "string", "relevanceScore": 0, "evidenceReasoning": "string", "impact": "string" }
  ],
  "experience": [
    { "company": "string", "role": "string", "duration": "string", "relevanceScore": 0, "evidenceReasoning": "string", "impact": "string" }
  ],
  "skillMatrix": [
    { "skill": "string", "evidence": "string", "confidence": "Highest/High/Medium/Low" }
  ],
  "missingSkills": {
    "critical": ["string"],
    "important": ["string"],
    "optional": ["string"]
  },
  "strengths": ["string"],
  "weaknesses": ["string"],
  "careerGrowthPotential": "string",
  "interviewRecommendation": "string",
  "finalVerdict": "string",
  "verdictReasoning": "string"
}

Job Description:
${jdText.substring(0, 4000)}

Structured Resume (${resumeName}):
${structuredResumeString.substring(0, 15000)}`;

  try {
    console.log(`[DEBUG] Gemini request started for ${resumeName}`);
    
    // Add timeout handling using Promise.race (Gemini SDK doesn't have a built-in timeout in all versions)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout')), 60000)
    );
    
    const result: any = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);

    const responseContent = result.response.text();

    try {
      const parsed = JSON.parse(responseContent);
      return parsed;
    } catch (parseError) {
      console.error('[ERROR] Failed to parse Gemini response as JSON');
      throw new Error('Invalid JSON response from Gemini');
    }
  } catch (error: any) {
    console.error(`[ERROR] AI Analysis failed:`, error.message);
    if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw new Error(`AI Analysis failed: ${error.message}`);
  }
};

export const compareResumes = async (jdText: string, candidatesData: any[]) => {
  if (!process.env.GEMINI_API_KEY) return candidatesData;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
      topP: 0.1,
    },
  });
  
  // Extract minimal candidate summaries for comparison to fit in context window
  const candidateSummaries = candidatesData.map(c => ({
    name: c.candidateName || c.originalName,
    matchPercentage: c.matchPercentage,
    rankingScore: c.rankingScore,
    skills: c.skillsMatch,
    experience: c.experienceAnalysis,
    projects: c.projectAnalysis
  }));

  const prompt = `You are an Expert Technical Recruiter comparing multiple candidates for a specific Job Description.
Review the candidates and provide ranking reasons and awards. Be strictly objective. Explain WHY a higher ranked candidate beat a lower ranked candidate based on evidence.

RULES FOR MULTI-RESUME COMPARISON:
Compare resumes using strictly:
- Skill Match
- Project Quality
- Internship Relevance
- Certification Strength
- JD Alignment

Awards must be strictly evidence-based.

Return ONLY a valid JSON object matching this schema:
{
  "comparisons": [
    {
      "candidateName": "string",
      "rankingReason": "string (Explain exactly why this candidate deserves their rank compared to others based on evidence.)"
    }
  ],
  "awards": {
    "bestGenerativeAIExperience": "string (Candidate Name)",
    "bestResearchBackground": "string (Candidate Name)",
    "strongestCertificationProfile": "string (Candidate Name)",
    "bestProjectPortfolio": "string (Candidate Name)",
    "highestJobAlignment": "string (Candidate Name)"
  }
}

Job Description:
${jdText.substring(0, 3000)}

Candidates:
${JSON.stringify(candidateSummaries)}`;

  try {
    const result = await model.generateContent(prompt);
    const responseContent = result.response.text();
    
    let parsed: any;
    try {
      parsed = JSON.parse(responseContent);
    } catch(e) {
      return candidatesData; // Fallback to returning original data
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
