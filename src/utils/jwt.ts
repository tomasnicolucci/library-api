import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

export const generateToken = (userId: number, role: "USER" | "ADMIN"): string => {
  return jwt.sign(
    {
      sub: userId,
      role
    },
    jwtSecret,
    {
      expiresIn: "15m"
    }
  );
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, jwtSecret) as JwtPayload;
};