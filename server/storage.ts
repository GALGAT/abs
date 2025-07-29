import { type User, type InsertUser, type UserProfile, type InsertUserProfile, type Job, type InsertJob, type Application, type InsertApplication } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // User Profile methods
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(userId: string, profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;

  // Job methods
  getJobs(filters?: { 
    location?: string; 
    skills?: string[]; 
    minSalary?: number; 
    maxSalary?: number;
    isRemote?: boolean;
  }): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;

  // Application methods
  getApplications(userId: string): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: string, application: Partial<InsertApplication>): Promise<Application | undefined>;
  getApplicationByUserAndJob(userId: string, jobId: string): Promise<Application | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userProfiles: Map<string, UserProfile>;
  private jobs: Map<string, Job>;
  private applications: Map<string, Application>;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize some mock jobs
    const mockJobs: InsertJob[] = [
      {
        title: "Senior Software Engineer",
        company: "TechCorp",
        location: "Remote",
        locationType: "remote",
        minSalary: 120000,
        maxSalary: 160000,
        description: "We are looking for a skilled software engineer to join our growing team. You will be responsible for developing scalable web applications using modern technologies including React, Node.js, and cloud platforms. The ideal candidate will have experience with microservices architecture and CI/CD pipelines.",
        requirements: "Bachelor's degree in Computer Science or related field. 5+ years of experience in software development. Strong experience with React, Node.js, TypeScript, and AWS. Experience with microservices and containerization (Docker, Kubernetes). Knowledge of CI/CD pipelines and DevOps practices.",
        skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "Kubernetes"],
        keywords: ["software engineer", "react", "nodejs", "typescript", "aws", "docker", "kubernetes", "microservices", "cicd"],
        isRemote: true,
        externalUrl: "https://techcorp.com/careers/senior-software-engineer"
      },
      {
        title: "Full Stack Developer",
        company: "StartupXYZ",
        location: "San Francisco, CA",
        locationType: "onsite",
        minSalary: 100000,
        maxSalary: 140000,
        description: "Join our innovative startup building the next generation of fintech solutions. We're looking for a passionate full-stack developer who can work across our entire technology stack. You'll be working on user-facing applications, APIs, and data processing systems.",
        requirements: "3+ years of full-stack development experience. Proficiency in Vue.js or React, Python/Django, PostgreSQL. Experience with financial systems is a plus. Strong problem-solving skills and ability to work in a fast-paced environment.",
        skills: ["Vue.js", "Django", "Python", "PostgreSQL", "JavaScript", "HTML", "CSS"],
        keywords: ["full stack", "vuejs", "django", "python", "postgresql", "javascript", "fintech"],
        isRemote: false,
        externalUrl: "https://startupxyz.com/jobs/fullstack-developer"
      },
      {
        title: "DevOps Engineer",
        company: "CloudTech",
        location: "Austin, TX",
        locationType: "hybrid",
        minSalary: 110000,
        maxSalary: 150000,
        description: "We're seeking a DevOps engineer to help scale our infrastructure and improve our deployment pipelines. You'll work with containerization, orchestration, and cloud infrastructure to ensure our applications run smoothly at scale.",
        requirements: "4+ years of DevOps/Infrastructure experience. Strong knowledge of Kubernetes, Terraform, Jenkins. Experience with AWS or Azure cloud platforms. Familiarity with monitoring tools like Prometheus and Grafana.",
        skills: ["Kubernetes", "Terraform", "Jenkins", "AWS", "Docker", "Prometheus", "Grafana"],
        keywords: ["devops", "kubernetes", "terraform", "jenkins", "aws", "docker", "infrastructure", "cicd"],
        isRemote: false,
        externalUrl: "https://cloudtech.com/careers/devops-engineer"
      },
      {
        title: "Frontend Developer",
        company: "Microsoft",
        location: "Seattle, WA",
        locationType: "hybrid",
        minSalary: 90000,
        maxSalary: 130000,
        description: "Join Microsoft's web development team to build cutting-edge user interfaces for our enterprise products. You'll work with the latest frontend technologies and contribute to products used by millions of users worldwide.",
        requirements: "Bachelor's degree and 3+ years frontend development experience. Expert-level knowledge of React, TypeScript, and modern CSS. Experience with accessibility standards and cross-browser compatibility. Knowledge of testing frameworks.",
        skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Jest", "Webpack"],
        keywords: ["frontend", "react", "typescript", "javascript", "css", "html", "accessibility"],
        isRemote: false,
        externalUrl: "https://careers.microsoft.com/frontend-developer"
      },
      {
        title: "Product Engineer",
        company: "Meta",
        location: "Menlo Park, CA",
        locationType: "onsite",
        minSalary: 130000,
        maxSalary: 180000,
        description: "Build products that connect billions of people around the world. As a Product Engineer at Meta, you'll work on features that impact how people communicate, share, and discover content across our family of apps.",
        requirements: "BS/MS in Computer Science or equivalent experience. 4+ years of software engineering experience. Experience with React, React Native, or similar frameworks. Strong understanding of system design and scalability.",
        skills: ["React", "React Native", "JavaScript", "Python", "GraphQL", "MySQL"],
        keywords: ["product engineer", "react", "react native", "javascript", "python", "graphql", "mysql", "mobile"],
        isRemote: false,
        externalUrl: "https://www.metacareers.com/jobs/product-engineer"
      },
      {
        title: "Backend Engineer",
        company: "Stripe",
        location: "Remote",
        locationType: "remote",
        minSalary: 120000,
        maxSalary: 170000,
        description: "Help us build the economic infrastructure for the internet. You'll work on systems that process billions of dollars in transactions, building reliable and scalable backend services that power online commerce globally.",
        requirements: "5+ years of backend development experience. Strong knowledge of distributed systems, databases, and API design. Experience with Ruby, Python, or Go. Understanding of payment systems and financial services is a plus.",
        skills: ["Ruby", "Python", "Go", "PostgreSQL", "Redis", "Kubernetes", "gRPC"],
        keywords: ["backend", "ruby", "python", "go", "postgresql", "redis", "kubernetes", "grpc", "payments", "fintech"],
        isRemote: true,
        externalUrl: "https://stripe.com/jobs/backend-engineer"
      }
    ];

    mockJobs.forEach(job => {
      this.createJob(job);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async createUserProfile(userId: string, profile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const userProfile: UserProfile = {
      id,
      userId,
      jobTitles: Array.isArray(profile.jobTitles) ? profile.jobTitles : [],
      location: profile.location,
      locationType: profile.locationType,
      minSalary: profile.minSalary ?? null,
      maxSalary: profile.maxSalary ?? null,
      experienceYears: profile.experienceYears,
      skills: profile.skills,
      workHistory: profile.workHistory,
      resumeUrl: profile.resumeUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userProfiles.set(id, userProfile);
    return userProfile;
  }

  async updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const existingProfile = await this.getUserProfile(userId);
    if (!existingProfile) return undefined;

    const updatedProfile: UserProfile = {
      id: existingProfile.id,
      userId: existingProfile.userId,
      jobTitles: profile.jobTitles ? (Array.isArray(profile.jobTitles) ? profile.jobTitles : []) : existingProfile.jobTitles,
      location: profile.location ?? existingProfile.location,
      locationType: profile.locationType ?? existingProfile.locationType,
      minSalary: profile.minSalary !== undefined ? profile.minSalary : existingProfile.minSalary,
      maxSalary: profile.maxSalary !== undefined ? profile.maxSalary : existingProfile.maxSalary,
      experienceYears: profile.experienceYears ?? existingProfile.experienceYears,
      skills: profile.skills ?? existingProfile.skills,
      workHistory: profile.workHistory ?? existingProfile.workHistory,
      resumeUrl: profile.resumeUrl !== undefined ? profile.resumeUrl : existingProfile.resumeUrl,
      createdAt: existingProfile.createdAt,
      updatedAt: new Date(),
    };
    this.userProfiles.set(existingProfile.id, updatedProfile);
    return updatedProfile;
  }

  async getJobs(filters?: { 
    location?: string; 
    skills?: string[]; 
    minSalary?: number; 
    maxSalary?: number;
    isRemote?: boolean;
  }): Promise<Job[]> {
    let jobs = Array.from(this.jobs.values());

    if (filters) {
      if (filters.location) {
        jobs = jobs.filter(job => 
          job.location.toLowerCase().includes(filters.location!.toLowerCase()) ||
          (filters.location!.toLowerCase() === 'remote' && job.isRemote)
        );
      }
      if (filters.skills && filters.skills.length > 0) {
        jobs = jobs.filter(job => 
          filters.skills!.some(skill => 
            job.skills.some(jobSkill => 
              jobSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }
      if (filters.minSalary) {
        jobs = jobs.filter(job => 
          job.minSalary && job.minSalary >= filters.minSalary!
        );
      }
      if (filters.maxSalary) {
        jobs = jobs.filter(job => 
          job.maxSalary && job.maxSalary <= filters.maxSalary!
        );
      }
      if (filters.isRemote !== undefined) {
        jobs = jobs.filter(job => job.isRemote === filters.isRemote);
      }
    }

    return jobs.sort((a, b) => new Date(b.postedAt!).getTime() - new Date(a.postedAt!).getTime());
  }

  async getJob(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async createJob(job: InsertJob): Promise<Job> {
    const id = randomUUID();
    const newJob: Job = {
      id,
      title: job.title,
      company: job.company,
      location: job.location,
      locationType: job.locationType,
      minSalary: job.minSalary ?? null,
      maxSalary: job.maxSalary ?? null,
      description: job.description,
      requirements: job.requirements,
      skills: Array.isArray(job.skills) ? job.skills : [],
      keywords: Array.isArray(job.keywords) ? job.keywords : [],
      isRemote: job.isRemote ?? null,
      externalUrl: job.externalUrl ?? null,
      postedAt: new Date(),
    };
    this.jobs.set(id, newJob);
    return newJob;
  }

  async getApplications(userId: string): Promise<Application[]> {
    return Array.from(this.applications.values())
      .filter(app => app.userId === userId)
      .sort((a, b) => new Date(b.appliedAt!).getTime() - new Date(a.appliedAt!).getTime());
  }

  async getApplication(id: string): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const newApplication: Application = {
      ...application,
      id,
      status: application.status || "applied",
      tailoredResume: application.tailoredResume ?? null,
      coverLetter: application.coverLetter ?? null,
      appliedAt: new Date(),
      updatedAt: new Date(),
    };
    this.applications.set(id, newApplication);
    return newApplication;
  }

  async updateApplication(id: string, application: Partial<InsertApplication>): Promise<Application | undefined> {
    const existingApplication = this.applications.get(id);
    if (!existingApplication) return undefined;

    const updatedApplication: Application = {
      ...existingApplication,
      ...application,
      updatedAt: new Date(),
    };
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }

  async getApplicationByUserAndJob(userId: string, jobId: string): Promise<Application | undefined> {
    return Array.from(this.applications.values()).find(
      app => app.userId === userId && app.jobId === jobId
    );
  }
}

export const storage = new MemStorage();
