import "reflect-metadata";
import app from "app";

const port = process.env.APP_PORT ?? 8001; // default port to listen

// define a route handler for the default home page
app.get("/", (req, res) => {
  console.log("test world");
  res.json({ message: "hello world!" });
});

// start the Express server
const server = app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

module.exports = server;
