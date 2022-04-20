import supertest from "supertest";
import client from "../../database";
import { Order } from "../../models/order.model";
import { Product } from "../../models/product.model";
import { User } from "../../models/user.model";
import { app } from "../../server";

const req = supertest(app);

describe("test funcionality of orders handlers", () => {
  const order: Order = {
    isopen: true,
    userid: 0, //temp value
  };
  const product: Product = {
    name: "c++ 17 book",
    price: 51000,
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
    const orderFromDB = await (
      await req
        .post("/orders/add-order")
        .send(order)
        .set("Authorization", `Bearer ${token}`)
    ).body.data;
    order.id = orderFromDB.id;
    const productFromDB = await (
      await req
        .post("/products/add-product")
        .send(product)
        .set("Authorization", `Bearer ${token}`)
    ).body.data;
    product.id = productFromDB.id;

  });

  it("crate new product on order", async () => {
    const result = await req
      .post(`/orders/${order.id}/product`)
      .send({
        quantity: 1,
        product_id: product.id,
      })
      .set("Authorization", `Bearer ${token}`);
    const createdProduct = result.body.data;
    expect(createdProduct.order_id).toBe(order.id);
    expect(createdProduct.quantity).toBe(1);
    expect(createdProduct.product_id).toBe(product.id);
  });

  it("get all products on order -authenticated- ", async () => {
    {
      const result = await (
        await req
          .get(`/orders/${order.id}/products`)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(result.data.length).toBe(1);
    }
  });

  it("it give error not authenticate for unprovied token request", async () => {
    {
      const result = await req.get(`/orders/${order.id}/products`);
      expect(result.status).toBe(401);
    }
  });

  it("delete order products by id ", async () => {
    const result = await (
      await req
        .delete(`/orders/${order.id}/products/${product.id}`)
        .set("Authorization", `Bearer ${token}`)
    ).body;
    expect(result.data.id).toBe(order.id);
  });

  afterAll(async () => {
    const connection = await client.connect();
    const sql =
      "DELETE FROM orders;ALTER SEQUENCE orders_id_seq RESTART WITH 1;DELETE FROM users;ALTER SEQUENCE users_id_seq RESTART WITH 1;DELETE FROM products;ALTER SEQUENCE products_id_seq RESTART WITH 1;TRUNCATE order_products RESTART IDENTITY;";
          connection.query(sql);
    connection.release();
  });
});
