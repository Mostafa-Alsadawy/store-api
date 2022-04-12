import express, { NextFunction } from "express";
import { OrderModel } from "../models/order.model";
import { body, validationResult } from "express-validator";
import verifyAuthToken from "../middlewares/verify_auth_token";

const orderModel = new OrderModel();

export const ordersRouts = (app: express.Application) => {
  // Route to list all Orders
  app.get(
    "/orders",
    verifyAuthToken,
    async (
      _req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const result = await orderModel.index();
        res.json({
          status: "success",
          message: "done list all orderes ",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // Route to get one order
  app.get(
    "/orders/:id",
    verifyAuthToken,
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const id = parseInt(req.params.id);
        const result = await orderModel.show(id);
        res.json({
          status: "success",
          message: "done list one ordere with id " + id,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // Route to create new order
  app.post(
    "/orders/create",
    verifyAuthToken,
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const result = await orderModel.create(req.body);
        res.json({
          status: "success",
          message: "done create one ordere with id " + req.body.id,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // Route to update order

  app.put(
    "/orders/update",
    verifyAuthToken,
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const result = await orderModel.update(req.body);
        res.json({
          status: "success",
          message: "done update one ordere with id " + req.body.id,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // Route to delete existing order
  app.delete(
    "/orders/:id",
    verifyAuthToken,
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const id = parseInt(req.params.id);
        const result = await orderModel.delete(id);
        res.json({
          status: "success",
          message: "done delete one ordere with id " + id,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  app.post(
    "/orders/:id/product",
    verifyAuthToken,
    body("quantity").isNumeric(),
    body("productId").isNumeric(),
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
        const orderId = parseInt(req.params.id);
        const quantity = req.body.quantity;
        const productId = req.body.product_id;
        const result = await orderModel.addProduct({
          orderId,
          quantity,
          productId,
        });
        res.json({
          status: "success",
          message: "done add product to order",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );
};
