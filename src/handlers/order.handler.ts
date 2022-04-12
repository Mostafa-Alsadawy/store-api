import  express, { NextFunction }  from "express";
import {Order, OrderModel} from "../models/order.model"

const  orderModel = new OrderModel();

const ordersRouts = (app:express.Application)=>{

    // Route to list all Orders 
    app.get("/orders",async(_req:express.Request,res:express.Response,next:NextFunction):Promise<void>=>{
        try {
            const result = await orderModel.index();
            res.json({
                status:"success",
                message:"done list all orderes ",
                data:result
            })
        } catch (error) {
            next(error)
        }
    });

    // Route to get one order 
    app.get("/orders/:id",async(req:express.Request,res:express.Response,next:NextFunction):Promise<void>=>{
        try {
            const id = parseInt(req.params.id);
            const result = await orderModel.show(id);
            res.json({
                status:"success",
                message:"done list one ordere with id "+id,
                data:result
            })
        } catch (error) {
            next(error)
        }
    });

    // Route to create new order 
    app.post("/orders/create",async(req:express.Request,res:express.Response,next:NextFunction):Promise<void>=>{
        try {
            const result = await orderModel.create(req.body);
            res.json({
                status:"success",
                message:"done create one ordere with id "+req.body.id,
                data:result
            })
        } catch (error) {
            next(error)
        }
    });

    // Route to update order

    app.put("/orders/update",async(req:express.Request,res:express.Response,next:NextFunction):Promise<void>=>{
        try {
            const result = await orderModel.update(req.body);
            res.json({
                status:"success",
                message:"done update one ordere with id "+req.body.id,
                data:result
            })
        } catch (error) {
            next(error)
        }
    });

    // Route to delete existing order 
    app.delete("/orders/:id",async(req:express.Request,res:express.Response,next:NextFunction):Promise<void>=>{
        try {
            const id = parseInt(req.params.id);
            const result = await orderModel.delete(id);
            res.json({
                status:"success",
                message:"done delete one ordere with id "+id,
                data:result
            })
        } catch (error) {
            next(error)
        }
    });
}