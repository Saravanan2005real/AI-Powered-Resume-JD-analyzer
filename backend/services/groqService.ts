import Groq from 'groq-sdk';
import { parseStructuredResume } from './structuredParser';

const mapGroqError = (error: any): Error => {
  const errMsg = (error?.message || 'Unknown error').toLowerCase();
  const status = error?.status || 0;
  
  if (status === 401 || errMsg.includes('401') || errMsg.includes('invalid_api_key')) {
    return new Error('Invalid API Key');
  } else if (status === 403 || errMsg.includes('403') || errMsg.includes('permission_denied')) {
    return new Error('Permission Denied');
  } else if (status === 404 || errMsg.includes('404') || errMsg.includes('model not found')) {
    return new Error('Model Not Found');
  } else if (status === 408 || errMsg.includes('408') || errMsg.includes('timeout')) {
    return new Error('Network Timeout');
  } else if (status === 429 || errMsg.includes('429') || errMsg.includes('rate limit')) {
    return new Error('Groq Free Tier Rate Limit Exceeded. Try a shorter resume or wait 1 minute.');
  } else if (status >= 500 || errMsg.includes('500') || errMsg.includes('internal')) {
    return new Error('Internal Server Error');
  } else if (errMsg.includes('fetch') || errMsg.includes('network')) {
    return new Error('Groq Connection Failed');
  }
  
  return new Error(error?.message || 'Unknown error');
};

