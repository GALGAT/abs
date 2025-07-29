import nlp from "compromise";

export interface KeywordExtractionResult {
  keywords: string[];
  skills: string[];
  requirements: string[];
}

// Common technical skills and keywords to identify
const TECH_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
  'react', 'vue', 'angular', 'nodejs', 'express', 'django', 'flask', 'spring', 'laravel',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'github', 'gitlab',
  'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'graphql', 'rest', 'api',
  'machine learning', 'ai', 'data science', 'analytics', 'sql', 'nosql', 'microservices',
  'agile', 'scrum', 'devops', 'ci/cd', 'git', 'testing', 'jest', 'pytest', 'junit'
];

const REQUIREMENT_KEYWORDS = [
  'bachelor', 'master', 'degree', 'years experience', 'experience', 'required', 'must have',
  'should have', 'preferred', 'nice to have', 'bonus', 'plus', 'certification', 'certified'
];

export function extractKeywords(text: string): KeywordExtractionResult {
  const doc = nlp(text.toLowerCase());
  
  // Extract all nouns and noun phrases as potential keywords
  const nouns = doc.nouns().out('array');
  const adjectives = doc.adjectives().out('array');
  
  // Combine and filter keywords
  const allWords = [...nouns, ...adjectives];
  const keywords = allWords
    .filter(word => word.length > 2) // Filter out very short words
    .filter(word => !['the', 'and', 'for', 'are', 'you', 'our', 'will', 'has', 'can', 'may'].includes(word))
    .slice(0, 20); // Limit to top 20 keywords

  // Extract technical skills
  const skills = TECH_SKILLS.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );

  // Extract requirements-related phrases
  const requirements: string[] = [];
  REQUIREMENT_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(`${keyword}[^.]*\\.`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      requirements.push(...matches.map(m => m.trim()));
    }
  });

  return {
    keywords: Array.from(new Set(keywords)), // Remove duplicates
    skills: Array.from(new Set(skills)),
    requirements: requirements.slice(0, 10) // Limit requirements
  };
}

export function calculateMatchScore(userSkills: string[], jobSkills: string[], jobKeywords: string[]): number {
  const userSkillsLower = userSkills.map(s => s.toLowerCase());
  const jobSkillsLower = jobSkills.map(s => s.toLowerCase());
  const jobKeywordsLower = jobKeywords.map(k => k.toLowerCase());

  // Count skill matches
  let skillMatches = 0;
  jobSkillsLower.forEach(jobSkill => {
    if (userSkillsLower.some(userSkill => 
      userSkill.includes(jobSkill) || jobSkill.includes(userSkill)
    )) {
      skillMatches++;
    }
  });

  // Count keyword matches
  let keywordMatches = 0;
  jobKeywordsLower.forEach(keyword => {
    if (userSkillsLower.some(userSkill => 
      userSkill.includes(keyword) || keyword.includes(userSkill)
    )) {
      keywordMatches++;
    }
  });

  // Calculate score (weighted towards skills)
  const skillScore = jobSkills.length > 0 ? (skillMatches / jobSkills.length) * 70 : 0;
  const keywordScore = jobKeywords.length > 0 ? (keywordMatches / jobKeywords.length) * 30 : 0;

  return Math.round(skillScore + keywordScore);
}

export function tailorResumeText(originalResume: string, jobDescription: string, jobSkills: string[]): string {
  // Simple resume tailoring by emphasizing relevant skills
  let tailoredResume = originalResume;

  // Highlight skills that match job requirements
  jobSkills.forEach(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'gi');
    tailoredResume = tailoredResume.replace(regex, `**${skill}**`);
  });

  return tailoredResume;
}
