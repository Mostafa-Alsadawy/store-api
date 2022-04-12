import { UserModel, User } from "../models/user.model";
import express, { NextFunction } from "express";
import { body, check, validationResult } from "express-validator";

const userModel = new UserModel();

export const usersRoutes = (app: express.Application): void => {
  app.get(
    "/users",
    async (
      _req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const result = await userModel.index();
        res.json({
          status: 200,
          message: "get all users done",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/users/:id",
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
          status: 200,
          message: "done",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  app.post(
    "/users/add-user",
    body("firstName").isLength({ min: 5 }),
    body("lastName").isLength({ min: 5 }),
    body("password").isLength({ min: 5 }),
    async (req: express.Request, res: express.Response, next: NextFunction):Promise<express.Response|void> => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "faild",
          message: "bad request " + errors.toString(),
        });
      }
      try {
        const result = await userModel.create(req.body);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  app.delete(
    "/users/:id",
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const id = req.params.id as unknown as number;
        const result = await userModel.deleteUser(id);
        res.json({
          status: 200,
          message: "done",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  app.put(
    "/users/:id",
    body("firstName").isLength({ min: 5 }),
    body("lastName").isLength({ min: 5 }),
    body("password").isLength({ min: 5 }),
    async (req: express.Request, res: express.Response, next: NextFunction):Promise<express.Response|void> => {
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
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  //authenticate user
};
