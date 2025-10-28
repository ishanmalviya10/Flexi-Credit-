import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Chemical Experiments Table
export const experiments = pgTable("experiments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  compoundName: text("compound_name").notNull(),
  concentration: text("concentration").notNull(),
  temperature: text("temperature").notNull(),
  conditions: text("conditions"),
  hazardLevel: text("hazard_level").notNull(),
  aiPrediction: text("ai_prediction").notNull(),
  recommendations: text("recommendations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertExperimentSchema = createInsertSchema(experiments).omit({
  id: true,
  hazardLevel: true,
  aiPrediction: true,
  recommendations: true,
  createdAt: true,
});

export type InsertExperiment = z.infer<typeof insertExperimentSchema>;
export type Experiment = typeof experiments.$inferSelect;

// Lab Notes Table
export const labNotes = pgTable("lab_notes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLabNoteSchema = createInsertSchema(labNotes).omit({
  id: true,
  createdAt: true,
});

export type InsertLabNote = z.infer<typeof insertLabNoteSchema>;
export type LabNote = typeof labNotes.$inferSelect;

// Compliance Tasks Table
export const complianceTasks = pgTable("compliance_tasks", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  deadline: text("deadline").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertComplianceTaskSchema = createInsertSchema(complianceTasks).omit({
  id: true,
  createdAt: true,
});

export type InsertComplianceTask = z.infer<typeof insertComplianceTaskSchema>;
export type ComplianceTask = typeof complianceTasks.$inferSelect;

// Safety Reports Table
export const safetyReports = pgTable("safety_reports", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  incidentDate: text("incident_date").notNull(),
  severity: text("severity").notNull().default("low"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSafetyReportSchema = createInsertSchema(safetyReports).omit({
  id: true,
  createdAt: true,
});

export type InsertSafetyReport = z.infer<typeof insertSafetyReportSchema>;
export type SafetyReport = typeof safetyReports.$inferSelect;
