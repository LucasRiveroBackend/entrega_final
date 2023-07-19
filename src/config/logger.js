import winston from "winston";
import { __dirname } from "./pathName.js";
import path from "path";

import { config } from "./config.js";


const currentEnv = config.ambiente || "development";

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },

  colors: {
    fatal: "cyan",
    error: "red",
    warn: "yellow",
    info: "blue",
    http: "green",
    debug: "purple",
  },
};

const devLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({
          colors: customLevels.colors,
        }),
        winston.format.simple()
      ),
    }),
  ],
});

const prodLogger = winston.createLogger({
   levels: customLevels.levels,
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({ filename: path.join(__dirname, "./errors.log"), level: "error" }),
  ],
});

export const addLogger = (req, res, next) => {
  if (currentEnv === "development") {
    req.logger = devLogger;
  } else {
    req.logger = prodLogger;
  }
  req.logger.http(`${req.method} en ${req.url}}`);
  next();
};

export const infoLogger = winston.createLogger ({
   transports: [
     new winston.transports.Console({ level: "info" }),
   ],
 });