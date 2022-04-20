import client from "../database";

// declare order type to make development easier.
export type Order = {
  id?: number;
  isopen: boolean;
  userid: number;
};


export class OrderModel {
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
      const sql = "DELETE FROM orders WHERE id = $1 RETURNING *;";
      const result = await connection.query(sql, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  // create new order
  async create(order: Order): Promise<Order> {
    try {
      const connenction = await client.connect();
      const sql =
        "INSERT INTO orders (isopen,userid) VALUES($1,$2) RETURNING *;";

      const result = await connenction.query(sql, [order.isopen, order.userid]);
      connenction.release();
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
  // update an existing order (open or closed)

  async compelet(orderid:number,orderStat:boolean): Promise<Order> {
    try {
      const connenction = await client.connect();

      // check if the product exists
      const inDB = await connenction.query(
        "SELECT id from orders WHERE id = $1;",
        [orderid]);
        if(inDB.rowCount <= 0){throw new Error("this order does not exist.")}
      const sql =
        "UPDATE  orders SET isopen = $1 WHERE id = $2 RETURNING *;";
      const result = await connenction.query(sql, [orderStat,orderid]);
      connenction.release();
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

}