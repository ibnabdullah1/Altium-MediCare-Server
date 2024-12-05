import { z } from "zod";

const createProduct = z.object({
  name: z.string({
    required_error: "Name is required!",
  }),
  description: z.string({
    required_error: "Description is required!",
  }),
  price: z
    .number({
      required_error: "Price is required!",
    })
    .positive("Price must be greater than zero"),
  shopId: z.string({
    required_error: "Shop ID is required!",
  }),
  category: z.string({
    required_error: "Category is required!",
  }),
  tags: z.array(z.string()).optional(),
  inventory: z
    .number({
      required_error: "Inventory count is required!",
    })
    .int("Inventory must be an integer"),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  brand: z.string().optional(),
  isFlashSale: z.boolean().optional(),
});

// Exporting validation schema
export const productValidation = {
  createProduct,
};
