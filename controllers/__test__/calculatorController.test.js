// Unit test - stored in square.test.js
// First we import the square function
const { add, minus, divide, multiply } = require('../calculator');
// Then we test it by describing the test, running the
// code, and comparing expected vs. actual results
test('add 5 with 5 to get 10', () => {
  expect(add(5, 5)).toBe(10);
});

  test("minus()", () => {
    expect(minus(10, 4)).toBe(6);
    expect(minus(3, 7)).toBe(-4);
  });

  test("multiply()", () => {
    expect(multiply(6, 7)).toBe(42);
    expect(multiply(-3, 4)).toBe(-12);
  });

  test("divide()", () => {
    expect(divide(20, 5)).toBe(4);
    expect(divide(-9, 3)).toBe(-3);
  });