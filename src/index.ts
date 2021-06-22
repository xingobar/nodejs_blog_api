import express from "express";
import dotenv from "dotenv";
import app from "app";

dotenv.config();
const port = process.env.APP_PORT ?? 8001; // default port to listen

// define a route handler for the default home page
app.get("/", (req, res) => {
  console.log("test world");
  res.send("Hello world!");
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