const generateWithFallback = async (groq: Groq, prompt: string, modelConfig: any) => {
  const modelsToTry = ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[DEBUG] Attempting Groq generation with model: ${modelName}`);
      const startTime = Date.now();
      
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: modelName,
        temperature: modelConfig.temperature,
        response_format: { type: 'json_object' },
      });
      
      const responseTime = Date.now() - startTime;
      console.log(`[DEBUG] Successfully generated content using model: ${modelName} in ${responseTime}ms`);
      return { 
        content: completion.choices[0]?.message?.content || '',
        modelUsed: modelName,
        responseTime
      };
    } catch (error: any) {
      console.warn(`[WARN] Model ${modelName} failed: ${error.message}`);
      lastError = error;
      
      const errMsg = (error?.message || '').toLowerCase();
      const status = error?.status || 0;
      
      // If it's 429, try the fallback model immediately without failing out early.
      // But if it's Invalid Key (401/403), fail immediately
      if (status === 401 || status === 403 || errMsg.includes('401') || errMsg.includes('403') || errMsg.includes('invalid api key')) {
        throw mapGroqError(error);
      }
    }
  }
  
  throw mapGroqError(lastError);
};

export const analyzeResume = async (jdText: string, resumeText: string, resumeName: string) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is missing. Please configure it in your .env file.');
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const modelConfig = {
    temperature: 0.1,
  };

  const structuredResume = parseStructuredResume(resumeText);
  const structuredResumeString = JSON.stringify(structuredResume, null, 2);

  const prompt = `You are an expert Technical Recruiter, ATS Expert, Hiring Manager, and Career Assessment Specialist.
Please perform a strict, evidence-based extraction and analysis of the following structured resume against the provided job description.

CRITICAL RULES FOR EVIDENCE-BASED SCORING:
RULE 1: Never invent evidence. Every statement inside the report must be directly traceable to the resume. If evidence cannot be found, output "Not Found" instead of making assumptions.
RULE 2: Skill evidence must come ONLY from Projects, Internships, Experience, Research, Publications, Achievements, or Certifications. Never infer a technology simply because it usually accompanies another technology.
RULE 3: The "evidenceReasoning" or "evidence" column must include the exact source (e.g., "Projects: CareerDNA AI, Sleep Detection\\nInternship: SriGuru"). If multiple exist, list every single one.
RULE 4: Internship relevance must NOT depend on internship title. Calculate relevance (0-100) using actual responsibilities, technologies used, domain, deliverables, and exact JD overlap.
RULE 5: Project relevance: Score every project individually based strictly on the text provided. Use Technology overlap, Domain overlap, Complexity, and Real implementation. Do not assume AI/DB/Cloud usage if not explicitly stated.
RULE 6: Internships and Experience: You must include exact matched skills and missing skills relative to the JD.
RULE 7: Skill Confidence in skillMatrix must be:
  - "Highest": Multiple independent evidence sources exist (e.g., Project + Internship + Certification).
  - "High": Project + Internship.
  - "Medium": Only Project or Only Internship.
  - "Low": Listed only under Skills section with no project/internship evidence.
  - "Not Found": No evidence found in the text.
RULE 8: Certification relevance: Score based on Issuer credibility, Industry value, JD relevance, Technology overlap.
RULE 9: Reasoning must be strictly factual.
RULE 10: If you generate an assumption, discard it. Use only extracted structured resume data.
RULE 11: Every statement must be verifiable. No mock values, fake percentages, or hardcoded confidence. Every score must be calculated purely from exact text evidence.

Return STRICT JSON ONLY matching the exact structure below. DO NOT include markdown formatting (\`\`\`json).
All "relevanceScore" fields MUST be integers between 0 and 100 representing exact alignment based on the text. Do NOT use generic high scores unless the evidence specifically warrants it.

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
    { "company": "string", "role": "string", "duration": "string", "relevanceScore": 0, "evidenceReasoning": "string", "matchedSkills": ["string"], "missingSkills": ["string"], "impact": "string" }
  ],
  "experience": [
    { "company": "string", "role": "string", "duration": "string", "relevanceScore": 0, "evidenceReasoning": "string", "matchedSkills": ["string"], "missingSkills": ["string"], "impact": "string" }
  ],
  "skillMatrix": [
    { "skill": "string", "evidence": "string", "confidence": "Highest/High/Medium/Low/Not Found" }
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
${jdText.substring(0, 2500)}

Structured Resume (${resumeName}):
${structuredResumeString.substring(0, 7500)}`;

  try {
    console.log("========== GROQ REQUEST ==========");
    console.log("Calling Groq...");
    console.log("Groq Model: llama-3.3-70b-versatile (with fallbacks)");
    console.log("Resume Name:", resumeName);
    console.log("Resume Length:", resumeText.length);
    console.log("JD Length:", jdText.length);
    console.log("Prompt Length:", prompt.length);
    console.log("Prompt Tokens Estimate:", Math.round(prompt.length / 4));
    console.log("==================================");
    
    const result = await generateWithFallback(groq, prompt, modelConfig);
    const responseContent = result.content;

    console.log(`[DEBUG] Response Length: ${responseContent.length}`);
    console.log(`[DEBUG] Response Time: ${result.responseTime}ms`);

    let cleanedContent = responseContent.replace(/```json\n?|```/g, '').trim();
    // In case Groq adds prefixes like "Here is the JSON:"
    if (cleanedContent.indexOf('{') !== -1) {
      cleanedContent = cleanedContent.substring(cleanedContent.indexOf('{'));
    }
    if (cleanedContent.lastIndexOf('}') !== -1) {
      cleanedContent = cleanedContent.substring(0, cleanedContent.lastIndexOf('}') + 1);
    }

    try {
      console.log(`[DEBUG] JSON Validation: Attempting to parse JSON`);
      const parsed = JSON.parse(cleanedContent);
      console.log(`[DEBUG] JSON Validation: Success`);
      return parsed;
    } catch (parseError: any) {
      console.error('[ERROR] Failed to parse Groq response as JSON. Error:', parseError.message);
      console.error('[ERROR] Raw response:\n', responseContent.substring(0, 500));
      // Give a better error if it hallucinated text instead of JSON
      throw new Error('Groq generated an invalid report. Try again.');
    }
  } catch (error: any) {
    console.error("========== GROQ ERROR ==========");
    console.error(error);
    console.error("Status:", error.status || "Unknown");
    console.error("Code:", error.code || "Unknown");
    console.error("Message:", error.message || "Unknown");
    console.error("Stack:", error.stack);
    console.error("================================");
    throw error;
  }
};

export const compareResumes = async (jdText: string, candidatesData: any[]) => {
  if (!process.env.GROQ_API_KEY) return candidatesData;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const modelConfig = {
    temperature: 0.1,
  };
  
  const candidateSummaries = candidatesData.map(c => ({
    name: c.candidateName || c.originalName,
    matchPercentage: c.matchPercentage,
    rankingScore: c.rankingScore,
    skills: c.skillsMatch,
    experience: c.experienceAnalysis,
    projects: c.projectAnalysis
  }));

  const prompt = `You are an Expert Technical Recruiter comparing multiple candidates for a specific Job Description.
Review the candidates and provide ranking reasons and awards. Be strictly objective. Explain WHY a higher ranked candidate beat a lower ranked candidate based ONLY on verifiable evidence.

CRITICAL RULES FOR EVIDENCE-BASED COMPARISON:
1. Never rank using keyword count. Rank using weighted evidence.
2. Priority for ranking: Relevant Internship > Relevant Projects > Technical Depth > Problem Solving > Real Implementation > Relevant Skills > Relevant Certifications > Achievements > Education.
3. Every ranking must include "Why Candidate A ranked above Candidate B" with FACTUAL EVIDENCE ONLY.
4. No assumed technology usage. No hallucinated evidence.

Return ONLY a valid JSON object matching this schema:
{
  "comparisons": [
    {
      "candidateName": "string",
      "rankingReason": "string (Explain exactly why this candidate deserves their rank compared to others based on factual evidence ONLY.)"
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
${jdText.substring(0, 2500)}

Candidates:
${JSON.stringify(candidateSummaries)}`;

  try {
    console.log("========== GROQ REQUEST ==========");
    console.log("Groq Model: llama-3.3-70b-versatile (with fallbacks)");
    console.log("Resume Length:", JSON.stringify(candidateSummaries).length);
    console.log("JD Length:", jdText.length);
    console.log("Prompt Length:", prompt.length);
    console.log("Prompt Tokens Estimate:", Math.round(prompt.length / 4));
    console.log("==================================");

    const result = await generateWithFallback(groq, prompt, modelConfig);
    const responseContent = result.content;
    
    let cleanedContent = responseContent.replace(/```json\n?|```/g, '').trim();
    if (cleanedContent.indexOf('{') !== -1) {
      cleanedContent = cleanedContent.substring(cleanedContent.indexOf('{'));
    }
    if (cleanedContent.lastIndexOf('}') !== -1) {
      cleanedContent = cleanedContent.substring(0, cleanedContent.lastIndexOf('}') + 1);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleanedContent);
    } catch(e: any) {
      console.error('[ERROR] Compare Resumes - Failed to parse JSON. Error:', e.message);
      console.error('[ERROR] Raw response:\n', responseContent.substring(0, 500));
      return candidatesData; // Fallback to returning original data
    }

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
  } catch (error: any) {
    console.error("========== GROQ ERROR ==========");
    console.error(error);
    console.error("Status:", error.status || "Unknown");
    console.error("Code:", error.code || "Unknown");
    console.error("Message:", error.message || "Unknown");
    console.error("Stack:", error.stack);
    console.error("================================");
    return candidatesData; // Fallback to individual analysis without comparison
  }
};
