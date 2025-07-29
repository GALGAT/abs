import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, Search, Send, Calendar, TrendingUp, Settings, User, BarChart3, FileText, Plus, Filter, RefreshCw } from "lucide-react";
import JobCard from "@/components/job-card";
import ApplicationTable from "@/components/application-table";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("search");
  const [jobFilter, setJobFilter] = useState("all");
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  const { data: jobs = [], isLoading: jobsLoading, refetch: refetchJobs } = useQuery({
    queryKey: ["/api/jobs", userProfile?.userId],
    enabled: !!userProfile?.userId,
    queryFn: async () => {
      const response = await fetch(`/api/jobs?userId=${userProfile.userId}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      return response.json();
    }
  });

  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/applications", userProfile?.userId],
    enabled: !!userProfile?.userId,
    queryFn: async () => {
      const response = await fetch(`/api/applications/${userProfile.userId}`);
      if (!response.ok) throw new Error("Failed to fetch applications");
      return response.json();
    }
  });

  const applyToJobMutation = useMutation({
    mutationFn: async ({ jobId, useAI }: { jobId: string; useAI: boolean }) => {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userProfile.userId,
          jobId,
          useAI
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application submitted!",
        description: "Your application has been sent successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Application failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const filteredJobs = jobs.filter((job: any) => {
    if (jobFilter === "high_match") return job.matchScore >= 80;
    if (jobFilter === "remote") return job.isRemote;
    if (jobFilter === "new") return new Date(job.postedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000;
    return true;
  });

  const stats = [
    {
      title: "New Matches",
      value: jobs.filter((job: any) => job.matchScore >= 80).length,
      icon: Search,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Applications Sent",
      value: applications.length,
      icon: Send,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Interview Requests",
      value: applications.filter((app: any) => app.status === "interview").length,
      icon: Calendar,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "Response Rate",
      value: applications.length > 0 
        ? `${Math.round((applications.filter((app: any) => app.status !== "applied").length / applications.length) * 100)}%`
        : "0%",
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600"
    }
  ];

  const sidebarItems = [
    { id: "search", label: "Job Search", icon: Search },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "profile", label: "Profile", icon: User },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Profile not found</h2>
          <p className="text-slate-600 mb-4">Please complete the onboarding process first.</p>
          <Button onClick={() => window.location.href = "/onboarding"}>
            Complete Setup
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm h-screen sticky top-0">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-slate-800">JobPilot AI</span>
          </div>
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {activeTab === "search" && "Job Search Dashboard"}
                {activeTab === "applications" && "Application Tracking"}
                {activeTab === "profile" && "Profile Management"}
                {activeTab === "analytics" && "Performance Analytics"}
                {activeTab === "settings" && "Settings"}
              </h1>
              <p className="text-slate-600 mt-1">
                {activeTab === "search" && "AI is actively searching for opportunities that match your profile"}
                {activeTab === "applications" && "Track and manage your job applications"}
                {activeTab === "profile" && "Manage your profile and preferences"}
                {activeTab === "analytics" && "View your job search performance metrics"}
                {activeTab === "settings" && "Configure your account settings"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-emerald-50 border-emerald-200 text-emerald-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                Auto-search Active
              </Badge>
              {activeTab === "search" && (
                <Button onClick={() => refetchJobs()} disabled={jobsLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${jobsLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Job Search Tab */}
        {activeTab === "search" && (
          <Card>
            <CardHeader className="border-b border-slate-200">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">AI-Recommended Jobs</CardTitle>
                <div className="flex items-center space-x-4">
                  <Select value={jobFilter} onValueChange={setJobFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter jobs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Jobs</SelectItem>
                      <SelectItem value="high_match">High Match (80%+)</SelectItem>
                      <SelectItem value="remote">Remote Only</SelectItem>
                      <SelectItem value="new">New Today</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {jobsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-slate-600 mt-4">Loading job recommendations...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="p-8 text-center">
                  <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">No jobs found</h3>
                  <p className="text-slate-600">Try adjusting your filters or refresh to see new opportunities.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredJobs.map((job: any) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onApply={(useAI) => applyToJobMutation.mutate({ jobId: job.id, useAI })}
                      isApplying={applyToJobMutation.isPending}
                      hasApplied={applications.some((app: any) => app.jobId === job.id)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <Card>
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-xl">Recent Applications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {applicationsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-slate-600 mt-4">Loading applications...</p>
                </div>
              ) : (
                <ApplicationTable applications={applications} />
              )}
            </CardContent>
          </Card>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Job Preferences</h3>
                <p className="text-slate-600">Titles: {userProfile.jobTitles?.join(", ")}</p>
                <p className="text-slate-600">Location: {userProfile.locationType}</p>
                <p className="text-slate-600">Experience: {userProfile.experienceYears}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Skills</h3>
                <p className="text-slate-600">{userProfile.skills}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Work History</h3>
                <p className="text-slate-600">{userProfile.workHistory}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{applications.length}</div>
                    <div className="text-slate-600">Total Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">
                      {applications.filter((app: any) => app.status !== "applied").length}
                    </div>
                    <div className="text-slate-600">Responses Received</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600">
                      {applications.filter((app: any) => app.status === "interview").length}
                    </div>
                    <div className="text-slate-600">Interviews Scheduled</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Notification Preferences</h3>
                  <p className="text-slate-600">Configure how you receive updates about new jobs and applications.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">AI Settings</h3>
                  <p className="text-slate-600">Customize AI behavior for resume optimization and job matching.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Privacy Settings</h3>
                  <p className="text-slate-600">Manage your data and privacy preferences.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
