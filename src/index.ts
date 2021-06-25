import app from "app";

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
