import express, { NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// handel auth error function 

const errorThrower = ()=>{
    const err = new Error("authentication failed");
    err.name = "auth";
    throw err;
}


// this code snappit it taken from udacitu classroom lesson 5 chapter 10 with some modifcations
 const verifyAuthToken = (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      const token = authorizationHeader.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
        //@ts-ignore
        req.info = decoded;
        if (decoded) {
          next();
        } else {
          errorThrower();
        }
      } else {
        errorThrower();
      }
    } else {
      errorThrower();
    }
  } catch (error) {
    const err = new Error((error as Error).message);
    err.name = "401";
    throw err;
  }
};

export default verifyAuthToken;