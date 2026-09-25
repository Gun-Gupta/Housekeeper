const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const workerRoutes = require("./Routes/WorkerRoutes");
const adminRoutes = require("./Routes/AdminRoutes");
const clientRoutes = require("./Routes/ClientRoutes");
const leadRoutes = require("./Routes/LeadRoutes");
const otpRoutes = require("./Routes/otpRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("HouseKeeper API is running");
});

app.use("/api/workers", workerRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/payment", paymentRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});