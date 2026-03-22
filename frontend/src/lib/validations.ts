import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(1, "Street is required").max(200),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().max(100).optional().or(z.literal("")),
  zip_code: z.string().max(20).optional().or(z.literal("")),
  country: z.string().min(1, "Country is required").max(100),
});

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  age: z
    .number({ invalid_type_error: "Age must be a number" })
    .int("Age must be a whole number")
    .min(0, "Age must be 0 or more")
    .max(150, "Age must be 150 or less"),
  sex: z.enum(["male", "female", "other"], {
    message: "Please select a sex",
  }),
  addresses: z.array(addressSchema),
});

export type UserFormValues = z.infer<typeof userSchema>;
