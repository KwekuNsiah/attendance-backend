import { Request, Response } from "express";
import { allEmployeesModel } from "../models/employeeModels";
import jwt from "jsonwebtoken";
import app from "../app";
import pool from "../db/mysql";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { buffer } from "stream/consumers";
dotenv.config();

export interface Employees {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: number;
  department_id?: string;
  photo?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export const showAllEmployees = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const results = await allEmployeesModel(req);
    res.status(200).json({
      // status: true,
      // count: results.data.length,
      // search: results.search,
      results: results.data,
    });
    return;
  } catch (err: any) {
    console.log("Error fetching employee data:", err);
    res
      .status(500)
      .json({ status: false, message: `Error getting data: ${err.message}` });
    return;
  }
};

export const getEmp = app.get("/", async (req, res) => {
  const employees = await showAllEmployees(req, res);
  res.status(200).json(employees);
});

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, department_id } =
      req.body as Employees;

    console.log(req.body);

    if (!name || !email || !password || !phone || !department_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await pool.execute(
      `INSERT INTO employees(name, email, phone, password, department_id) VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, password, department_id]
    );

    const newEmployeeId = (result as any).newEmployeeId;

    res.status(201).json({
      message: "Employee created successfully ",
      employeeId: newEmployeeId,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// export const loginEmployee = async (req: Request, res: Response) => {
//   const { name, password } = req.body;
//   try {
//     const [rows]: QueryResult = await pool.execute(
//       `SELECT id, name, phone, password, email FROM employees WHERE name = ? AND password = ?`,
//       [name, password]
//     );

//     // console.log("the rows: ", rows);
//     const employeeRecord = rows[0];
//     // console.log(employeeRecord);

//     const employeeRec = {
//       id: employeeRecord.id,
//       name: employeeRecord.name,
//       phone: employeeRecord.phone,
//       password: employeeRecord.password,
//       email: employeeRecord.email,
//     };

//     if (Array.isArray(rows) && rows.length > 0) {
//       res.status(200).json({
//         message: "Login successful",
//         employeeRec,
//       });
//     } else {
//       res.status(401).json({ message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.log("Database query error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
//   // console.log("its from the front end : ", name, password);
// };

export const loginEmployee = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("email and passsword :>> ", email, password);

  try {
    const [rows]: QueryResult = await pool.execute(
      `SELECT id, name, phone, password, email FROM employees WHERE email = ? AND password = ? `,
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user: Employees = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("the rows: ", rows);
    const employeeRecord: Employees = rows[0];
    console.log(employeeRecord);
    const employeeRec = {
      id: employeeRecord.id,
      name: employeeRecord.name,
      phone: employeeRecord.phone,
      password: employeeRecord.password,
      email: employeeRecord.email,
    };

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT Secret environment variable is not set");
    }

    const token = jwt.sign(
      { userId: employeeRec.id, userName: employeeRec.email },
      secret,
      {
        expiresIn: "1hr",
      }
    );

    if (Array.isArray(rows) && rows.length > 0) {
      res.status(200).json({ message: "Login successful", token, employeeRec });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Database query error ", error);
    res.status(500).json({ message: "Server Error" });
  }

  console.log("its from the frontend ", email, password);
};

export const getEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("the emp id", id);

  try {
    const [rows] = await pool.execute(
      `SELECT id FROM employees WHERE email = ? OR phone = ?`,
      [id]
    );
    console.log("empId orr : ", id);
    const user = (rows as any[])[0];
    if (user) {
      res.status(200).json({ userId: user.id });
      console.log("the user id is ", user.id);
    }
  } catch (error) {
    console.log("Error fetching ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
