import expres, { NextFunction } from "express";
import {ProductModel, Product } from "../models/product.model";

const productModel = new ProductModel();

const productsRouts = (app:expres.Application):void=>{
    // get all product route (index)
    app.get("/products",async(_req:expres.Request,res:expres.Response,next:NextFunction):Promise<void>=>{
        try {
            const allProuducts = await productModel.index();
            res.json({
                status:"success",
                message:"done getting all products",
                data:allProuducts
            })
        } catch (error) {
            next(error)
        }
    });
    // get only one product (show)
    app.get("/products/:id",async(req:expres.Request,res:expres.Response,next:NextFunction):Promise<void>=>{
        try {
            const id = parseInt(req.params.id);
            const result = await productModel.getOne(id);
            res.json({
                status:"success",
                message:"done get product with id "+id,
                data:result
            })
        } catch (error) {
            next(error)
        }
    });

    // delete product (delete)
    app.delete("/products/:id",async(req:expres.Request,res:expres.Response,next:NextFunction):Promise<void>=>{
        try {
            const id = parseInt(req.params.id);
            const result = await productModel.delete(id);
            res.json({
                status:"success",
                message:"done delete product with id "+id,
                data:result
            })
        } catch (error) {
            next(error)
        }
    });

    // Create new product 
    app.post("/products/create",async (req:expres.Request,res:expres.Response,next:NextFunction):Promise<void>=>{
        try {
            const result = productModel.create(req.body);
            res.json({
                status:"success",
                message:"done create new product",
                data:result
            })
        } catch (error) {
            next(error)
        }
    });

    //update existing product 
    app.put("/products/update",async(req:expres.Request,res:expres.Response,next:NextFunction):Promise<void>=>{
        try {
            const result = await productModel.update(req.body);
            res.json({
                status:"success",
                message:"done update product with id "+req.body.id,
                data:result
            })
        } catch (error) {
            next(error)
        }
    });
}