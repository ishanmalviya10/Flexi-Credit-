import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { 
  insertExperimentSchema,
  insertLabNoteSchema,
  insertComplianceTaskSchema,
  insertSafetyReportSchema,
  type Experiment
} from "@shared/schema";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Experiments Routes
  app.get("/api/experiments", async (req, res) => {
    try {
      const experiments = await storage.getExperiments();
      res.json(experiments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experiments" });
    }
  });

  app.post("/api/experiments/predict", async (req, res) => {
    try {
      const data = insertExperimentSchema.parse(req.body);
      
      // Call OpenAI for hazard prediction
      const prompt = `You are a chemical safety expert. Analyze the following chemical compound and experimental conditions, then provide a comprehensive hazard assessment.

Compound: ${data.compoundName}
Concentration: ${data.concentration} mol/L
Temperature: ${data.temperature}°C
${data.conditions ? `Conditions: ${data.conditions}` : ''}

Provide a JSON response with the following structure:
{
  "hazardLevel": "safe" | "caution" | "danger" | "critical",
  "analysis": "A detailed analysis of the chemical hazards including toxicity, flammability, and reactivity concerns (2-3 sentences)",
  "recommendations": "Specific safety recommendations and required PPE (2-3 sentences)"
}

Criteria for hazard levels:
- safe: Low risk, standard lab safety sufficient
- caution: Moderate risk, requires enhanced safety measures
- danger: High risk, requires strict safety protocols and specialized PPE
- critical: Extreme risk, requires maximum safety protocols and emergency preparedness`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a chemical safety expert providing hazard assessments. Always respond with valid JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      
      // Create experiment with AI prediction
      const experiment = await storage.createExperiment({
        compoundName: data.compoundName,
        concentration: data.concentration,
        temperature: data.temperature,
        conditions: data.conditions || null,
        hazardLevel: result.hazardLevel || "caution",
        aiPrediction: result.analysis || "Analysis not available",
        recommendations: result.recommendations || null,
      });

      res.json(experiment);
    } catch (error: any) {
      console.error("Prediction error:", error);
      res.status(500).json({ message: error.message || "Failed to predict hazard" });
    }
  });

  // Lab Notes Routes
  app.get("/api/lab-notes", async (req, res) => {
    try {
      const notes = await storage.getLabNotes();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lab notes" });
    }
  });

  app.post("/api/lab-notes", async (req, res) => {
    try {
      const data = insertLabNoteSchema.parse(req.body);
      const note = await storage.createLabNote(data);
      res.json(note);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create lab note" });
    }
  });

  // Compliance Tasks Routes
  app.get("/api/compliance-tasks", async (req, res) => {
    try {
      const tasks = await storage.getComplianceTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch compliance tasks" });
    }
  });

  app.post("/api/compliance-tasks", async (req, res) => {
    try {
      const data = insertComplianceTaskSchema.parse(req.body);
      const task = await storage.createComplianceTask(data);
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create task" });
    }
  });

  app.patch("/api/compliance-tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.updateComplianceTask(id, req.body);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update task" });
    }
  });

  // Safety Reports Routes
  app.get("/api/safety-reports", async (req, res) => {
    try {
      const reports = await storage.getSafetyReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch safety reports" });
    }
  });

  app.post("/api/safety-reports", async (req, res) => {
    try {
      const data = insertSafetyReportSchema.parse(req.body);
      const report = await storage.createSafetyReport(data);
      res.json(report);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
