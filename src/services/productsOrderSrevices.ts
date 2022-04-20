import client from "../database";
import { Product } from "../models/product.model";

export type OrderProduct = {
  id?: number;
  quantity: number;
  order_id: number;
  product_id: number;
};

class ProductsOrderService {
  // add new product to order
  async addProduct(OrderProduct: OrderProduct): Promise<OrderProduct> {
    try {
      const connection = await client.connect();
      const sql =
        "INSERT INTO order_products (quantity,order_id,product_id) VALUES ($1,$2,$3) RETURNING*;";
      const result = await connection.query(sql, [
        OrderProduct.quantity,
        OrderProduct.order_id,
        OrderProduct.product_id,
      ]);
      return result.rows[0];
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  //get all products on order
  async getProductsByOrder(orderId: number): Promise<
    {
      name: string;
      price: number;
      quantity: number;
    }[]
  > {
    try {
      const sql =
        "SELECT name,price,quantity,order_id FROM products INNER JOIN order_products ON products.id=order_products.product_id WHERE order_id=$1;";
      const connection = await client.connect();
      const result = await connection.query(sql, [orderId]);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  // remove product form order
  async removeProductFromOrder(
    orderId: number,
    productId: number
  ): Promise<OrderProduct> {
    try {
      const sql =
        "DELETE FROM order_products WHERE order_id=$1 AND product_id=$2 RETURNING *;";
      const connection = await client.connect();
      const result = await connection.query(sql, [orderId,productId]);
      connection.release();
      if (result.rowCount <= 0) {
        throw new Error("there is no product with this id in order exist with this id.");
      }
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  // get top 5 products
  async getTopFiveProducts():Promise<Product[]>{
    try{
      const sql = "SELECT id,name FROM products INNER JOIN order_products ON products.id = order_products.product_id ORDER BY quantity DESC LIMIT 5;";
      const connection = await client.connect();
      const result = await connection.query(sql);
      return result.rows;
    }catch(err){
      throw new Error((err as Error).message);
    }
  }

  
}

export default ProductsOrderService;
