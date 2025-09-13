import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";
import { isUnauthorizedError } from "../lib/authUtils";
import { apiRequest } from "../lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus, Search, UserCheck, UserX, Upload, Edit, Trash2, Eye, Users, Calendar, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import AddCandidateModal from "../components/AddCandidateModal";
import EditCandidateModal from "../components/EditCandidateModal";
import { initializeDemoData, getDemoCandidates, getDemoJobs } from "../utils/demoData";

export default function Candidates() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobTitleFilter, setJobTitleFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  // Initialize demo data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeDemoData();
    }
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: candidates = [], isLoading: candidatesLoading } = useQuery<any[]>({
    queryKey: ["/api/candidates"],
    queryFn: async () => {
      // Check if we're in demo mode
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
      
      if (isDemoMode) {
        // Return demo candidates filtered by HR user
        const demoCandidates = getDemoCandidates();
        const userCandidates = demoCandidates.filter((candidate: any) => candidate.hrHandlingUserId === user?.id);
        return userCandidates;
      }
      
      // In normal mode, make the API request
      const response = await apiRequest("/api/candidates", { method: "GET" });
      return response;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: jobs = [] } = useQuery<any[]>({
    queryKey: ["/api/jobs"],
    queryFn: async () => {
      // Check if we're in demo mode
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
      
      if (isDemoMode) {
        // Return demo jobs filtered by HR user
        const demoJobs = getDemoJobs();
        const userJobs = demoJobs.filter((job: any) => job.hrHandlingUserId === user?.id);
        return userJobs;
      }
      
      // In normal mode, make the API request
      const response = await apiRequest("/api/jobs", { method: "GET" });
      return response;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  const updateCandidateMutation = useMutation({
    mutationFn: async ({ id, status, interviewLink, technicalPersonEmail }: { id: number; status: string; interviewLink?: string; technicalPersonEmail?: string }) => {
      // Check if we're in demo mode
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
      
      if (isDemoMode) {
        // In demo mode, just update in localStorage
        const demoCandidates = getDemoCandidates();
        const updatedCandidates = demoCandidates.map((candidate: any) => {
          if (candidate.id === id) {
            return { ...candidate, status, interviewLink, technicalPersonEmail };
          }
          return candidate;
        });
        localStorage.setItem('demoCandidates', JSON.stringify(updatedCandidates));
        return { success: true };
      }
      
      // In normal mode, make the API request
      await apiRequest(`/api/candidates/${id}`, {
        method: "PUT",
        body: { status, interviewLink, technicalPersonEmail },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/candidates"] });
      toast({
        title: "Success",
        description: "Candidate status updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update candidate status",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (candidateId: number, newStatus: string) => {
    updateCandidateMutation.mutate({ id: candidateId, status: newStatus });
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCandidate(null);
  };

  const handleEditCandidate = (candidate: any) => {
    setEditingCandidate(candidate);
  };

  const handleDeleteCandidate = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowDeleteDialog(true);
  };

  const deleteCandidateMutation = useMutation({
    mutationFn: async (candidateId: number) => {
      // Check if we're in demo mode
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
      
      if (isDemoMode) {
        // In demo mode, just remove from localStorage
        const demoCandidates = getDemoCandidates();
        const updatedCandidates = demoCandidates.filter((candidate: any) => candidate.id !== candidateId);
        localStorage.setItem('demoCandidates', JSON.stringify(updatedCandidates));
        return { success: true };
      }
      
      // In normal mode, make the API request
      await apiRequest(`/api/candidates/${candidateId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/candidates"] });
      setShowDeleteDialog(false);
      setSelectedCandidate(null);
      toast({
        title: "Success",
        description: "Candidate deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete candidate",
        variant: "destructive",
      });
    },
  });

  const handleConfirmDelete = () => {
    if (selectedCandidate) {
      deleteCandidateMutation.mutate(selectedCandidate.id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resume_reviewed':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Resume Reviewed</Badge>;
      case 'interview_scheduled':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Interview Scheduled</Badge>;
      case 'report_generated':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Report Generated</Badge>;
      case 'hired':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Hired</Badge>;
      case 'not_selected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Not Selected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getJobTitle = (jobId: number) => {
    const job = jobs?.find((j: any) => j.id === jobId);
    return job?.jobTitle || 'Unknown Position';
  };

  const filteredCandidates = candidates?.filter((candidate: any) => {
    const matchesSearch = candidate.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    const matchesJobTitle = jobTitleFilter === "all" || getJobTitle(candidate.jobId) === jobTitleFilter;
    
    return matchesSearch && matchesStatus && matchesJobTitle;
  }) || [];

  if (isLoading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header with enhanced styling */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3" data-testid="page-title">
              Candidate Management
            </h1>
            <p className="text-muted-foreground mt-1">Review and manage candidate applications</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild data-testid="upload-add-button" className="bg-primary hover:bg-primary/90">
              <a href="/hr/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Resumes
              </a>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{candidates?.length || 0}</div>
              <p className="text-xs text-muted-foreground">All applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resume Reviewed</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {candidates?.filter((c: any) => c.status === 'resume_reviewed').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Under review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interview Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {candidates?.filter((c: any) => c.status === 'interview_scheduled').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Upcoming interviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hired</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {candidates?.filter((c: any) => c.status === 'hired').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Successful hires</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Selected</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {candidates?.filter((c: any) => c.status === 'not_selected').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Unsuccessful</p>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card>
          {/* Table Controls */}
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 max-w-sm"
                  data-testid="search-input"
                />
              </div>
              
              {/* Filters */}
              <div className="flex space-x-3">
                {/* Job Title Filter */}
                <Select value={jobTitleFilter} onValueChange={setJobTitleFilter}>
                  <SelectTrigger className="w-[160px]" data-testid="job-title-filter">
                    <SelectValue placeholder="All Job Titles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Job Titles</SelectItem>
                    {/* Get unique job titles from jobs */}
                    {[...new Set(jobs?.map((job: any) => job.jobTitle) || [])].map((title: string) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]" data-testid="status-filter">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="resume_reviewed">Resume Reviewed</SelectItem>
                    <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                    <SelectItem value="report_generated">Report Generated</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="not_selected">Not Selected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          {/* Candidates Table */}
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Match %</TableHead>
                    <TableHead>HR Handling</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Report Link</TableHead>
                    <TableHead>Interview Link</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidatesLoading ? (
                    <TableRow>
                      <TableCell colSpan={13} className="text-center py-8">
                        Loading candidates...
                      </TableCell>
                    </TableRow>
                  ) : filteredCandidates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                        No candidates found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCandidates.map((candidate: any) => (
                      <TableRow key={candidate.id} className="hover:bg-muted/50" data-testid={`candidate-row-${candidate.id}`}>
                        <TableCell className="font-medium">{candidate.candidateName}</TableCell>
                        <TableCell>{candidate.id}</TableCell>
                        <TableCell className="text-foreground">
                          {getJobTitle(candidate.jobId)}
                        </TableCell>
                        <TableCell>{candidate.jobId}</TableCell>
                        <TableCell className="text-muted-foreground">{candidate.email}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {candidate.candidateSkills?.join(', ') || 'No skills specified'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {candidate.candidateExperience || 'Not specified'}
                        </TableCell>
                        <TableCell>
                          {candidate.matchPercentage ? (
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-medium ${
                                candidate.matchPercentage >= 80 ? 'text-green-600' :
                                candidate.matchPercentage >= 60 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {Math.round(candidate.matchPercentage)}%
                              </span>
                              <Progress
                                value={candidate.matchPercentage}
                                className="w-16 h-2"
                              />
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>{candidate.hrHandlingUserId || 'N/A'}</TableCell>
                        <TableCell>
                          {getStatusBadge(candidate.status)}
                        </TableCell>
                        <TableCell>
                          {candidate.reportLink ? (
                            <a href={candidate.reportLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                              <Eye className="h-4 w-4" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {candidate.interviewLink ? (
                            <a href={candidate.interviewLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                              <Eye className="h-4 w-4" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCandidate(candidate)}
                              className="text-blue-600 hover:text-blue-700"
                              data-testid={`edit-candidate-${candidate.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCandidate(candidate)}
                              className="text-red-600 hover:text-red-700"
                              data-testid={`delete-candidate-${candidate.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredCandidates.length > 0 && (
              <div className="px-6 py-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{Math.min(filteredCandidates.length, 10)}</span> of{" "}
                    <span className="font-medium">{filteredCandidates.length}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                      1
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Candidate Modal */}
        {showAddModal && (
          <AddCandidateModal
            candidate={editingCandidate}
            onClose={handleCloseModal}
          />
        )}

        {/* Edit Candidate Modal */}
        {editingCandidate && (
          <EditCandidateModal
            candidate={editingCandidate}
            onClose={() => setEditingCandidate(null)}
          />
        )}

        {/* Delete Candidate Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Candidate</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedCandidate?.candidateName}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmDelete}
                disabled={deleteCandidateMutation.isPending}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}