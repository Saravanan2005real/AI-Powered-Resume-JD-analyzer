export const parseStructuredResume = (text: string) => {
  const data = {
    skills: [] as string[],
    certifications: [] as string[],
    education: [] as string[],
    projects: [] as string[],
    experience: [] as string[],
    contact: [] as string[],
  };

  // Keywords to identify sections
  const sectionKeywords = {
    skills: /^(?:skills?|technical skills?|core competencies|tools|technologies|technical expertise)$/im,
    experience: /^(?:experience|work experience|employment history|professional experience|internships?|work history)$/im,
    education: /^(?:education|academic background|academics|academic qualifications)$/im,
    projects: /^(?:projects?|academic projects?|personal projects?|key projects?)$/im,
    certifications: /^(?:certifications?|courses?|certificates?|achievements?|licenses?)$/im
  };

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let currentSection = 'contact'; // Default starting section is usually contact info

  for (const line of lines) {
    let foundSection = false;
    // Check if the line matches any section header perfectly (allow some leading/trailing characters like -, :, etc.)
    const cleanLine = line.replace(/[^a-zA-Z\s]/g, '').trim();

    for (const [section, regex] of Object.entries(sectionKeywords)) {
      if (regex.test(cleanLine) && cleanLine.length < 30) { // Section headers are usually short
        currentSection = section;
        foundSection = true;
        break;
      }
    }

    if (!foundSection) {
      if (currentSection !== 'contact') {
        (data as any)[currentSection].push(line);
      } else {
        data.contact.push(line);
      }
    }
  }

  // 6. Detect certifications using keywords (as fallback or additional extraction)
  const certKeywords = ['Certification', 'Certified', 'Coursera', 'Udemy', 'AWS', 'Google', 'Microsoft', 'NPTEL', 'Oracle', 'Cisco'];
  
  for (const line of lines) {
    const isCertLike = certKeywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()));
    // Avoid re-adding if it's already exactly in certifications
    if (isCertLike && !data.certifications.includes(line)) {
        // Only add if it looks like a reasonable length for a certification
        if (line.length > 5 && line.length < 200) {
           data.certifications.push(line);
        }
    }
  }

  return {
    skills: data.skills.join('\n'),
    certifications: data.certifications.join('\n'),
    education: data.education.join('\n'),
    projects: data.projects.join('\n'),
    experience: data.experience.join('\n'),
    contactInfo: data.contact.join('\n'),
    rawText: text // Keep the original text as a fallback for the AI
  };
};
