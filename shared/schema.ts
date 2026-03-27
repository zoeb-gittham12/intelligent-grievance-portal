import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("Student"), // Student, Faculty, HOD, Admin
  department: text("department"),
});

export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), 
  
  predictedDepartment: text("predicted_department"),
  predictedPriority: text("predicted_priority"), 
  confidenceScore: integer("confidence_score"),
  
  status: text("status").notNull().default("Pending"), 
  
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  assignedTo: integer("assigned_to"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertComplaintSchema = createInsertSchema(complaints).omit({ 
  id: true, 
  predictedDepartment: true, 
  predictedPriority: true, 
  confidenceScore: true, 
  status: true, 
  userId: true, 
  createdAt: true, 
  assignedTo: true 
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Complaint = typeof complaints.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type ComplaintUpdate = Partial<Complaint>;

export const ROLES = ["Student", "Faculty", "HOD", "Admin"] as const;
export type UserRole = typeof ROLES[number];
