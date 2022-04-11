import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import {usersRoutes} from "./handlers/user.handler";
import {UserModel} from "./models/user.model";
export interface Error {
  name: string;
  message: string;
  stack?: string;
  status: number;
}

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());

app.get("/",async function (req: Request, res: Response) {
  res.json("hello");
});

usersRoutes(app);

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
    const status = err.status||500;
    res.status(status).json(err.message);
  }
);
