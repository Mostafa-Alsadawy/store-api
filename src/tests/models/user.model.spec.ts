import { User, UserModel } from "../../models/user.model";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import client from "../../database";

const userModel = new UserModel();
dotenv.config();
const env = process.env;

describe("make sure that all User CRUD function are defined",()=>{
  it("create new user is defined",():void=>{
    expect(userModel.create).toBeDefined();
  });

  it("get all users is defined",():void=>{
    expect(userModel.index).toBeDefined();
  });

  it("get one user is defined",():void=>{
    expect(userModel.getUser).toBeDefined();
  });

  it("update user is defined",():void=>{
    expect(userModel.updateUser).toBeDefined();
  });

  it("delete user is defined",():void=>{
    expect(userModel.deleteUser).toBeDefined();
  });

  it("authenticate user is defined",():void=>{
    expect(userModel.authenticate).toBeDefined();
  });
});

describe("Test functionality of all CRUD opreation for User Model",()=>{
  const user:User = {
    firstname:"test",
    lastname:"user",
    passwd:"123456"
  }
  it("create new user",async():Promise<void>=>{
    const newUser = await userModel.create(user);
    user.id = newUser.id;
    expect(newUser.firstname).toEqual(user.firstname);
    expect(newUser.lastname).toEqual(user.lastname);
    expect(await bcrypt.compare(user.passwd+env.PEPPER,newUser.passwd)).toBeTruthy();
  });    

  it("get all users",async():Promise<void>=>{
    const users = await userModel.index();
    expect(users.length).toBe(1);
  });

  it("get user by id ",async():Promise<void>=>{
    const resUser = await userModel.getUser(user.id!);
    expect(resUser.firstname).toEqual(user.firstname);
    expect(resUser.lastname).toEqual(user.lastname);
    expect(await bcrypt.compare(user.passwd+env.PEPPER,resUser.passwd)).toBeTruthy();
  });

  it("update user ",async():Promise<void>=>{
    let updatedInfo:User = {
      firstname:"update-test",
      lastname:"update-user",
      passwd:"000000"
    }
    const oldUser = await userModel.getUser(user.id!);
    updatedInfo.id = oldUser.id;
    const updatedUser = await userModel.updateUser(updatedInfo);
    expect(updatedUser.firstname).toEqual(updatedInfo.firstname);
    expect(updatedUser.lastname).toEqual(updatedInfo.lastname);
    expect(await bcrypt.compare(updatedInfo.passwd+env.PEPPER,updatedUser.passwd)).toBeTruthy();
  });

  it("delete user by  id ",async():Promise<void>=>{
    const countusersBeforeDelete = (await userModel.index()).length;
    const deletedUser = await userModel.deleteUser(user.id!);
    const countusersAfterDelete = (await userModel.index()).length;
    expect(countusersAfterDelete).toBe(countusersBeforeDelete - 1);
    expect(deletedUser.id).toBe(user.id)
  });

 afterAll(async():Promise<void>=>{
   const connection = await client.connect();
   const sql = "DELETE FROM users;ALTER SEQUENCE users_id_seq RESTART WITH 1;";
   connection.query(sql);
   connection.release();
 })
})