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
    }