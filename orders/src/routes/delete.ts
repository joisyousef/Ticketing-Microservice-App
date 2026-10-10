import express, { type Request, type Response } from "express";

const router = express.Router();

router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
  res.send("Order deleted");
});

export { router as deleteOrderRouter };
