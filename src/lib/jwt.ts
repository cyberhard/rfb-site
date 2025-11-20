import jwt from "jsonwebtoken";

export const signJWT = (payload: object) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "30d" });

export const verifyJWT = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET!);
