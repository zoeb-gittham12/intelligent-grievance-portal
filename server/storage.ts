import { db } from "./db";
import { 
  users, complaints, 
  type User, type InsertUser, 
  type Complaint, type InsertComplaint, type ComplaintUpdate 
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Complaints
  getComplaints(filters?: { status?: string, department?: string }): Promise<Complaint[]>;
  getComplaint(id: number): Promise<Complaint | undefined>;
  createComplaint(complaint: InsertComplaint & { 
    userId: number,
    predictedDepartment?: string,
    predictedPriority?: string,
    confidenceScore?: number,
    status?: string
  }): Promise<Complaint>;
  updateComplaintStatus(id: number, status: string): Promise<Complaint>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getComplaints(filters?: { status?: string, department?: string }): Promise<Complaint[]> {
    let query = db.select().from(complaints);
    const results = await query;
    
    // We'll filter in-memory for simplicity given drizzle conditional where clauses can be complex
    return results.filter(c => {
      if (filters?.status && c.status !== filters.status) return false;
      if (filters?.department && c.predictedDepartment !== filters.department) return false;
      return true;
    });
  }

  async getComplaint(id: number): Promise<Complaint | undefined> {
    const [complaint] = await db.select().from(complaints).where(eq(complaints.id, id));
    return complaint;
  }

  async createComplaint(complaint: InsertComplaint & { 
    userId: number,
    predictedDepartment?: string,
    predictedPriority?: string,
    confidenceScore?: number,
    status?: string
  }): Promise<Complaint> {
    const [newComplaint] = await db.insert(complaints).values(complaint).returning();
    return newComplaint;
  }

  async updateComplaintStatus(id: number, status: string): Promise<Complaint> {
    const [updated] = await db.update(complaints)
      .set({ status })
      .where(eq(complaints.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
