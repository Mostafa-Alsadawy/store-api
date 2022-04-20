import supertest from "supertest";
import { app } from "../../server";
import { User } from "../../models/user.model";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import client from "../../database";

dotenv.config();
const env = process.env;
const req = supertest(app);

describe("test funcionality of user handlers", () => {
  const user: User = {
    firstname: "test",
    lastname: "user",
    passwd: "123456",
  };
  let token = "";
  it("crate new user", async () => {
    const result = await (await req.post("/users/add-user").send(user)).body;
    const createdUser = result.data;
    token = createdUser.token;
    user.id = createdUser.id;
    expect(createdUser.firstname).toBe(user.firstname);
    expect(createdUser.lastname).toBe(user.lastname);
    expect(await bcrypt.compare(user.passwd + env.PEPPER, createdUser.passwd));
  });

  it("it get all users if authenticated", async () => {
    {
      const result = await (
        await req.get("/users").set("Authorization", `Bearer ${token}`)
      ).body;
      expect(result.data.length).toBe(1);
    }
  });

  it("it give error not authenticate for unprovied token request", async () => {
    {
      const result = await req.get("/users");
      expect(result.status).toBe(401);
    }
  });

  it("it get specific user if authenticated", async () => {
    {
      const result = await (
        await req
          .get("/users/" + user.id)
          .set("Authorization", `Bearer ${token}`)
      ).body;
      expect(result.data.id).toBe(user.id);
    }
  });

  it("it give error when get one user for unprovied token request", async () => {
    {
      const result = await req.get("/users/:id");
      expect(result.status).toBe(401);
    }
  });

  it("authenticate already existing users", async () => {
    const result = await req
      .post("/users/authenticate")
      .send({ id: user.id, passwd: user.passwd });
    expect(result.status).toBe(200);
    expect(result.body.data.firstname).toBe(user.firstname);
  });

  it("update user info", async () => {
    const info: User = {
      firstname: "updatedtest",
      lastname: "updateduser",
      passwd: "41284512",
    };
    const result = await (
      await req
        .put("/users/" + user.id)
        .send(info)
        .set("Authorization", `Bearer ${token}`)
    ).body;
    const updatedUser = result.data;
    expect(updatedUser.firstname).toBe(info.firstname);
    expect(updatedUser.lastname).toBe(info.lastname);
    expect(await bcrypt.compare(user.passwd + env.PEPPER, updatedUser.passwd));
  });

  it("delete user by id ", async () => {
    const result = await (await req.delete("/users/" + user.id).set("Authorization", `Bearer ${token}`)).body;
    expect(result.data.id).toBe(user.id);
  });

  afterAll(async () => {
    const connection = await client.connect();
    const sql = "DELETE FROM users;ALTER SEQUENCE users_id_seq RESTART WITH 1;";
    connection.query(sql);
    connection.release();
  });
});
