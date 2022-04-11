import client from "../database";

type Order = {
  id?: number;
  stat: string;
  userId: number;
};

class OrderModel {
  // get all orders

  async index(): Promise<Order[]> {
    try {
      const connection = await client.connect();
      const sql = "SELECT * from orders;";
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  // get one order by id
  async show(id: number): Promise<Order> {
    try {
      const connection = await client.connect();
      const sql = "SELECT * FROM orders WHERE id = $1;";
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  // delete order by id
  async delete(id: number): Promise<Order> {
    try {
      const connection = await client.connect();
      // check if item  exists
      const inDB = await connection.query(
        "SELECT id FROM orders WHERE id = $1",
        [id]
      );
      if (inDB.rowCount <= 0) {
        throw new Error("this is item does not exist");
      }
      const sql = "DELETE FROM orders WHERE id = $1 RETUENING *;";
      const result = await connection.query(sql,[id]);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  // add new product to order 
  async addProduct()
}
