import client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  password: string;
};

const hashPassword= async(password:string):Promise<string>=>{
  const salt = parseInt(process.env.SALT_ROUNDS as string);
  return await bcrypt.hash(password + process.env.PEPPER,salt)
}

export class UserModel {
  // create new user
  async create(user: User) :Promise<User> {
    try {
      // connect to db
      const connection = await client.connect();
      const query = "INSERT INTO users (firstName,lastName,passwd) VALUES ($1,$2,$3) RETURNING *;";
        const result = await connection.query(query,[user.firstName,user.lastName,await hashPassword(user.password)]);
        connection.release();
        return  result.rows[0];

    } catch (error) {
        throw new Error("user does not created because : "+error);
    }
  }

  // get All users 

  async index():Promise<User[]>{
    try{
    const connection = await client.connect();
    const query = "SELECT * FROM users";
    const result = await connection.query(query);
    connection.release();
    return result.rows
    }catch(err){
      throw new Error(err as string);
    }
  }

  // get sigle user 
  async getUser(userId:number):Promise<User>{
    try{
      const connection = await client.connect();
      const query = "SELECT * FROM users WHERE id = $1";
      const result = await connection.query(query,[userId]);
      connection.release();
      return result.rows[0];
    }catch(err){
      throw new Error(err as string);
    }
  }

  // delete single user
  async deleteUser(userId:number):Promise<User>{
    try{
    const connection = await client.connect();
    const query = "DELETE FROM users WHERE id = $1 RETURNING *;";
    const result = await connection.query(query,[userId]);
    connection.release();
    return result.rows[0];
    }catch(err){
      throw new Error(err as string);
    }
  }

  // update sigle user 
  async updateUser(user:User):Promise<User>{
    try {
      // connect to db
      const connection = await client.connect();
      // check the user is already exist
      const inData = await client.query("SELECT id FROM users WHERE id = $1;",[user.id]);
      if (inData.rowCount <= 0) {throw new Error("no such user exist");}
      const query = "UPDATE users SET (firstName,lastName,passwd) = ($1,$2,$3) WHERE id = $4 RETURNING *;";
        const result = await connection.query(query,[user.firstName,user.lastName,await hashPassword(user.password),user.id]);
        connection.release();
        return  result.rows[0];

    } catch (error) {
        throw new Error("user does not updated because : " + (error as Error).message);
    }
  }
  }

