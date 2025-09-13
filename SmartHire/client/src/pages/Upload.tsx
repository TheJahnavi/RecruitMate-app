"use client";

import { useState, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { useToast } from "../hooks/use-toast";
import {
  Upload as UploadIcon,
  FileText,
  Brain,
  CheckCircle,
  AlertCircle,
  Users,
  Loader2,
  MessageSquare,
  X,
  FileUp,
  Database,
  Zap,
} from "lucide-react";

interface ExtractedCandidate {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: {
    years: number;
    projects: {
      name: string;
      skills: string[];
      years: number;
    }[];
  };
  summary: string;
  portfolioLink?: string;
  workExperience: string;
  projectExperience: string;
}

interface JobMatch {
  candidateId: string;
  name: string;
  email: string;
  matchPercentage: number;
  "percentage match summary": string;
  skillMatchBreakdown: {
    skill: string;
    matchLevel: "Strong" | "Moderate" | "Weak" | "Missing";
    percentage: number;
    explanation: string;
  }[];
  strengthsBehindReasons: {
    reason: string;
    points: number;
    experienceList: string[];
  }[];
  lagBehindReasons: {
    reason: string;
    points: number;
    gaps: string;
  }[];
  reportUrl?: string;
}

interface InterviewQuestions {
  technical: string[];
  behavioral: string[];
  jobSpecific: string[];
}

type UploadStep = "upload" | "extracted" | "matched" | "added";

export default function Upload() {
  const [currentStep, setCurrentStep] = useState<UploadStep>("upload");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [extractedCandidates, setExtractedCandidates] = useState<ExtractedCandidate[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [matchResults, setMatchResults] = useState<JobMatch[]>([]);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(new Set());
  const [showInterviewQuestions, setShowInterviewQuestions] = useState<{[key: string]: InterviewQuestions}>({});
  const [isQuestionsDialogOpen, setIsQuestionsDialogOpen] = useState(false);
  const [selectedCandidateForQuestions, setSelectedCandidateForQuestions] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available jobs
  const { data: jobs = [] } = useQuery<any[]>({
    queryKey: ["/api/jobs"],
  });

  // Step 1: Upload and extract data
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      // Check if we're in demo mode
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
      
      if (isDemoMode) {
        // In demo mode, return mock extracted candidates
        const mockCandidates: ExtractedCandidate[] = [
          {
            id: `temp_${Date.now()}_1`,
            name: "John Smith",
            email: "john.smith@example.com",
            skills: ["React", "JavaScript", "CSS", "HTML"],
            experience: {
              years: 4,
              projects: [
                {
                  name: "E-commerce Platform",
                  skills: ["React", "Redux", "Node.js"],
                  years: 2
                },
                {
                  name: "Dashboard Application",
                  skills: ["React", "D3.js", "CSS"],
                  years: 2
                }
              ]
            },
            summary: "Experienced frontend developer with expertise in React and modern JavaScript frameworks. Strong track record of building responsive web applications.",
            workExperience: "Frontend Developer at WebCorp (2 years), Junior Developer at StartUp (2 years)",
            projectExperience: "E-commerce platform with React, Dashboard application with Redux"
          },
          {
            id: `temp_${Date.now()}_2`,
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
            skills: ["React", "TypeScript", "Redux", "CSS"],
            experience: {
              years: 5,
              projects: [
                {
                  name: "CRM Application",
                  skills: ["React", "TypeScript", "GraphQL"],
                  years: 3
                },
                {
                  name: "Mobile App",
                  skills: ["React Native", "Firebase", "Redux"],
                  years: 2
                }
              ]
            },
            summary: "Senior frontend developer specializing in React and TypeScript. Extensive experience with state management and performance optimization.",
            workExperience: "Senior Frontend Developer at TechCorp (3 years), Developer at Agency (2 years)",
            projectExperience: "CRM application with React and TypeScript, Mobile app with React Native"
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { candidates: mockCandidates };
      }
      
      // In normal mode, make the API request
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("resumes", file);
      });

      return apiRequest("/api/upload/resumes", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: (data) => {
      const candidatesWithIds = data.candidates.map((candidate: any, index: number) => ({
        ...candidate,
        id: candidate.id || `temp_${Date.now()}_${index}`,
      }));
      
      setExtractedCandidates(candidatesWithIds);
      setCurrentStep("extracted");
      
      toast({
        title: "Success",
        description: `Extracted data from ${candidatesWithIds.length} resumes`,
      });
    },
    onError: (error: any) => {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process resumes. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Step 2: Analyze and match candidates
  const matchMutation = useMutation({
    mutationFn: async ({
      candidates,
      jobId,
    }: {
      candidates: ExtractedCandidate[];
      jobId: string;
    }) => {
      return apiRequest("/api/ai/match-candidates", {
        method: "POST",
        body: { candidates, jobId: parseInt(jobId) },
      });
    },
    onSuccess: (data) => {
      const matchesWithIds = data.matches.map((match: any, index: number) => ({
        ...match,
        candidateId: extractedCandidates[index]?.id || `temp_${Date.now()}_${index}`,
      }));
      
      setMatchResults(matchesWithIds);
      setCurrentStep("matched");
      
      toast({
        title: "Success",
        description: `Matched ${matchesWithIds.length} candidates against job requirements`,
      });
    },
    onError: (error: any) => {
      console.error("Match error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to match candidates",
        variant: "destructive",
      });
    },
  });

  // Interview questions generation
  const questionsMutation = useMutation({
    mutationFn: async (candidateId: string) => {
      const candidate = extractedCandidates.find(c => c.id === candidateId);
      if (!candidate) {
        throw new Error("Candidate not found");
      }

      return apiRequest("/api/ai/generate-questions", {
        method: "POST",
        body: { candidate, jobId: parseInt(selectedJobId) },
      });
    },
    onSuccess: (data, candidateId) => {
      setShowInterviewQuestions(prev => ({
        ...prev,
        [candidateId]: data.questions,
      }));
      setSelectedCandidateForQuestions(candidateId);
      setIsQuestionsDialogOpen(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate interview questions",
        variant: "destructive",
      });
    },
  });

  // Generate detailed match reports
  const reportMutation = useMutation({
    mutationFn: async ({ candidate, jobId, matchResult }: {
      candidate: ExtractedCandidate;
      jobId: string;
      matchResult: JobMatch;
    }) => {
      return apiRequest("/api/ai/generate-report", {
        method: "POST",
        body: { candidate, jobId: parseInt(jobId), matchResult },
      });
    },
    onSuccess: (data, variables) => {
      // Update the match result with the report URL
      setMatchResults(prev => prev.map(match => 
        match.candidateId === variables.candidate.id 
          ? { ...match, reportUrl: data.reportUrl }
          : match
      ));
      
      toast({
        title: "Success",
        description: "Match report generated successfully",
      });
    },
    onError: (error: any) => {
      console.error("Report generation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate match report",
        variant: "destructive",
      });
    },
  });

  // Step 3: Add selected candidates to database
  const addCandidatesMutation = useMutation({
    mutationFn: async (selectedIds: string[]) => {
      const selectedData = selectedIds.map(id => {
        const candidate = extractedCandidates.find(c => c.id === id);
        const match = matchResults.find(m => m.candidateId === id);
        
        if (!candidate || !match) {
          throw new Error(`Missing data for candidate ${id}`);
        }

        return {
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          skills: candidate.skills,
          experience: candidate.experience,
          matchPercentage: match.matchPercentage,
        };
      });

      return apiRequest("/api/candidates/add", {
        method: "POST",
        body: { candidates: selectedData, jobId: parseInt(selectedJobId) },
      });
    },
    onSuccess: () => {
      setCurrentStep("added");
      queryClient.invalidateQueries({ queryKey: ["/api/candidates"] });
      toast({
        title: "Success",
        description: "Selected candidates have been added to the system",
      });
    },
    onError: (error: any) => {
      console.error("Add candidates error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add candidates",
        variant: "destructive",
      });
    },
  });

  // Event handlers
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUploadAndExtract = () => {
    if (selectedFiles && selectedFiles.length > 0) {
      const files = Array.from(selectedFiles);
      uploadMutation.mutate(files);
    } else {
      toast({
        title: "Error",
        description: "Please select files to upload",
        variant: "destructive",
      });
    }
  };

  const handleAnalyzeAndMatch = () => {
    if (!selectedJobId) {
      toast({
        title: "Error",
        description: "Please select a job role first",
        variant: "destructive",
      });
      return;
    }

    if (extractedCandidates.length === 0) {
      toast({
        title: "Error",
        description: "No candidates to analyze",
        variant: "destructive",
      });
      return;
    }

    matchMutation.mutate({
      candidates: extractedCandidates,
      jobId: selectedJobId,
    });
  };

  const handleAddSelected = () => {
    if (selectedCandidateIds.size === 0) {
      toast({
        title: "Error",
        description: "Please select at least one candidate",
        variant: "destructive",
      });
      return;
    }

    addCandidatesMutation.mutate(Array.from(selectedCandidateIds));
  };

  const toggleCandidateSelection = (candidateId: string) => {
    const newSelection = new Set(selectedCandidateIds);
    if (newSelection.has(candidateId)) {
      newSelection.delete(candidateId);
    } else {
      newSelection.add(candidateId);
    }
    setSelectedCandidateIds(newSelection);
  };

  const resetFlow = () => {
    setCurrentStep("upload");
    setSelectedFiles(null);
    setExtractedCandidates([]);
    setSelectedJobId("");
    setMatchResults([]);
    setSelectedCandidateIds(new Set());
    setShowInterviewQuestions({});
    setIsQuestionsDialogOpen(false);
    setSelectedCandidateForQuestions(null);
  };

  const handleGenerateQuestions = (candidateId: string) => {
    if (!selectedJobId) {
      toast({
        title: "Error",
        description: "Job role is required to generate questions",
        variant: "destructive",
      });
      return;
    }
    questionsMutation.mutate(candidateId);
  };

  const handleGenerateReport = (candidateId: string) => {
    const candidate = extractedCandidates.find(c => c.id === candidateId);
    const matchResult = matchResults.find(m => m.candidateId === candidateId);
    
    if (!candidate || !matchResult) {
      toast({
        title: "Error",
        description: "Missing candidate or match data",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedJobId) {
      toast({
        title: "Error",
        description: "Job role is required to generate report",
        variant: "destructive",
      });
      return;
    }
    
    reportMutation.mutate({
      candidate,
      jobId: selectedJobId,
      matchResult
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Resume Upload & Analysis</h1>
        <p className="text-muted-foreground">
          Upload resumes, analyze candidate data, and match with job requirements
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center space-x-4 mb-8">
        <div className={`flex items-center space-x-2 ${currentStep === "upload" ? "text-primary" : currentStep === "extracted" || currentStep === "matched" || currentStep === "added" ? "text-green-600" : "text-muted-foreground"}`}>
          <FileUp className="w-5 h-5" />
          <span>Upload & Extract</span>
        </div>
        <div className={`flex items-center space-x-2 ${currentStep === "extracted" ? "text-primary" : currentStep === "matched" || currentStep === "added" ? "text-green-600" : "text-muted-foreground"}`}>
          <Brain className="w-5 h-5" />
          <span>Analyze & Match</span>
        </div>
        <div className={`flex items-center space-x-2 ${currentStep === "matched" ? "text-primary" : currentStep === "added" ? "text-green-600" : "text-muted-foreground"}`}>
          <Users className="w-5 h-5" />
          <span>Select & Add</span>
        </div>
      </div>

      {/* Step 1: Upload and Extract */}
      {currentStep === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="w-5 h-5" />
              Step 1: Upload Resume Files
            </CardTitle>
            <CardDescription>
              Select PDF or DOCX resume files to extract candidate data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="mb-4"
                  data-testid="input-resume-files"
                />
                {selectedFiles && (
                  <div className="text-sm text-muted-foreground">
                    Selected {selectedFiles.length} file(s)
                  </div>
                )}
              </div>
              <Button
                onClick={handleUploadAndExtract}
                disabled={uploadMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90"
                data-testid="button-upload-extract"
              >
                {uploadMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Upload and Extract Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Show Extracted Candidates */}
      {currentStep === "extracted" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Step 2: Extracted Candidates
            </CardTitle>
            <CardDescription>
              Review extracted candidate data and select job role for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Job Selection */}
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Select Job Role</label>
                  <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                    <SelectTrigger data-testid="select-job-role">
                      <SelectValue placeholder="Choose a job role..." />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job: any) => (
                        <SelectItem key={job.id} value={job.id.toString()}>
                          {job.jobTitle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAnalyzeAndMatch}
                  disabled={matchMutation.isPending || !selectedJobId}
                  className="bg-primary hover:bg-primary/90"
                  data-testid="button-analyze-match"
                >
                  {matchMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Analyze & Percentage Match
                </Button>
              </div>

              {/* Candidates Table */}
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Name</TableHead>
                      <TableHead className="w-[200px]">Email</TableHead>
                      <TableHead className="w-[300px]">Skills</TableHead>
                      <TableHead className="w-[100px]">Experience</TableHead>
                      <TableHead className="w-[200px]">Work/Project Experience</TableHead>
                      <TableHead className="w-[100px]">Portfolio</TableHead>
                      <TableHead className="w-[300px]">Summary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extractedCandidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell className="text-sm">{candidate.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[280px]">
                            {candidate.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="space-y-1">
                            <div className="font-medium">{candidate.experience.years} years</div>
                            <div className="text-xs text-muted-foreground">
                              {candidate.experience.projects.length} projects
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm max-w-[180px]">
                          <div className="space-y-2">
                            <div>
                              <div className="text-xs font-medium text-blue-600">Work:</div>
                              <div className="text-xs line-clamp-2">{candidate.workExperience}</div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-green-600">Projects:</div>
                              <div className="text-xs line-clamp-2">{candidate.projectExperience}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {candidate.portfolioLink ? (
                            <a 
                              href={candidate.portfolioLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline text-xs"
                            >
                              View Portfolio
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs">No portfolio</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm max-w-[280px]">
                          <div className="line-clamp-4">
                            {candidate.summary}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Show Matched Results */}
      {currentStep === "matched" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Step 3: Candidate Matches
            </CardTitle>
            <CardDescription>
              Select candidates to add to the system based on their match scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {selectedCandidateIds.size} of {matchResults.length} candidates selected
                </div>
                <Button
                  onClick={handleAddSelected}
                  disabled={addCandidatesMutation.isPending || selectedCandidateIds.size === 0}
                  className="bg-primary hover:bg-primary/90"
                  data-testid="button-add-selected"
                >
                  {addCandidatesMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Add Selected Candidates
                </Button>
              </div>

              <div className="space-y-4">
                {matchResults.map((match) => {
                  const candidate = extractedCandidates.find(c => c.id === match.candidateId);
                  if (!candidate) return null;

                  return (
                    <Card key={match.candidateId} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={selectedCandidateIds.has(match.candidateId)}
                              onCheckedChange={() => toggleCandidateSelection(match.candidateId)}
                              data-testid={`checkbox-candidate-${match.candidateId}`}
                            />
                            <div>
                              <h3 className="font-semibold">{candidate.name}</h3>
                              <p className="text-sm text-muted-foreground">{candidate.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={match.matchPercentage >= 70 ? "default" : match.matchPercentage >= 50 ? "secondary" : "destructive"}
                            >
                              {match.matchPercentage}% Match
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <p className="text-sm">{match["percentage match summary"]}</p>
                          
                          {/* Skill Match Breakdown */}
                          {match.skillMatchBreakdown && match.skillMatchBreakdown.length > 0 && (
                            <div>
                              <h4 className="font-medium text-sm text-blue-600 mb-2">Skill Match Analysis:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {match.skillMatchBreakdown.map((skill, index) => (
                                  <div key={index} className="text-xs p-2 border rounded">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">{skill.skill}</span>
                                      <Badge 
                                        variant={skill.matchLevel === 'Strong' ? 'default' : 
                                                skill.matchLevel === 'Moderate' ? 'secondary' : 
                                                skill.matchLevel === 'Weak' ? 'outline' : 'destructive'}
                                        className="text-xs"
                                      >
                                        {skill.percentage}% {skill.matchLevel}
                                      </Badge>
                                    </div>
                                    <p className="text-muted-foreground mt-1">{skill.explanation}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {match.strengthsBehindReasons && match.strengthsBehindReasons.length > 0 && (
                            <div>
                              <h4 className="font-medium text-sm text-green-600 mb-1">Strengths:</h4>
                              {match.strengthsBehindReasons.map((strength, index) => (
                                <div key={index} className="text-xs pl-2 border-l-2 border-green-200">
                                  <strong>{strength.reason}</strong> (+{strength.points} points)
                                  <div className="text-muted-foreground">
                                    Technologies: {strength.experienceList.join(", ")}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {match.lagBehindReasons && match.lagBehindReasons.length > 0 && (
                            <div>
                              <h4 className="font-medium text-sm text-red-600 mb-1">Areas for Improvement:</h4>
                              {match.lagBehindReasons.map((area, index) => (
                                <div key={index} className="text-xs pl-2 border-l-2 border-red-200">
                                  <strong>{area.reason}</strong> ({area.points} points): {area.gaps}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="pt-2 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateQuestions(match.candidateId)}
                              disabled={questionsMutation.isPending}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {questionsMutation.isPending ? (
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              ) : (
                                <MessageSquare className="w-3 h-3 mr-1" />
                              )}
                              Interview Questions
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateReport(match.candidateId)}
                              disabled={reportMutation.isPending}
                              className="text-green-600 hover:text-green-800"
                            >
                              {reportMutation.isPending ? (
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              ) : (
                                <FileText className="w-3 h-3 mr-1" />
                              )}
                              Generate Report
                            </Button>
                            
                            {match.reportUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="text-purple-600 hover:text-purple-800"
                              >
                                <a href={match.reportUrl} target="_blank" rel="noopener noreferrer">
                                  <FileText className="w-3 h-3 mr-1" />
                                  View Report
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Success */}
      {currentStep === "added" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Candidates Added Successfully
            </CardTitle>
            <CardDescription>
              The selected candidates have been added to your candidate database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                {selectedCandidateIds.size} candidates were successfully added to the system
              </p>
              <Button onClick={resetFlow} variant="outline" data-testid="button-upload-more">
                Upload More Resumes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interview Questions Dialog */}
      <Dialog open={isQuestionsDialogOpen} onOpenChange={setIsQuestionsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Interview Questions
            </DialogTitle>
            <DialogDescription>
              AI-generated questions based on candidate profile and job requirements
            </DialogDescription>
          </DialogHeader>
          
          {selectedCandidateForQuestions && showInterviewQuestions[selectedCandidateForQuestions] && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-sm mb-3 text-blue-600">Technical Questions</h3>
                <div className="space-y-2">
                  {showInterviewQuestions[selectedCandidateForQuestions].technical.map((question, index) => (
                    <div key={index} className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
                      <span className="font-medium text-blue-800 dark:text-blue-200">Q{index + 1}:</span> {question}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3 text-green-600">Behavioral Questions</h3>
                <div className="space-y-2">
                  {showInterviewQuestions[selectedCandidateForQuestions].behavioral.map((question, index) => (
                    <div key={index} className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-sm">
                      <span className="font-medium text-green-800 dark:text-green-200">Q{index + 1}:</span> {question}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3 text-purple-600">Job-Specific Questions</h3>
                <div className="space-y-2">
                  {showInterviewQuestions[selectedCandidateForQuestions].jobSpecific.map((question, index) => (
                    <div key={index} className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-sm">
                      <span className="font-medium text-purple-800 dark:text-purple-200">Q{index + 1}:</span> {question}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}