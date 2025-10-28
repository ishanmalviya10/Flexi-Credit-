import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, FileText, ShieldCheck, AlertTriangle, Sparkles, ArrowRight } from "lucide-react";
import { HazardBadge } from "@/components/hazard-badge";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { type Experiment } from "@shared/schema";

export default function Dashboard() {
  const { data: experiments = [], isLoading } = useQuery({
    queryKey: ["/api/experiments"],
  });

  const experimentsList = (experiments as Experiment[]) || [];
  const totalExperiments = experimentsList.length;
  const hazardCounts = experimentsList.reduce((acc: Record<string, number>, exp: Experiment) => {
    acc[exp.hazardLevel] = (acc[exp.hazardLevel] || 0) + 1;
    return acc;
  }, {});
  const recentExperiments = experimentsList.slice(0, 5);

  const chartData = [
    { name: "Safe", count: hazardCounts.safe || 0, fill: "hsl(var(--chart-2))" },
    { name: "Caution", count: hazardCounts.caution || 0, fill: "hsl(var(--chart-3))" },
    { name: "Danger", count: hazardCounts.danger || 0, fill: "hsl(var(--chart-5))" },
    { name: "Critical", count: hazardCounts.critical || 0, fill: "hsl(var(--destructive))" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 animate-spin text-primary" />
          <span className="text-lg text-muted-foreground">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-12 border-t-4 border-t-purple-500">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-teal-500/10" />
        <div className="relative space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="gradient-text">Welcome to ChemSense</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            AI-powered chemical hazard prediction and safety compliance tracking for modern laboratories
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-l-4 border-l-purple-500 hover-elevate transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Experiments</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20">
                <FlaskConical className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-text" data-testid="text-stat-value-total-experiments">{totalExperiments}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-red-500 hover-elevate transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Hazards</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500" data-testid="text-stat-value-active-hazards">
              {(hazardCounts.danger || 0) + (hazardCounts.critical || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-teal-500 hover-elevate transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Lab Notes</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500/20 to-teal-600/20">
                <FileText className="w-5 h-5 text-teal-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-500">12</div>
            <p className="text-xs text-muted-foreground mt-1">Recent entries</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-amber-500 hover-elevate transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Tasks</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">3</div>
            <p className="text-xs text-muted-foreground mt-1">Pending deadlines</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Hazard Distribution Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <span className="gradient-text">Hazard Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalExperiments === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No experiments yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Experiments */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <span className="gradient-text">Recent Experiments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentExperiments.length === 0 ? (
                <div className="h-[300px] flex flex-col items-center justify-center text-center py-12">
                  <div className="p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 mb-4">
                    <FlaskConical className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">No experiments yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Start by creating a hazard prediction</p>
                </div>
              ) : (
                recentExperiments.map((exp) => (
                  <div
                    key={exp.id}
                    className="group relative overflow-hidden rounded-xl glass p-4 hover-elevate transition-all duration-300"
                    data-testid={`card-experiment-${exp.id}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{exp.compoundName}</h4>
                        <p className="text-sm text-muted-foreground font-mono mt-1">
                          {exp.concentration} mol/L • {exp.temperature}°C
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(exp.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <HazardBadge level={exp.hazardLevel as any} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/predictor">
          <Card className="group glass-card hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer h-full" data-testid="link-quick-predictor">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 mb-4">
                <FlaskConical className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2 gradient-text">New Prediction</h3>
              <p className="text-sm text-muted-foreground mb-3">Analyze chemical hazards with AI</p>
              <ArrowRight className="w-5 h-5 mx-auto text-purple-500 group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/notebook">
          <Card className="group glass-card hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300 cursor-pointer h-full" data-testid="link-quick-notebook">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-teal-500/20 to-teal-600/20 mb-4">
                <FileText className="w-8 h-8 text-teal-500" />
              </div>
              <h3 className="font-semibold mb-2 gradient-text">Lab Notebook</h3>
              <p className="text-sm text-muted-foreground mb-3">Document your findings</p>
              <ArrowRight className="w-5 h-5 mx-auto text-teal-500 group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/compliance">
          <Card className="group glass-card hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer h-full" data-testid="link-quick-compliance">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 mb-4">
                <ShieldCheck className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="font-semibold mb-2 gradient-text">Compliance</h3>
              <p className="text-sm text-muted-foreground mb-3">Track safety deadlines</p>
              <ArrowRight className="w-5 h-5 mx-auto text-amber-500 group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/compliance">
          <Card className="group glass-card hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer h-full" data-testid="link-quick-charts">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 mb-4">
                <ShieldCheck className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2 gradient-text">Safety Charts</h3>
              <p className="text-sm text-muted-foreground mb-3">View protocol diagrams</p>
              <ArrowRight className="w-5 h-5 mx-auto text-blue-500 group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
