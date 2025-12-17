import express from "express";
import {
  createOrderController,
  getOrderController,
} from "../controllers/order.controller";
import { createPaymentLinkController } from "../controllers/payos.controller";

const router = express.Router();

router.post("/add", createOrderController);
router.get("/:userId", getOrderController);
router.post("/payos", createPaymentLinkController);

export default router;
