import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { HazardBadge } from "@/components/hazard-badge";
import { apiRequest } from "@/lib/queryClient";
import { insertExperimentSchema, type InsertExperiment, type Experiment } from "@shared/schema";
import { FlaskConical, Sparkles, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HazardPredictor() {
  const [prediction, setPrediction] = useState<Experiment | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertExperiment>({
    resolver: zodResolver(insertExperimentSchema),
    defaultValues: {
      compoundName: "",
      concentration: "",
      temperature: "",
      conditions: "",
    },
  });

  const predictMutation = useMutation({
    mutationFn: async (data: InsertExperiment) => {
      const res = await apiRequest("POST", "/api/experiments/predict", data);
      return await res.json() as Experiment;
    },
    onSuccess: (data) => {
      setPrediction(data);
      queryClient.invalidateQueries({ queryKey: ["/api/experiments"] });
      toast({
        title: "Prediction complete",
        description: `Hazard level: ${data.hazardLevel}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Prediction failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertExperiment) => {
    setPrediction(null);
    predictMutation.mutate(data);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-teal-500/20 mb-2">
          <FlaskConical className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="gradient-text">AI Hazard Predictor</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Analyze chemical compounds using advanced AI to predict safety hazards and get real-time recommendations
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Form */}
        <Card className="glass-card border-t-4 border-t-purple-500">
          <CardHeader>
            <CardTitle className="text-xl gradient-text">Chemical Information</CardTitle>
            <p className="text-sm text-muted-foreground">Enter compound details for AI analysis</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="compoundName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compound Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Sodium Hydroxide"
                          className="glass"
                          {...field}
                          data-testid="input-compound-name"
                        />
                      </FormControl>
                      <FormDescription>Chemical or trade name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="concentration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Concentration</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="2.5"
                            className="glass font-mono"
                            {...field}
                            data-testid="input-concentration"
                          />
                        </FormControl>
                        <FormDescription>mol/L</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="25"
                            className="glass font-mono"
                            {...field}
                            data-testid="input-temperature"
                          />
                        </FormControl>
                        <FormDescription>°C</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="conditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experimental Conditions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Under inert atmosphere, with stirring"
                          className="resize-none glass"
                          rows={3}
                          {...field}
                          value={field.value || ""}
                          data-testid="input-conditions"
                        />
                      </FormControl>
                      <FormDescription>Additional details (optional)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full gradient-purple-teal text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
                  size="lg"
                  disabled={predictMutation.isPending}
                  data-testid="button-predict"
                >
                  {predictMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Predict Hazard Level
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="space-y-6">
          {prediction ? (
            <>
              <Card className="glass-card border-t-4 border-t-teal-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl gradient-text flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-teal-500" />
                      Prediction Results
                    </CardTitle>
                    <HazardBadge level={prediction.hazardLevel as any} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Compound</h3>
                    <p className="text-lg font-semibold" data-testid="text-result-compound">{prediction.compoundName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl glass">
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Concentration</h3>
                      <p className="font-mono font-semibold" data-testid="text-result-concentration">{prediction.concentration} mol/L</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Temperature</h3>
                      <p className="font-mono font-semibold" data-testid="text-result-temperature">{prediction.temperature}°C</p>
                    </div>
                  </div>

                  {prediction.conditions && (
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Conditions</h3>
                      <p className="text-sm leading-relaxed" data-testid="text-result-conditions">{prediction.conditions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    AI Safety Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl glass">
                    <h3 className="text-sm font-semibold mb-3 gradient-text">Analysis</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground" data-testid="text-result-prediction">
                      {prediction.aiPrediction}
                    </p>
                  </div>

                  {prediction.recommendations && (
                    <div className="p-4 rounded-xl glass border-l-4 border-l-amber-500">
                      <h3 className="text-sm font-semibold mb-3 gradient-text">Recommendations</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground" data-testid="text-result-recommendations">
                        {prediction.recommendations}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="glass-card h-full min-h-[500px] flex items-center justify-center">
              <CardContent className="text-center py-12 space-y-4">
                <div className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 to-teal-500/10">
                  <Sparkles className="w-16 h-16 text-muted-foreground/30" />
                </div>
                <h3 className="font-semibold text-lg">No Prediction Yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Fill out the form and click "Predict Hazard Level" to generate an AI-powered safety analysis
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
