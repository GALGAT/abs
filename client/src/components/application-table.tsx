import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Application {
  id: string;
  status: string;
  matchScore: number;
  timeAgo: string;
  job: {
    title: string;
    company: string;
  };
}

interface ApplicationTableProps {
  applications: Application[];
}

export default function ApplicationTable({ applications }: ApplicationTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-emerald-100 text-emerald-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "interview":
        return "bg-amber-100 text-amber-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "hired":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "applied":
        return "Applied";
      case "under_review":
        return "Under Review";
      case "interview":
        return "Interview";
      case "rejected":
        return "Rejected";
      case "hired":
        return "Hired";
      default:
        return status;
    }
  };

  const getResponseText = (status: string) => {
    switch (status) {
      case "applied":
        return "Pending";
      case "under_review":
        return "In Progress";
      case "interview":
        return "Interview Scheduled";
      case "rejected":
        return "Not Selected";
      case "hired":
        return "Offer Received";
      default:
        return "Unknown";
    }
  };

  if (applications.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-slate-400 mb-4">📄</div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">No applications yet</h3>
        <p className="text-slate-600">Start applying to jobs to track your progress here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-medium text-slate-600">Company</TableHead>
            <TableHead className="font-medium text-slate-600">Position</TableHead>
            <TableHead className="font-medium text-slate-600">Applied</TableHead>
            <TableHead className="font-medium text-slate-600">Status</TableHead>
            <TableHead className="font-medium text-slate-600">Response</TableHead>
            <TableHead className="font-medium text-slate-600">Match</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id} className="hover:bg-slate-50">
              <TableCell>
                <div className="font-medium text-slate-800">
                  {application.job?.company || "Unknown Company"}
                </div>
              </TableCell>
              <TableCell className="text-slate-600">
                {application.job?.title || "Unknown Position"}
              </TableCell>
              <TableCell className="text-slate-600">
                {application.timeAgo}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(application.status)}>
                  {getStatusLabel(application.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-600">
                {getResponseText(application.status)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-slate-50">
                  {application.matchScore}%
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
