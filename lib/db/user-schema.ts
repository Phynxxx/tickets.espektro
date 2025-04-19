import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

// Base profile information for all users
export const userProfile = sqliteTable("user_profile", {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  phoneNumber: text('phone_number').notNull(),
  individualType: text('individual_type', { enum: ["Student", "Alumni", "Visitor"] }).notNull(), // "Student", "Alumni", or "Visitor"
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// Student specific information
export const studentProfile = sqliteTable("student_profile", {
  id: text('id').primaryKey(),
  userProfileId: text('user_profile_id').notNull().references(() => userProfile.id, { onDelete: 'cascade' }),
  department: text('department').notNull(),
  course: text('course').notNull(),
  graduationYear: text('graduation_year').notNull(),
  rollNumber: text('roll_number').notNull(),
  idCardPhotoUrl: text('id_card_photo_url')
});

// Alumni specific information
export const alumniProfile = sqliteTable("alumni_profile", {
  id: text('id').primaryKey(),
  userProfileId: text('user_profile_id').notNull().references(() => userProfile.id, { onDelete: 'cascade' }),
  department: text('department').notNull(),
  course: text('course').notNull(),
  graduationYear: text('graduation_year').notNull()
});

// Visitor specific information
export const visitorProfile = sqliteTable("visitor_profile", {
  id: text('id').primaryKey(),
  userProfileId: text('user_profile_id').notNull().references(() => userProfile.id, { onDelete: 'cascade' }),
  address: text('address').notNull(),
  district: text('district').notNull(),
  city: text('city').notNull(),
  pinCode: text('pin_code').notNull()
});
