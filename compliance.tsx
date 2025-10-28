import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { insertComplianceTaskSchema, insertSafetyReportSchema, type InsertComplianceTask, type InsertSafetyReport, type ComplianceTask, type SafetyReport } from "@shared/schema";
import { ShieldCheck, Plus, Calendar, AlertTriangle, CheckCircle2, Image, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Compliance() {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["/api/compliance-tasks"],
  });

  const { data: reports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/safety-reports"],
  });

  const tasksList = (tasks as ComplianceTask[]) || [];
  const reportsList = (reports as SafetyReport[]) || [];

  const taskForm = useForm<InsertComplianceTask>({
    resolver: zodResolver(insertComplianceTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
      status: "pending",
    },
  });

  const reportForm = useForm<InsertSafetyReport>({
    resolver: zodResolver(insertSafetyReportSchema),
    defaultValues: {
      title: "",
      content: "",
      incidentDate: "",
      severity: "low",
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: InsertComplianceTask) => {
      const res = await apiRequest("POST", "/api/compliance-tasks", data);
      return await res.json() as ComplianceTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/compliance-tasks"] });
      setTaskDialogOpen(false);
      taskForm.reset();
      toast({ title: "Task created", description: "Compliance task added successfully" });
    },
  });

  const createReportMutation = useMutation({
    mutationFn: async (data: InsertSafetyReport) => {
      const res = await apiRequest("POST", "/api/safety-reports", data);
      return await res.json() as SafetyReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/safety-reports"] });
      setReportDialogOpen(false);
      reportForm.reset();
      toast({ title: "Report created", description: "Safety report filed successfully" });
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const res = await apiRequest("PATCH", `/api/compliance-tasks/${id}`, { status: completed ? "completed" : "pending" });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/compliance-tasks"] });
    },
  });

  const pendingTasks = tasksList.filter((t: ComplianceTask) => t.status === "pending");
  const completedTasks = tasksList.filter((t: ComplianceTask) => t.status === "completed");

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="gradient-text">Safety & Compliance</span>
          </h1>
        </div>
        <p className="text-muted-foreground">
          Track compliance tasks, view safety protocols, and file incident reports
        </p>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="glass-card p-1 w-full sm:w-auto">
          <TabsTrigger value="tasks" className="data-[state=active]:gradient-purple-teal data-[state=active]:text-white" data-testid="tab-compliance-tasks">
            <Shield className="w-4 h-4 mr-2" />
            Compliance Tasks
          </TabsTrigger>
          <TabsTrigger value="charts" className="data-[state=active]:gradient-purple-teal data-[state=active]:text-white" data-testid="tab-safety-charts">
            <Image className="w-4 h-4 mr-2" />
            Safety Charts
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:gradient-purple-teal data-[state=active]:text-white" data-testid="tab-safety-reports">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Safety Reports
          </TabsTrigger>
        </TabsList>

        {/* Compliance Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="flex justify-between items-center gap-4 flex-wrap glass-card p-6 rounded-2xl">
            <div>
              <h2 className="text-xl font-semibold gradient-text">Compliance Tasks</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {pendingTasks.length} pending, {completedTasks.length} completed
              </p>
            </div>
            <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-purple-teal text-white shadow-lg" data-testid="button-new-task">
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card">
                <DialogHeader>
                  <DialogTitle className="gradient-text">Create Compliance Task</DialogTitle>
                </DialogHeader>
                <Form {...taskForm}>
                  <form onSubmit={taskForm.handleSubmit((data) => createTaskMutation.mutate(data))} className="space-y-6">
                    <FormField
                      control={taskForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Annual safety inspection" className="glass" {...field} value={field.value || ""} data-testid="input-task-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={taskForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Task details..." rows={4} className="glass" {...field} value={field.value || ""} data-testid="input-task-description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={taskForm.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deadline</FormLabel>
                          <FormControl>
                            <Input type="date" className="glass" {...field} value={field.value || ""} data-testid="input-task-deadline" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setTaskDialogOpen(false)} className="glass" data-testid="button-cancel-task">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createTaskMutation.isPending} className="gradient-purple-teal text-white" data-testid="button-save-task">
                        {createTaskMutation.isPending ? "Creating..." : "Create Task"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {tasksLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading tasks...</div>
            </div>
          ) : tasksList.length === 0 ? (
            <Card className="glass-card py-12">
              <CardContent className="text-center space-y-4">
                <div className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 to-amber-600/10">
                  <ShieldCheck className="w-16 h-16 text-muted-foreground/30" />
                </div>
                <h3 className="font-semibold text-lg">No compliance tasks</h3>
                <p className="text-sm text-muted-foreground">Create your first task to track compliance deadlines</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tasksList.map((task: ComplianceTask) => (
                <Card key={task.id} className="glass-card hover-elevate transition-all" data-testid={`card-task-${task.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={(checked) =>
                          toggleTaskMutation.mutate({ id: task.id, completed: !!checked })
                        }
                        className="mt-1"
                        data-testid={`checkbox-task-${task.id}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          </div>
                          <Badge variant={task.status === "completed" ? "outline" : "default"} className="glass">
                            {task.status === "completed" ? (
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 mr-1" />
                            )}
                            {task.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Safety Charts Tab */}
        <TabsContent value="charts" className="space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-semibold gradient-text mb-2">Safety Protocol Diagrams</h2>
            <p className="text-sm text-muted-foreground">
              Reference materials for laboratory safety procedures
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-card hover-elevate hover:scale-[1.02] transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 gradient-text">
                  <Image className="w-5 h-5" />
                  Hazard Assessment Flowchart
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Step-by-step process for evaluating chemical hazards
                </p>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl glass overflow-hidden">
                  <img
                    src="/safety-flowchart.svg"
                    alt="Chemical Hazard Assessment Flowchart"
                    className="w-full h-auto"
                    data-testid="img-safety-flowchart"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-elevate hover:scale-[1.02] transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 gradient-text">
                  <Image className="w-5 h-5" />
                  PPE Requirements
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Personal protective equipment by hazard level
                </p>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl glass overflow-hidden">
                  <img
                    src="/ppe-requirements.svg"
                    alt="Personal Protective Equipment Requirements"
                    className="w-full h-auto"
                    data-testid="img-ppe-requirements"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-elevate hover:scale-[1.02] transition-all duration-300 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 gradient-text">
                  <Image className="w-5 h-5" />
                  Risk Assessment Matrix
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Severity vs. probability hazard classification
                </p>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl glass overflow-hidden max-w-2xl mx-auto">
                  <img
                    src="/risk-matrix.svg"
                    alt="Chemical Risk Assessment Matrix"
                    className="w-full h-auto"
                    data-testid="img-risk-matrix"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Safety Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center gap-4 flex-wrap glass-card p-6 rounded-2xl">
            <div>
              <h2 className="text-xl font-semibold gradient-text">Safety Reports</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Document incidents and safety observations
              </p>
            </div>
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-purple-teal text-white shadow-lg" data-testid="button-new-report">
                  <Plus className="w-4 h-4 mr-2" />
                  File Report
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card">
                <DialogHeader>
                  <DialogTitle className="gradient-text">File Safety Report</DialogTitle>
                </DialogHeader>
                <Form {...reportForm}>
                  <form onSubmit={reportForm.handleSubmit((data) => createReportMutation.mutate(data))} className="space-y-6">
                    <FormField
                      control={reportForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief description of incident" className="glass" {...field} data-testid="input-report-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={reportForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Details</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Full incident report..." rows={6} className="glass" {...field} data-testid="input-report-content" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={reportForm.control}
                      name="incidentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Incident Date</FormLabel>
                          <FormControl>
                            <Input type="date" className="glass" {...field} data-testid="input-report-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setReportDialogOpen(false)} className="glass" data-testid="button-cancel-report">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createReportMutation.isPending} className="gradient-purple-teal text-white" data-testid="button-save-report">
                        {createReportMutation.isPending ? "Filing..." : "File Report"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {reportsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading reports...</div>
            </div>
          ) : reportsList.length === 0 ? (
            <Card className="glass-card py-12">
              <CardContent className="text-center space-y-4">
                <div className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-red-500/10 to-red-600/10">
                  <AlertTriangle className="w-16 h-16 text-muted-foreground/30" />
                </div>
                <h3 className="font-semibold text-lg">No safety reports</h3>
                <p className="text-sm text-muted-foreground">File a report to document safety incidents or observations</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {reportsList.map((report: SafetyReport) => (
                <Card key={report.id} className="glass-card hover-elevate hover:scale-[1.02] transition-all duration-300" data-testid={`card-report-${report.id}`}>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{report.title}</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(report.incidentDate).toLocaleDateString()}</span>
                      <Badge variant="outline" className="ml-auto glass">
                        {report.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                      {report.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
