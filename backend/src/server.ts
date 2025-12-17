import express from "express";
import cors from "cors";
import { env } from "./config/env";
import connectDB from "./config/db";
import orderRoutes from "./routes/order.route";
import { webhookHandleController } from "./controllers/payos.controller";

const app = express();
const { PORT, FRONTEND_URL } = env;

// https://imelda-hypothetical-mayola.ngrok-free.dev/api/orders/confirm-webhook
app.post(
  "/api/orders/confirm-webhook",
  express.raw({ type: "application/json" }),
  webhookHandleController
);

// middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/orders", orderRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server đang chạy trên cổng", PORT);
  });
});

export default app;
