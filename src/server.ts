import express from "express";
import cors from "cors";
import { config } from "./config/config";
import app from "./app";
import employeeRoutes from "../src/routes/employeeRoutes";
import logger from "./middleware/logger";
import { authenticateJWT } from "./middleware/auth.middleware";

const port = config.serverPORT || 3000;

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({ credentials: true }));

//Logger middleware
app.use(logger);
app.use(authenticateJWT);

app.use("/api/employees", employeeRoutes);

//authenticate JWT

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
