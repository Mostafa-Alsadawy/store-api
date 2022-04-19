import client from "../database";
export type Product = {
  id?: number;
  name: string;
  price: number;
};

export class ProductModel {
  //get all products
  async index(): Promise<Product[]> {
    try {
      const connection = await client.connect();
      const sql = "SELECT * FROM products;";
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  //get one product by id

  async getOne(productId: number) {
    try {
      const connection = await client.connect();
      const sql = "SELECT * FROM products WHERE id = $1;";
      const result = await connection.query(sql, [productId]);
      connection.release();
      if(result.rowCount <= 0){throw new Error("this product does not exist.");}
      return result.rows[0];
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  // delete on product by id

  async delete(productId: number): Promise<Product> {
    try {
      const connection = await client.connect();
      const sql = "DELETE FROM products WHERE id=$1 RETURNING *;";
      const result = await connection.query(sql, [productId]);
      connection.release();
      if(result.rowCount <= 0){throw new Error("this product does not exist.");}
      return result.rows[0];
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  // create propduct
  async create(product: Product): Promise<Product> {
    try {
      const connection = await client.connect();
      const sql =
        "INSERT  INTO products (name,price) VALUES ($1,$2) RETURNING *;";
      const result = await connection.query(sql,[product.name,product.price]);
      connection.release();
      return result.rows[0];
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  // update product 
  async update(product:Product):Promise<Product>{
      try{
          const connection = await client.connect();
          //check if the product exists
          const inDB = await connection.query("SELECT * from products WHERE id=$1;",[product.id]);
          if (inDB.rowCount <=0) {throw new Error("this product does not exist");}
        
          const sql = "UPDATE products SET(name,price) = ($1,$2) WHERE id = $3 RETURNING *;";
          const result = await connection.query(sql,[product.name,product.price,product.id]);
          return result.rows[0];
        }

      catch(err){
        throw  new Error((err as Error).message);
      }
  }
}
