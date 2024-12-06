import { z } from "zod";

const createShop = z.object({
  name: z.string({
    required_error: "Name is required!",
  }),
  description: z.string({
    required_error: "Description is required!",
  }),
});
const updateShop = z.object({
  name: z
    .string({
      required_error: "Name is required!",
    })
    .optional(),
  description: z
    .string({
      required_error: "Description is required!",
    })
    .optional(),
  logo: z
    .string({
      required_error: "Description is required!",
    })
    .optional(),
});

export const shopValidation = {
  createShop,
  updateShop,
};
