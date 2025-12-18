const express = require("express"); //Loads the Express library.
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const app = express(); //Creates an Express application.
//const port = 3000; //Defines the port where the server will listen. //in the dockerfile we used port 8080, so change it to that 8080

// Swagger (only if you have swagger.json)
// const swaggerDocument = require("../swagger.json");
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// IMPORTANT: listen on the EB-provided port
const port = process.env.PORT ? Number(process.env.PORT) : 8080;

//Middleware
app.use(express.static("public")); //Serves static files from the public folder (HTML, CSS, JS).

//Import and mount the calculator routes
const calculatorRoutes = require("./routers/CalculatorRoutes"); //Imports the router from CalculatorRoutes.js.
app.use("/calculator", calculatorRoutes); //Mounts the router so routes like /add, /minus are handled.

// Simple root route to verify env is working
app.get("/", (req, res) => {
  res.send(`Hello, CUSTOM_VAR is: ${process.env.CUSTOM_VAR || "(not set)"}`);
});

//Global error-handling middleware. Error handler function from expressjs.com. The other way of handling the error in inside a function
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

//Start the server
if (require.main === module && process.env.NODE_ENV !== "test") { //we needed this line for testing. // Start the server only outside of tests (and only when run directly)
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`); //Logs a message when the server starts.
});
}
module.exports = app; //This is for testing, used in index.test.js

//req.query is how we access GET data sent via the request query parameters.

// app.get. Registers GET /add. Extracts num1 and num2 from the query string (e.g., /add?num1=4&num2=10).
// Converts them to integers with parseInt and calls your add function. Sends a response to the client.