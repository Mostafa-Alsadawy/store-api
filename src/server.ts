import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import client from "./database"
interface Error {
  name: string;
  massage: string;
  stack?: string;
  status: number;
}

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());

app.get("/",async function (req: Request, res: Response) {
  const connection = await client.connect();
  const query = "SELECT NOW()"
  const resuelt = connection.query(query);
  connection.release;
  res.json(resuelt);
});

app.listen(3000, function (): void {
  console.log("server is running on " + address);
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    next: NextFunction
  ): void => {
    const status = err.status || 500;
    console.log(err.massage);
    res.status(status).json(err.name || "oops there is a problem");
  }
);
