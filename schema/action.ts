"use server";

import { z } from "zod";
import { contactFormSchema } from "./schema";

export async function contactFormAction(prevState: any, formData: FormData) {
  const defaultValues = z
    .record(z.string(), z.string())
    .parse(Object.fromEntries(formData));

  try {
    const data = contactFormSchema.parse(Object.fromEntries(formData));

    // This simulates a slow response like a form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Log form submission details
    console.info("Snapshot Request Details:", {
      timestamp: new Date().toISOString(),
      contractAddress: data.contractAddress,
      amount: data.amount,
    });

    return {
      defaultValues: {
        contractAddress: "",
        amount: "",
      },
      success: true,
      errors: null,
    };
  } catch (error) {
    // Log error if submission fails
    console.error("Form Submission Error:", error);

    if (error instanceof z.ZodError) {
      return {
        defaultValues,
        success: false,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
            key,
            value?.join(", "),
          ])
        ),
      };
    }

    return {
      defaultValues,
      success: false,
      errors: null,
    };
  }
}
