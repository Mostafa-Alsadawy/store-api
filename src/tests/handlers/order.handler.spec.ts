import supertest from "supertest";
import { app } from "../../server";
import { Order } from "../../models/order.model";
import { User } from "../../models/user.model";
import client from "../../database";

const req = supertest(app);

describe("test funcionality of orders handlers", () => {
  const order: Order = {
    isopen: true,
    userid: 0,
  };
  let token = "";
  beforeAll(async () => {
    const user: User = {
      firstname: "test",
      lastname: "name",
      passwd: "123456",
    };
    const result = await (await req.post("/users/add-user").send(user)).body;
    order.userid = result.data.id;
    token = result.data.token;
  });

  it("crate new order", async () => {
    const result = await req
      .post("/orders/add-order")
      .send(order)
      .set("Authorization", `Bearer ${token}`);
    const createdOrder = result.body.data;
    order.id = createdOrder.id;
    expect(createdOrder.isopen).toBe(order.isopen);
    expect(createdOrder.userid).toBe(order.userid);
  });

  it("get all orders -authenticated- ", async () => {
    {
      const result = await (
        await req.get("/orders").set("Authorization", `Bearer ${token}`)
      ).body;
      expect(result.data.length).toBe(1);
    }
  });

  it("it give error not authenticate for unprovied token request", async () => {
    {
      const result = await req.delete("/orders/1");
      expect(result.status).toBe(401);
    }
  });

  it("it get specific order if authenticated", async () => {
    {
      const result = await (
        await req
          .get("/orders/" + order.id)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(result.data.id).toBe(order.id);
    }
  });

  it("update order info", async () => {
    const updateInfo: Order = {
      id: order.id,
      isopen: false,
      userid: order.userid,
    };
    const result = await req
      .put(`/orders/${order.id}/complete`)
      .set("Authorization", `Bearer ${token}`);
    const updatedOrder = result.body.data;
    expect(updatedOrder.isopen).toBe(updateInfo.isopen);

  });
  it("delete user by id ", async () => {
    const result = await (
      await req
        .delete("/orders/" + order.id)
        .set("Authorization", `Bearer ${token}`)
    ).body;
    expect(result.data.id).toBe(order.id);
  });

  afterAll(async () => {
    const connection = await client.connect();
    const sql =
      "DELETE FROM users;ALTER SEQUENCE users_id_seq RESTART WITH 1;DELETE FROM orders;ALTER SEQUENCE orders_id_seq RESTART WITH 1;";
    connection.query(sql);
    connection.release();
  });
});
