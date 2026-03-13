import express, { Router } from "express";
import {
  createEmployee,
  getEmployee,
  loginEmployee,
  showAllEmployees,
} from "../controllers/employeesController";

const router = express.Router();

router.get("/", showAllEmployees);
router.post("/create", createEmployee);
router.post("/login", loginEmployee);
//Get a Single employee
router.put("/:id", getEmployee);

export default router;
