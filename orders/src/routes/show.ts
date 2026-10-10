import express, { type Request, type Response } from "express";

const router = express.Router();

router.get("/api/orders/:orderId", async (req: Request, res: Response) => {
  res.send("Show order details");
});

export { router as showOrderRouter };
