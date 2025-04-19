"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import {
  userProfile,
  studentProfile,
  alumniProfile,
  visitorProfile
} from "@/lib/db/user-schema";
import { authClient } from "../auth-client";

// Define the signup schema with Zod - removed email and password
const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phoneNumber: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    individualType: z.enum(["Student", "Alumni", "Visitor"]),

    // Fields that are conditional based on individualType
    department: z.string().optional(),
    course: z.string().optional(),
    graduationYear: z.string().optional(),
    rollNumber: z.string().optional(),
    hasIdCardPhoto: z.boolean().optional(),

    alumniDepartment: z.string().optional(),
    alumniCourse: z.string().optional(),
    alumniGraduationYear: z.string().optional(),

    address: z.string().optional(),
    district: z.string().optional(),
    city: z.string().optional(),
    pinCode: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.individualType === "Student") {
        return !!data.department && !!data.course && !!data.graduationYear && !!data.rollNumber;
      }
      return true;
    },
    {
      message: "All student fields are required",
      path: ["individualType"],
    }
  )
  .refine(
    (data) => {
      if (data.individualType === "Alumni") {
        return !!data.alumniDepartment && !!data.alumniCourse && !!data.alumniGraduationYear;
      }
      return true;
    },
    {
      message: "All alumni fields are required",
      path: ["individualType"],
    }
  )
  .refine(
    (data) => {
      if (data.individualType === "Visitor") {
        return (
          !!data.address &&
          !!data.district &&
          !!data.city &&
          !!data.pinCode &&
          /^\d{6}$/.test(data.pinCode)
        );
      }
      return true;
    },
    {
      message: "All visitor fields are required",
      path: ["individualType"],
    }
  );

type SignupFormData = z.infer<typeof signupSchema>;

export async function signup(formData: FormData) {
  const { data: session, error } = await authClient.getSession();
  if (error) {
    console.error("Error fetching session:", error);
    return { success: false, message: "Session error: " + error.message };
  }
  try {
    // Extract form data into a plain object
    const rawFormData: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (key === "hasIdCardPhoto") {
        // Convert string "true"/"false" to boolean
        rawFormData[key] = value.toString() === "true";
      } else {
        rawFormData[key] = value.toString();
      }
    });

    // Validate form data against schema
    const validatedData = signupSchema.parse(rawFormData);

    // Generate unique IDs for database entries
    const userProfileId = uuidv4();
    const now = new Date();

    // Begin transaction to ensure data consistency across tables
    await db.transaction(async (tx) => {
      // Create common user profile - no need to create auth user
      await tx.insert(userProfile).values({
        id: userProfileId,
        userId: session.user.id,
        phoneNumber: validatedData.phoneNumber,
        individualType: validatedData.individualType,
        createdAt: now,
        updatedAt: now
      });

      // Process type-specific information
      if (validatedData.individualType === "Student") {
        // Use placeholder image URL instead of actual file upload
        const idCardPhotoUrl = validatedData.hasIdCardPhoto
          ? `https://placehold.co/400x300?text=Student+ID+${validatedData.rollNumber}`
          : null;

        await tx.insert(studentProfile).values({
          id: uuidv4(),
          userProfileId: userProfileId,
          department: validatedData.department!,
          course: validatedData.course!,
          graduationYear: validatedData.graduationYear!,
          rollNumber: validatedData.rollNumber!,
          idCardPhotoUrl: idCardPhotoUrl
        });
      }
      else if (validatedData.individualType === "Alumni") {
        await tx.insert(alumniProfile).values({
          id: uuidv4(),
          userProfileId: userProfileId,
          department: validatedData.alumniDepartment!,
          course: validatedData.alumniCourse!,
          graduationYear: validatedData.alumniGraduationYear!
        });
      }
      else if (validatedData.individualType === "Visitor") {
        await tx.insert(visitorProfile).values({
          id: uuidv4(),
          userProfileId: userProfileId,
          address: validatedData.address!,
          district: validatedData.district!,
          city: validatedData.city!,
          pinCode: validatedData.pinCode!
        });
      }
    });

    revalidatePath("/auth/login");
    return { success: true, message: "Registration completed successfully" };

  } catch (error) {
    console.error("Signup error:", error);

    if (error instanceof z.ZodError) {
      const formattedErrors = error.format();
      return { success: false, message: "Validation failed", errors: formattedErrors };
    }

    return { success: false, message: "Failed to complete registration" };
  }
}