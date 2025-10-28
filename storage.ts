import { 
  type Experiment, 
  type InsertExperiment,
  type LabNote,
  type InsertLabNote,
  type ComplianceTask,
  type InsertComplianceTask,
  type SafetyReport,
  type InsertSafetyReport
} from "@shared/schema";

export interface IStorage {
  // Experiments
  getExperiments(): Promise<Experiment[]>;
  getExperiment(id: number): Promise<Experiment | undefined>;
  createExperiment(experiment: Omit<Experiment, 'id' | 'createdAt'>): Promise<Experiment>;
  
  // Lab Notes
  getLabNotes(): Promise<LabNote[]>;
  getLabNote(id: number): Promise<LabNote | undefined>;
  createLabNote(note: InsertLabNote): Promise<LabNote>;
  
  // Compliance Tasks
  getComplianceTasks(): Promise<ComplianceTask[]>;
  getComplianceTask(id: number): Promise<ComplianceTask | undefined>;
  createComplianceTask(task: InsertComplianceTask): Promise<ComplianceTask>;
  updateComplianceTask(id: number, task: Partial<ComplianceTask>): Promise<ComplianceTask | undefined>;
  
  // Safety Reports
  getSafetyReports(): Promise<SafetyReport[]>;
  getSafetyReport(id: number): Promise<SafetyReport | undefined>;
  createSafetyReport(report: InsertSafetyReport): Promise<SafetyReport>;
}

export class MemStorage implements IStorage {
  private experiments: Map<number, Experiment>;
  private labNotes: Map<number, LabNote>;
  private complianceTasks: Map<number, ComplianceTask>;
  private safetyReports: Map<number, SafetyReport>;
  private nextExperimentId: number;
  private nextLabNoteId: number;
  private nextTaskId: number;
  private nextReportId: number;

  constructor() {
    this.experiments = new Map();
    this.labNotes = new Map();
    this.complianceTasks = new Map();
    this.safetyReports = new Map();
    this.nextExperimentId = 1;
    this.nextLabNoteId = 1;
    this.nextTaskId = 1;
    this.nextReportId = 1;
  }

  // Experiments
  async getExperiments(): Promise<Experiment[]> {
    return Array.from(this.experiments.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getExperiment(id: number): Promise<Experiment | undefined> {
    return this.experiments.get(id);
  }

  async createExperiment(experiment: Omit<Experiment, 'id' | 'createdAt'>): Promise<Experiment> {
    const id = this.nextExperimentId++;
    const newExperiment: Experiment = {
      ...experiment,
      id,
      createdAt: new Date(),
    };
    this.experiments.set(id, newExperiment);
    return newExperiment;
  }

  // Lab Notes
  async getLabNotes(): Promise<LabNote[]> {
    return Array.from(this.labNotes.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getLabNote(id: number): Promise<LabNote | undefined> {
    return this.labNotes.get(id);
  }

  async createLabNote(note: InsertLabNote): Promise<LabNote> {
    const id = this.nextLabNoteId++;
    const newNote: LabNote = {
      ...note,
      id,
      createdAt: new Date(),
    };
    this.labNotes.set(id, newNote);
    return newNote;
  }

  // Compliance Tasks
  async getComplianceTasks(): Promise<ComplianceTask[]> {
    return Array.from(this.complianceTasks.values()).sort((a, b) => 
      new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );
  }

  async getComplianceTask(id: number): Promise<ComplianceTask | undefined> {
    return this.complianceTasks.get(id);
  }

  async createComplianceTask(task: InsertComplianceTask): Promise<ComplianceTask> {
    const id = this.nextTaskId++;
    const newTask: ComplianceTask = {
      ...task,
      id,
      createdAt: new Date(),
    };
    this.complianceTasks.set(id, newTask);
    return newTask;
  }

  async updateComplianceTask(id: number, updates: Partial<ComplianceTask>): Promise<ComplianceTask | undefined> {
    const task = this.complianceTasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.complianceTasks.set(id, updatedTask);
    return updatedTask;
  }

  // Safety Reports
  async getSafetyReports(): Promise<SafetyReport[]> {
    return Array.from(this.safetyReports.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getSafetyReport(id: number): Promise<SafetyReport | undefined> {
    return this.safetyReports.get(id);
  }

  async createSafetyReport(report: InsertSafetyReport): Promise<SafetyReport> {
    const id = this.nextReportId++;
    const newReport: SafetyReport = {
      ...report,
      id,
      createdAt: new Date(),
    };
    this.safetyReports.set(id, newReport);
    return newReport;
  }
}

export const storage = new MemStorage();
