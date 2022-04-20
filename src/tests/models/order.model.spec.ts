import { OrderModel,Order } from "../../models/order.model";
import client from "../../database";
import { User, UserModel } from "../../models/user.model";

const orderModel = new OrderModel();
const userModel = new UserModel();

describe("make sure that all orders CRUD function are defined",()=>{
  it("create new order is defined",():void=>{
    expect(orderModel.create).toBeDefined();
  });

  it("get all orders is defined",():void=>{
    expect(orderModel.index).toBeDefined();
  });

  it("get one order is defined",():void=>{
    expect(orderModel.show).toBeDefined();
  });

  it("update order is defined",():void=>{
    expect(orderModel.compelet).toBeDefined();
  });

  it("delete order is defined",():void=>{
    expect(orderModel.delete).toBeDefined();
  });

  

});

describe("Test functionality of all CRUD opreation for orde Model",()=>{
  const order:Order = {
    isopen:true,
    userid:1,
  }
  const user:User = {
    firstname:"testUser",
    lastname:"userLastName",
    passwd:"000000"
  }

  beforeAll(async()=>{
    await userModel.create(user);
  })
  it("create new order",async():Promise<void>=>{
    const orderCountBefore = (await orderModel.index()).length
    const newOrder = await orderModel.create(order);
    const orderCountAfter = (await orderModel.index()).length
    order.id = newOrder.id;
    expect(newOrder.isopen).toEqual(order.isopen);
    expect(newOrder.userid).toEqual(order.userid);
    expect(orderCountAfter).toEqual(orderCountBefore +1);
  });    

  it("get all orders",async():Promise<void>=>{
    const orders = await orderModel.index();
    expect(orders.length).toBe(1);
  });

  it("get order by id ",async():Promise<void>=>{
    const resOrder = await orderModel.show(order.id!);
    expect(resOrder.isopen).toEqual(order.isopen);
    expect(resOrder.userid).toEqual(order.userid);
 
  });

  it("compelet an order ",async():Promise<void>=>{
    let update:Order = {
      isopen:false,
      userid:order.userid,
    }
    const oldOrder = await orderModel.show(order.id!);
    update.id = oldOrder.id;
    const updatedOrder = await orderModel.compelet(update.id as number,update.isopen);
    expect(updatedOrder.isopen).toEqual(update.isopen);
  });


  it("delete order by  id ",async():Promise<void>=>{
    const ordersCountBefore = (await orderModel.index()).length;
    const deletedOrder = await orderModel.delete(order.id!);
    const ordersCountAfter = (await orderModel.index()).length;
    expect(ordersCountAfter).toBe(ordersCountBefore - 1);
    expect(deletedOrder.id).toBe(order.id)
  });



 afterAll(async():Promise<void>=>{
   const connection = await client.connect();
   const sql = "DELETE FROM orders;ALTER SEQUENCE orders_id_seq RESTART WITH 1;DELETE FROM users;ALTER SEQUENCE users_id_seq RESTART WITH 1;";
   connection.query(sql);
   connection.release();
 })
})