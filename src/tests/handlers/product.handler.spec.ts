import supertest from "supertest";
import { app } from "../../server";
import { Product } from "../../models/product.model";
import { User } from "../../models/user.model";
import client from "../../database";

const req = supertest(app);

describe("test funcionality of product handlers", () => {
  const product: Product = {
    name: "bag",
    cat: "personal",
    price: 5000,
  };
  let token = "";
  beforeAll(async () => {
    const user: User = {
      firstname: "test",
      lastname: "name",
      passwd: "123456",
    };
    const result = await (await req.post("/users/add-user").send(user)).body;
    token = result.data.token;
  });

  it("crate new product", async () => {
    const result = await req
      .post("/products/add-product")
      .send(product)
      .set("Authorization", `Bearer ${token}`);
    const createdProduct = result.body.data;
    product.id = createdProduct.id;
    expect(createdProduct.name).toBe(product.name);
    expect(createdProduct.price).toBe(product.price);
  });

  it("get all product", async () => {
    {
      const result = await (
        await req.get("/products").set("Authorization", `Bearer ${token}`)
      ).body;
      expect(result.data.length).toBe(1);
    }
  });

  it("it give error not authenticate for unprovied token request", async () => {
    {
      const result = await req.delete("/products/" + product.id);
      expect(result.status).toBe(401);
    }
  });

  it("it get specific product if authenticated", async () => {
    {
      const result = await (
        await req
          .get("/products/" + product.id)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(result.data.id).toBe(product.id);
    }
  });

  it("update product info", async () => {
    const updateInfo: Product = {
      id: product.id,
      name: "updated Bag",
      cat: "fashion",
      price: 10000,
    };
    const result = await req
      .put("/products/update")
      .send(updateInfo)
      .set("Authorization", `Bearer ${token}`);
    const updatedProduct = result.body.data;
    expect(updatedProduct.name).toBe(updateInfo.name);
    expect(updatedProduct.price).toBe(updateInfo.price);
  });

  it("get products by catagory", async () => {
    const result = await (
      await req
        .get("/products/cat/fashion")
        .set("Authorization", `Bearer ${token}`)
    ).body;
    expect(result.data.length).toBe(1);
  });

  it("delete product by id ", async () => {
    const result = await (
      await req
        .delete("/products/" + product.id)
        .set("Authorization", `Bearer ${token}`)
    ).body;
    expect(result.data.id).toBe(product.id);
  });

  afterAll(async () => {
    const connection = await client.connect();
    const sql =
      "DELETE FROM users;ALTER SEQUENCE users_id_seq RESTART WITH 1;DELETE FROM products;ALTER SEQUENCE products_id_seq RESTART WITH 1;";
    connection.query(sql);
    connection.release();
  });
});
