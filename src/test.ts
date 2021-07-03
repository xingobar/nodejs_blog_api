import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

import app from "app";

// start the Express server
const server = app.listen(process.env.APP_PORT, () => {
  console.log(`server started at http://localhost:${process.env.APP_PORT}`);
});

export default server;

module.exports = server;
