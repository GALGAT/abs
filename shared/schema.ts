import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  jobTitles: jsonb("job_titles").$type<string[]>().notNull(),
  location: text("location").notNull(),
  locationType: text("location_type").notNull(), // remote, onsite, hybrid, city
  minSalary: integer("min_salary"),
  maxSalary: integer("max_salary"),
  experienceYears: text("experience_years").notNull(),
  skills: text("skills").notNull(),
  workHistory: text("work_history").notNull(),
  resumeUrl: text("resume_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  locationType: text("location_type").notNull(),
  minSalary: integer("min_salary"),
  maxSalary: integer("max_salary"),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  skills: jsonb("skills").$type<string[]>().notNull(),
  keywords: jsonb("keywords").$type<string[]>().notNull(),
  isRemote: boolean("is_remote").default(false),
  postedAt: timestamp("posted_at").defaultNow(),
  externalUrl: text("external_url"),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  jobId: varchar("job_id").notNull().references(() => jobs.id),
  status: text("status").notNull().default("applied"), // applied, under_review, interview, rejected, hired
  matchScore: integer("match_score").notNull(),
  tailoredResume: text("tailored_resume"),
  coverLetter: text("cover_letter"),
  appliedAt: timestamp("applied_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  postedAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedAt: true,
  updatedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
