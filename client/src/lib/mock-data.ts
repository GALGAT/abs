export const mockJobs = [
  {
    id: "1",
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
    matchScore: 95,
    timeAgo: "2 hours ago",
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    externalUrl: "https://techcorp.com/careers/senior-software-engineer"
  },
  {
    id: "2",
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
    matchScore: 88,
    timeAgo: "4 hours ago",
    postedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    externalUrl: "https://startupxyz.com/jobs/fullstack-developer"
  },
  {
    id: "3",
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
    matchScore: 82,
    timeAgo: "1 day ago",
    postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    externalUrl: "https://cloudtech.com/careers/devops-engineer"
  }
];

export const mockApplications = [
  {
    id: "1",
    jobId: "1",
    status: "applied",
    matchScore: 95,
    timeAgo: "2 hours ago",
    job: {
      title: "Senior Software Engineer",
      company: "Google"
    }
  },
  {
    id: "2",
    jobId: "2",
    status: "under_review",
    matchScore: 88,
    timeAgo: "1 day ago",
    job: {
      title: "Frontend Developer",
      company: "Microsoft"
    }
  },
  {
    id: "3",
    jobId: "3",
    status: "interview",
    matchScore: 82,
    timeAgo: "3 days ago",
    job: {
      title: "Product Engineer",
      company: "Meta"
    }
  }
];
