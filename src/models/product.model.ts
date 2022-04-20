import client from "../database";
export type Product = {
  id?: number;
  name: string;
  cat?: string;
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
      if (result.rowCount <= 0) {
        throw new Error("this product does not exist.");
      }
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
      if (result.rowCount <= 0) {
        throw new Error("this product does not exist.");
      }
      return result.rows[0];
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  // create propduct
  async create(product: Product): Promise<Product> {
    try {
      const isCatProvided = product.cat != undefined;
      const connection = await client.connect();
      const sql =
        "INSERT  INTO products (name,price" +
        (isCatProvided ? ",cat" : "") +
        ") VALUES ($1,$2" +
        (isCatProvided ? ",$3" : "") +
        ") RETURNING *;";
      const queryArr = [product.name, product.price];
      if (isCatProvided) {
        queryArr.push(product.cat as string);
      }
      const result = await connection.query(sql, queryArr);
      connection.release();
      return result.rows[0];
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  // update product
  async update(product: Product): Promise<Product> {
    try {
      const isCatProvided = product.cat != undefined;
      const connection = await client.connect();
      //check if the product exists
      const inDB = await connection.query(
        "SELECT * from products WHERE id=$1;",
        [product.id]
      );
      if (inDB.rowCount <= 0) {
        throw new Error("this product does not exist");
      }

      const sql =
        "UPDATE products SET(name,price" +
        (isCatProvided ? ",cat" : "") +
        ") = ($1,$2" +
        (isCatProvided ? ",$3" : "") +
        ") WHERE id = " +
        product.id +
        " RETURNING *;";
      const queryArr = [product.name, product.price];
      if (isCatProvided) {
        queryArr.push(product.cat as string);
      }
      const result = await connection.query(sql,queryArr);
      return result.rows[0];
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  // get products by catgory 
  async getProductsByCat(cat: string):Promise<Product[]> {
    try {
      const connection = await client.connect();
      const sql = "SELECT * FROM products WHERE cat = $1;";
      const result = await connection.query(sql, [cat]);
      connection.release();
      return result.rows;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

}
