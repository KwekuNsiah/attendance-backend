import { Request, Response, NextFunction } from "express";
import colors from "colors";
import chalk, { ChalkInstance } from "chalk";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const methodColors: Record<HttpMethod, keyof ChalkInstance> = {
    GET: "green",
    POST: "blue",
    PUT: "yellow",
    DELETE: "red",
    PATCH: "magenta",
    HEAD: "gray",
  };

  const method: HttpMethod = req.method as HttpMethod;
  console.log("i am method ", method);

  const color: keyof typeof chalk = methodColors?.[method] || "white";

  const changedColor = chalk[color] as (test: string) => string;

  const timestamp = new Date().toISOString();
  const url = `${req.method} ${req.protocol}://${req.get("host")}${
    req.originalUrl
  }`;

  console.log(
    // `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`.red(
    `${changedColor(url)}`
  );
  next();
};

export default logger;
