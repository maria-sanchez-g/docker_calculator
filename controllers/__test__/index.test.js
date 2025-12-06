// controllers/__test__/index.test.js
const request = require("supertest");
const app = require("../../index");

describe("Calculator Routes", () => {
  test("GET /calculator/add => sum of numbers", async () => {
    const number1 = Math.floor(Math.random() * 1_000_000);
    const number2 = Math.floor(Math.random() * 1_000_000);

    const res = await request(app)
      .get("/calculator/add")
      .query({ num1: number1, num2: number2 })
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body).toEqual({ result: number1 + number2 });
  });
});


// The test function takes two parameters:
// A string describing what is being tested
// A function that runs the test and returns a pass/fail result.
// Inside the test, we make a request to the app using .get() 
// to simulate a GET HTTP request (.post() etc is also available). The string passed to .get should match the expected format, including request parameters.
// We then use expect to check the content type and status code of the response.// 