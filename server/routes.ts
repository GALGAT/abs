import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProfileSchema, insertApplicationSchema } from "@shared/schema";
import { extractKeywords, calculateMatchScore } from "./services/nlp";
import { optimizeResumeWithAI, generateJobMatchInsights } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get jobs with filtering and matching
  app.get("/api/jobs", async (req, res) => {
    try {
      const { userId, location, skills, minSalary, maxSalary, isRemote } = req.query;
      
      const filters: any = {};
      if (location) filters.location = location as string;
      if (minSalary) filters.minSalary = parseInt(minSalary as string);
      if (maxSalary) filters.maxSalary = parseInt(maxSalary as string);
      if (isRemote !== undefined) filters.isRemote = isRemote === 'true';
      if (skills) {
        filters.skills = Array.isArray(skills) ? skills : [skills];
      }

      const jobs = await storage.getJobs(filters);
      
      // If userId provided, calculate match scores
      if (userId) {
        const userProfile = await storage.getUserProfile(userId as string);
        if (userProfile) {
          const userSkills = userProfile.skills.split(',').map(s => s.trim());
          
          const jobsWithScores = jobs.map(job => {
            const matchScore = calculateMatchScore(userSkills, job.skills, job.keywords);
            return {
              ...job,
              matchScore,
              timeAgo: getTimeAgo(job.postedAt!)
            };
          }).sort((a, b) => b.matchScore - a.matchScore);
          
          return res.json(jobsWithScores);
        }
      }
      
      const jobsWithTime = jobs.map(job => ({
        ...job,
        matchScore: 0,
        timeAgo: getTimeAgo(job.postedAt!)
      }));
      
      res.json(jobsWithTime);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  // Get single job
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  // Create user profile
  app.post("/api/profile", async (req, res) => {
    try {
      const validatedData = insertUserProfileSchema.parse(req.body);
      
      // Create a mock user first
      const user = await storage.createUser({
        username: `user_${Date.now()}`,
        email: `user_${Date.now()}@example.com`,
        password: "mock_password"
      });
      
      const profile = await storage.createUserProfile(user.id, validatedData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  // Get user profile
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Update user profile
  app.put("/api/profile/:userId", async (req, res) => {
    try {
      const validatedData = insertUserProfileSchema.partial().parse(req.body);
      const profile = await storage.updateUserProfile(req.params.userId, validatedData);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  // Apply to job with AI optimization
  app.post("/api/applications", async (req, res) => {
    try {
      const { userId, jobId, useAI = false } = req.body;
      
      // Check if already applied
      const existingApplication = await storage.getApplicationByUserAndJob(userId, jobId);
      if (existingApplication) {
        return res.status(400).json({ message: "Already applied to this job" });
      }

      const job = await storage.getJob(jobId);
      const userProfile = await storage.getUserProfile(userId);
      
      if (!job || !userProfile) {
        return res.status(404).json({ message: "Job or user profile not found" });
      }

      // Calculate match score
      const userSkills = userProfile.skills.split(',').map(s => s.trim());
      const matchScore = calculateMatchScore(userSkills, job.skills, job.keywords);

      let tailoredResume = userProfile.workHistory;
      let coverLetter = `Dear Hiring Manager,

I am interested in the ${job.title} position at ${job.company}. Based on my experience and skills, I believe I would be a great fit for this role.

Best regards`;

      // Use AI optimization if requested
      if (useAI && process.env.OPENAI_API_KEY) {
        try {
          const optimization = await optimizeResumeWithAI({
            originalResume: userProfile.workHistory,
            jobDescription: job.description,
            jobTitle: job.title,
            requiredSkills: job.skills
          });
          
          tailoredResume = optimization.optimizedResume;
          coverLetter = optimization.coverLetter;
        } catch (error) {
          console.error("AI optimization failed:", error);
        }
      }

      const application = await storage.createApplication({
        userId,
        jobId,
        status: "applied",
        matchScore,
        tailoredResume,
        coverLetter
      });

      res.json(application);
    } catch (error) {
      console.error("Application error:", error);
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  // Get user applications
  app.get("/api/applications/:userId", async (req, res) => {
    try {
      const applications = await storage.getApplications(req.params.userId);
      
      // Enrich with job data
      const enrichedApplications = await Promise.all(
        applications.map(async (app) => {
          const job = await storage.getJob(app.jobId);
          return {
            ...app,
            job,
            timeAgo: getTimeAgo(app.appliedAt!)
          };
        })
      );
      
      res.json(enrichedApplications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Analyze job description
  app.post("/api/analyze-job", async (req, res) => {
    try {
      const { description } = req.body;
      const analysis = extractKeywords(description);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze job description" });
    }
  });

  // Get job match insights
  app.post("/api/job-insights", async (req, res) => {
    try {
      const { userId, jobId } = req.body;
      
      const job = await storage.getJob(jobId);
      const userProfile = await storage.getUserProfile(userId);
      
      if (!job || !userProfile) {
        return res.status(404).json({ message: "Job or user profile not found" });
      }

      let insights = ["This job matches your technical background."];
      
      if (process.env.OPENAI_API_KEY) {
        try {
          insights = await generateJobMatchInsights(userProfile, job.description);
        } catch (error) {
          console.error("AI insights failed:", error);
        }
      }
      
      res.json({ insights });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate insights" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks === 1) return "1 week ago";
  return `${diffInWeeks} weeks ago`;
}
