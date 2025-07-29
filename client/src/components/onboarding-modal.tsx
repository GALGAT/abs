import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, X, Lightbulb, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: any) => void;
}

export default function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    jobTitles: "",
    locationType: "",
    location: "",
    minSalary: "",
    maxSalary: "",
    experienceYears: "",
    skills: "",
    workHistory: "",
    resumeUrl: ""
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/profile", {
        jobTitles: data.jobTitles.split(",").map((title: string) => title.trim()),
        locationType: data.locationType,
        location: data.location || data.locationType,
        minSalary: data.minSalary ? parseInt(data.minSalary) : null,
        maxSalary: data.maxSalary ? parseInt(data.maxSalary) : null,
        experienceYears: data.experienceYears,
        skills: data.skills,
        workHistory: data.workHistory,
        resumeUrl: data.resumeUrl
      });
      return response.json();
    },
    onSuccess: (profile) => {
      localStorage.setItem("userProfile", JSON.stringify(profile));
      toast({
        title: "Profile created successfully!",
        description: "Your job search profile is now ready.",
      });
      onComplete(profile);
      onClose();
    },
    onError: () => {
      toast({
        title: "Error creating profile",
        description: "Please try again",
        variant: "destructive"
      });
    }
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      createProfileMutation.mutate(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.jobTitles && formData.locationType;
      case 2:
        return formData.experienceYears && formData.skills && formData.workHistory;
      case 3:
        return true; // Resume is optional
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Bot className="h-8 w-8 text-blue-600" />
              Set Up Your Job Search
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="text-sm text-slate-600">Step {currentStep} of {totalSteps}</div>
          </div>
        </DialogHeader>

        <div className="p-6">
          {/* Step 1: Job Preferences */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-800">Job Preferences</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="jobTitles" className="text-sm font-medium text-slate-700">
                    Preferred Job Titles *
                  </Label>
                  <Input
                    id="jobTitles"
                    placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
                    value={formData.jobTitles}
                    onChange={(e) => updateFormData("jobTitles", e.target.value)}
                    className="mt-1"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Separate multiple titles with commas</p>
                </div>

                <div>
                  <Label htmlFor="locationType" className="text-sm font-medium text-slate-700">
                    Location Preference *
                  </Label>
                  <Select value={formData.locationType} onValueChange={(value) => updateFormData("locationType", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select location preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote Only</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="onsite">On-site Only</SelectItem>
                      <SelectItem value="city">Specific City</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.locationType === "city" && (
                  <div>
                    <Label htmlFor="location" className="text-sm font-medium text-slate-700">
                      City/Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g., San Francisco, CA"
                      value={formData.location}
                      onChange={(e) => updateFormData("location", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-slate-700">Salary Range (Optional)</Label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <Input
                      placeholder="Min ($)"
                      type="number"
                      value={formData.minSalary}
                      onChange={(e) => updateFormData("minSalary", e.target.value)}
                    />
                    <Input
                      placeholder="Max ($)"
                      type="number"
                      value={formData.maxSalary}
                      onChange={(e) => updateFormData("maxSalary", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Skills & Experience */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-800">Skills & Experience</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="experienceYears" className="text-sm font-medium text-slate-700">
                    Years of Experience *
                  </Label>
                  <Select value={formData.experienceYears} onValueChange={(value) => updateFormData("experienceYears", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="2-3">2-3 years</SelectItem>
                      <SelectItem value="4-6">4-6 years</SelectItem>
                      <SelectItem value="7-10">7-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="skills" className="text-sm font-medium text-slate-700">
                    Technical Skills *
                  </Label>
                  <Textarea
                    id="skills"
                    placeholder="List your technical skills, programming languages, frameworks, tools..."
                    rows={4}
                    value={formData.skills}
                    onChange={(e) => updateFormData("skills", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="workHistory" className="text-sm font-medium text-slate-700">
                    Work History Summary *
                  </Label>
                  <Textarea
                    id="workHistory"
                    placeholder="Brief overview of your work experience and key achievements..."
                    rows={4}
                    value={formData.workHistory}
                    onChange={(e) => updateFormData("workHistory", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Upload Resume */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-800">Upload Your Resume</h3>
              
              <div className="space-y-4">
                <Card className="border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
                  <CardContent className="p-8 text-center">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-2">Drag and drop your resume here</p>
                    <p className="text-sm text-slate-500 mb-4">or click to browse files</p>
                    <Button variant="outline" className="mb-2">
                      Choose File
                    </Button>
                    <p className="text-xs text-slate-500">Supports PDF, DOC, DOCX (Max 5MB)</p>
                  </CardContent>
                </Card>

                <Card className="bg-amber-50 border border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-amber-800 font-medium">AI Enhancement Available</p>
                        <p className="text-xs text-amber-700">Our AI will automatically optimize your resume for better ATS compatibility and keyword matching.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <Label htmlFor="resumeUrl" className="text-sm font-medium text-slate-700">
                    Or paste resume URL (optional)
                  </Label>
                  <Input
                    id="resumeUrl"
                    placeholder="https://your-resume-url.com"
                    value={formData.resumeUrl}
                    onChange={(e) => updateFormData("resumeUrl", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="p-6 border-t border-slate-200 flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={currentStep === 1 ? "invisible" : ""}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={!canProceed() || createProfileMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createProfileMutation.isPending ? (
              "Creating Profile..."
            ) : currentStep === totalSteps ? (
              "Complete Setup"
            ) : (
              <>
                Next Step
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
