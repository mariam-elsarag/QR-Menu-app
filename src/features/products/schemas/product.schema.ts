import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().trim().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  isAvailable: z.boolean(),
  status: z.enum(["draft", "published"]),
});
