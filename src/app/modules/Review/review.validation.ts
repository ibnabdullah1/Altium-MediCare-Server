import { z } from "zod";

const createReview = z.object({
  rating: z.number({
    required_error: "Rating is required!",
  }),
  productId: z.string({
    required_error: "ProductId is required!",
  }),
  content: z.string({
    required_error: "Content is required!",
  }),
});

export const reviewValidation = {
  createReview,
};
