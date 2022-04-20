import { UserModel } from "../models/user.model";
import express, { NextFunction } from "express";
import {check, body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import verifyAuthToken from "../middlewares/verify_auth_token";

const userModel = new UserModel();

export const usersRoutes = (app: express.Application): void => {
  // get all users 
  app.get(
    "/users",
    verifyAuthToken,
    async (
      _req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const result = await userModel.index();
        res.json({
          status: "success",
          message: "get all users done",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // get specific user using its id.
  app.get(
    "/users/:id",
    verifyAuthToken,
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const id = req.params.id as unknown as number;
        const result = await userModel.getUser(id);
        if (!result) {
          throw new Error("this item does not exist.");
        }
        res.json({
          status: "success",
          message: "done getting user with id "+id,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // create new user
  app.post(
    "/users/add-user",
    check("firstname")
    .isLength({ min: 3 }),
    check("lastname").isLength({ min: 3 }),
    check("passwd").isLength({ min: 5 }),
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<express.Response | void> => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      try {
        const result = await userModel.create(req.body);
        if (result) {
          const token = jwt.sign(result, process.env.TOKEN_SECRET as string);
          res.json({
            status: "success",
            massage: "created user with token",
            data: { ...result, token },
          });
        }
      } catch (error) {
        next(error);
      }
    }
  );

  // delete existing user 
  app.delete(
    "/users/:id",
    verifyAuthToken,
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const id = req.params.id as unknown as number;
        const result = await userModel.deleteUser(id);
        res.json({
          status: "success",
          message:"done delete user with id " + id,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );


// update user information 
  app.put(
    "/users/:id",
    verifyAuthToken,
    body("firstname").isLength({ min: 3 }),
    body("lastname").isLength({ min: 3 }),
    body("passwd").isLength({ min: 5 }),
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<express.Response | void> => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "faild",
          message: "bad request " + errors.toString(),
        });
      }
      try {
        const id = req.params.id;
        req.body.id = id;
        const result = await userModel.updateUser(req.body);
        res.json({
          status: "success",
          message: "done update user with id",
          data: result
        });
      } catch (error) {
        next(error);
      }
    }
  );

  //authenticate user return token for exists users.
  app.post(
    "/users/authenticate",
    body("id").isNumeric(),
    body("passwd").isString(),
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<express.Response | void> => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      try {
        const id = parseInt( req.body.id);
        const passwd = req.body.passwd as string;
        const result = await userModel.authenticate(id,passwd);
        if (result) {
          const token = jwt.sign(result, process.env.TOKEN_SECRET as string);
          res.json({
            status: "success",
            massage: "done authenticate user with token",
            data: { ...result, token },
          });
        } else {
          res.status(404).json({
            status:"faild",
            message:"bad request thir with no user with this credintials"
          })
        }
      } catch (error) {
        next(error);
      }
    }
  );
};
