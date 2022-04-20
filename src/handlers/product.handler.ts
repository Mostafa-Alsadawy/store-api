import express, { NextFunction } from "express";
import { ProductModel} from "../models/product.model";
import { body, validationResult } from "express-validator";
import verifyAuthToken from "../middlewares/verify_auth_token";

const productModel = new ProductModel();

export const productsRouts = (app: express.Application): void => {
  // get all product route (index)
  app.get(
    "/products",
    async (
      _req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const allProuducts = await productModel.index();
        res.json({
          status: "success",
          message: "done getting all products",
          data: allProuducts,
        });
      } catch (error) {
        next(error);
      }
    }
  );
  // get only one product (show)
  app.get(
    "/products/:id",
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const id = parseInt(req.params.id);
        const result = await productModel.getOne(id);
        res.json({
          status: "success",
          message: "done get product with id " + id,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // delete product (delete)
  app.delete(
    "/products/:id",
    verifyAuthToken,
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const id = parseInt(req.params.id);
        const result = await productModel.delete(id);
        res.json({
          status: "success",
          message: "done delete product with id " + id,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // Create new product
  app.post(
    "/products/add-product",
    verifyAuthToken,
    body("name").isString().isLength({ min: 3 }),
    body("price").isNumeric(),
    body("cat").optional().isString(),
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
        const result = await productModel.create(req.body);
        res.json({
          status: "success",
          message: "done create new product",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  //update existing product
  app.put(
    "/products/update",
    verifyAuthToken,
    body("id").isNumeric(),
    body("name").isString().isLength({ min: 3 }),
    body("price").isNumeric(),
    body("cat").optional().isString(),
    async (
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ): Promise<express.Response | void> => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "faild",
          message: errors.array(),
        });
      }
      try {
        const result = await productModel.update(req.body);
        res.json({
          status: "success",
          message: "done update product with id " + req.body.id,
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // get all products with in same catagory

  app.get("/products/cat/:cat",async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const cat = req.params.cat;
      const result = await productModel.getProductsByCat(cat);
      res.json({
        status: "success",
        message: "done get product with catagory " + cat,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  })

  
};
