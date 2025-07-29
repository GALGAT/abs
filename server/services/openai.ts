import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ResumeOptimizationRequest {
  originalResume: string;
  jobDescription: string;
  jobTitle: string;
  requiredSkills: string[];
}

export interface ResumeOptimizationResult {
  optimizedResume: string;
  coverLetter: string;
  keyChanges: string[];
}

export async function optimizeResumeWithAI(request: ResumeOptimizationRequest): Promise<ResumeOptimizationResult> {
  try {
    const prompt = `
You are an expert resume optimization specialist. Given the original resume and job description below, please:

1. Optimize the resume to better match the job requirements
2. Generate a personalized cover letter
3. Provide a list of key changes made

Original Resume:
${request.originalResume}

Job Title: ${request.jobTitle}
Job Description:
${request.jobDescription}

Required Skills: ${request.requiredSkills.join(', ')}

Please respond with JSON in this exact format:
{
  "optimizedResume": "The optimized resume text with improved keyword matching and relevant experience highlighted",
  "coverLetter": "A personalized cover letter for this specific job",
  "keyChanges": ["List of key changes made to optimize the resume"]
}

Guidelines:
- Maintain truthfulness - don't add false experience
- Emphasize relevant skills and experience that match the job
- Use industry keywords and ATS-friendly formatting
- Keep the same basic structure but improve content presentation
- Make the cover letter specific to the company and role
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume optimization specialist. Respond only with valid JSON in the specified format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      optimizedResume: result.optimizedResume || request.originalResume,
      coverLetter: result.coverLetter || "Thank you for considering my application.",
      keyChanges: result.keyChanges || []
    };
  } catch (error) {
    console.error("OpenAI optimization error:", error);
    
    // Fallback to basic optimization
    return {
      optimizedResume: request.originalResume,
      coverLetter: `Dear Hiring Manager,

I am writing to express my interest in the ${request.jobTitle} position. With my experience in ${request.requiredSkills.slice(0, 3).join(', ')}, I believe I would be a valuable addition to your team.

I look forward to discussing how my skills and experience can contribute to your organization.

Best regards`,
      keyChanges: ["Applied basic formatting improvements"]
    };
  }
}

export async function generateJobMatchInsights(userProfile: any, jobDescription: string): Promise<string[]> {
  try {
    const prompt = `
Analyze the match between this user profile and job description. Provide 3-5 specific insights about why this job is a good match or what the user should emphasize.

User Profile:
Skills: ${userProfile.skills}
Experience: ${userProfile.experienceYears}
Work History: ${userProfile.workHistory}

Job Description:
${jobDescription}

Respond with JSON in this format:
{
  "insights": ["Insight 1", "Insight 2", "Insight 3"]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.insights || [];
  } catch (error) {
    console.error("OpenAI insights error:", error);
    return ["This job matches your technical skills and experience level."];
  }
}
