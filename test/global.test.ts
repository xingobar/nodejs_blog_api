import supertest from "supertest";
import dotenv from "dotenv";
import path from "path";
import Faker from "faker";
import { expect } from "chai";

dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

// process.env.API_URL;

import app from "../src/app";

export const server = app.listen(process.env.APP_PORT);

export const api = supertest(process.env.API_URL);
