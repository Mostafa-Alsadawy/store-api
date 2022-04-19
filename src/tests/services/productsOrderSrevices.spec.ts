import { Order, OrderModel } from "../../models/order.model";
import { Product, ProductModel } from "../../models/product.model";
import { User } from "../../models/user.model";
import ProductsOrdersService from "../../services/productsOrderSrevices";
import { UserModel } from "../../models/user.model";
import client from "../../database";

const service = new ProductsOrdersService();
const userModel = new UserModel();
const orderModel = new OrderModel();
const productModel = new ProductModel();

describe("make sure that Service functions are defined", () => {
  it("add product to order is defined", (): void => {
    expect(service.addProduct).toBeDefined();
  });

  it("get all products on order is defined", (): void => {
    expect(service.getProductsByOrder).toBeDefined();
  });
});

describe("test the functionality for order products service", () => {
  describe("Test functionality of all CRUD opreation for orde Model", () => {
    const user: User = {
      firstname: "testUser",
      lastname: "userLastName",
      passwd: "000000",
    };
    const order: Order = {
      isopen: true,
      userid: 0, // temp value
    };

    const product: Product = {
      name: "bag",
      price: 1000,
    };

    beforeAll(async () => {
      const userFromDB = await userModel.create(user);
      order.userid = userFromDB.id as number;
      const orderFromDB = await orderModel.create(order);
      order.id = orderFromDB.id;

      const prodductFromDB = await productModel.create(product);
      product.id = prodductFromDB.id;

    });
    it("add new product for existing order", async (): Promise<void> => {
      const productsCountBefore = (await service.getProductsByOrder(order.id!))
        .length;
      const addedProduct = await service.addProduct({
        order_id: order.id as number,
        product_id: product.id as number,
        quantity: 1,
      });
      const productsCountAfter = (await service.getProductsByOrder(order.id!))
        .length;
      expect(addedProduct.order_id).toEqual(order.id as number);
      expect(addedProduct.product_id).toEqual(product.id as number);
      expect(productsCountAfter).toEqual(productsCountBefore + 1);
    });

    it("get all products on order", async (): Promise<void> => {
      const products = await service.getProductsByOrder(order.id as number);
      expect(products.length).toBe(1);
    });

    it("delete product from order ", async (): Promise<void> => {
      const productsCountBefore = (await service.getProductsByOrder(order.id as number)).length;
      const deletedProduct = await service.removeProductFromOrder(order.id as number, product.id as number);
      const productsCountAfter = (await service.getProductsByOrder(order.id as number)).length;
      expect(productsCountAfter).toBe(productsCountBefore - 1);
    });

    afterAll(async (): Promise<void> => {
      const connection = await client.connect();
      const sql =
        "DELETE FROM orders;ALTER SEQUENCE orders_id_seq RESTART WITH 1;DELETE FROM users;ALTER SEQUENCE users_id_seq RESTART WITH 1;DELETE FROM products;ALTER SEQUENCE products_id_seq RESTART WITH 1;DELETE FROM order_products;ALTER SEQUENCE order_products_id_seq RESTART WITH 1;";
      connection.query(sql);
      connection.release();
    });
  });
});
