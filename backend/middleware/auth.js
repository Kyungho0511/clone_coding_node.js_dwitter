import jwt from "jsonwebtoken";
import * as userRepository from "../data/auth.js";
import { config } from "../config.js";

const AUTH_ERROR = { message: "Authentication Error" };

export const isAuth = async (req, res, next) => {
  // Check if the request has an Authorization header containing a JWT token
  const authHeader = req.get("Authorization");
  if (!(authHeader && authHeader.startsWith("Bearer"))) {
    return res.status(401).json(AUTH_ERROR);
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    // JWT verification
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    // Check if the user exists in the database
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }
    // 앞으로의 미들웨어에서 공통적을 접근 필요시, req.customData 로 등록 해줄 수 있다.
    req.userId = user.id;
    next();
  });
};
