import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, MapPin, DollarSign, Clock, Sparkles, Edit } from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    minSalary?: number;
    maxSalary?: number;
    description: string;
    skills: string[];
    matchScore: number;
    timeAgo: string;
    isRemote: boolean;
  };
  onApply: (useAI: boolean) => void;
  isApplying: boolean;
  hasApplied: boolean;
}

export default function JobCard({ job, onApply, isApplying, hasApplied }: JobCardProps) {
  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-emerald-100 text-emerald-800";
    if (score >= 80) return "bg-blue-100 text-blue-800";
    if (score >= 70) return "bg-amber-100 text-amber-800";
    return "bg-slate-100 text-slate-800";
  };

  const getSkillColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-emerald-100 text-emerald-800",
      "bg-purple-100 text-purple-800",
      "bg-amber-100 text-amber-800",
      "bg-pink-100 text-pink-800"
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-slate-800">{job.title}</h3>
              <Badge className={getMatchColor(job.matchScore)}>
                {job.matchScore}% Match
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
              <span className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                {job.company}
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </span>
              {(job.minSalary || job.maxSalary) && (
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {job.minSalary && job.maxSalary
                    ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
                    : job.minSalary
                    ? `$${job.minSalary.toLocaleString()}+`
                    : `Up to $${job.maxSalary?.toLocaleString()}`
                  }
                </span>
              )}
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {job.timeAgo}
              </span>
            </div>
            
            <p className="text-slate-700 mb-4 line-clamp-2">
              {job.description.substring(0, 200)}...
            </p>
            
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 6).map((skill, index) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className={getSkillColor(index)}
                >
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 6 && (
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                  +{job.skills.length - 6} more
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 ml-6">
            {hasApplied ? (
              <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2">
                Applied ✓
              </Badge>
            ) : (
              <>
                <Button
                  onClick={() => onApply(true)}
                  disabled={isApplying}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isApplying ? "Applying..." : "AI Apply"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onApply(false)}
                  disabled={isApplying}
                  className="border-slate-300 hover:bg-slate-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
