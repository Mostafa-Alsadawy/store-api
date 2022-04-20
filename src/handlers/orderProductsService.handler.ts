import express, { NextFunction } from "express";
import { body, validationResult } from "express-validator";
import verifyAuthToken from "../middlewares/verify_auth_token";
import { OrderModel } from "../models/order.model";
import ProductsOrderService from "../services/productsOrderSrevices";

const orderModel = new OrderModel();
const service = new ProductsOrderService();

export const orderProductsServiceRouts = (app: express.Application) => {
  // add product  on specific order.
  app.post(
    "/orders/:id/product",
    verifyAuthToken,
    body("quantity").isNumeric(),
    body("product_id").isNumeric(),
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<express.Response | void> => {
      // validate requset - check errors 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      try {
        let order_id = parseInt(req.params.id);
        const order = await orderModel.show(order_id);

        if (!order) {
          //@ts-ignore: used to avoid making custom type for request.
          const userid: number = req.info.id;
          const order = await orderModel.create({
            isopen: true,
            userid: userid,
          });
          order_id = order.id as number;
        }
        const quantity = req.body.quantity;
        const product_id = req.body.product_id;
        const result = await service.addProduct({
          order_id,
          quantity,
          product_id,
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

// get all products on specific order
  app.get(
    "/orders/:id/products",
    verifyAuthToken,
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const id = parseInt(req.params.id);
        const result = await service.getProductsByOrder(id);
        res.json({
          status: "success",
          message: "done all products for one order.",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // delete product form order

  app.delete(
    "/orders/:orderid/products/:productid",
    verifyAuthToken,
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const order_id = parseInt(req.params.orderid);
        const product_id = parseInt(req.params.productid);
        const result = await service.removeProductFromOrder(
          order_id,
          product_id
        );
        res.json({
          status: "success",
          message: "done delete one product for one order.",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  //get top 5 products
  app.get(
    "/products/popluar",
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const result = await service.getTopFiveProducts();
        res.json({
          status: "success",
          message: "done get top 5 products",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );
};
