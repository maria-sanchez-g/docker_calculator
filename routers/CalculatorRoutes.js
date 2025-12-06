const express = require('express'); // Loads the express library
const router = express.Router(); // Creates a router object. Creates a mini-app (a router) where you define endpoints, then mount it in index.js
const { add, minus, divide, multiply } = require('../controllers/calculator'); //Imports your pure functions that perform the math.

// Define a single dynamic route for all operations
router.get('/:operation', (req, res) => { //dynamic route
  const { num1, num2 } = req.query; //query parameters
  const { operation } = req.params; //

  const a = Number(num1); //converts the strings into numbers for arithmetic.
  const b = Number(num2);

  let result;

  switch (operation) { //switch selects which controller function to call based on operation
    case "add":
      result = add(a, b);
      break;
    case "minus":
      result = minus(a, b);
      break;
    case "multiply":
      result = multiply(a, b);
      break;
    case "divide":
      result = divide(a, b);
      break;
    default:
      return res.status(400).send({ error: "Invalid operation" });
  }

  res.send({ result });
});

// Export router
module.exports = router; // Makes this router available to other files

//A switch is a control-flow statement that chooses one branch of code to run based on the value of an expression. 
// It is often cleaner than a long chain of if/else if when you are matching discrete values.

//notes