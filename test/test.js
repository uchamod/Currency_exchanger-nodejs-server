import { expect } from "chai"; // Import expect from Chai
import express from "express";
import request from "supertest";
import exchangeRouter from "../routes/index.js"; // Assuming this is your file
const app = express();
app.use("/", exchangeRouter);
//testing the routes
//name route
describe("GET /names", () => {
  this.timeout(10000); // 10 seconds
  it("should return a list of currency names", async () => {
    const response = await request(app).get("/names");
    expect(response.status).toBe(200);
    expect(typeof response.body).toBe("object");
    expect(response.body).toHaveProperty("USD"); // Check a common currency exists
    done();
  });

  it("should return 500 if API fails", async () => {
    process.env.API_KEY = "INVALID_KEY"; // Simulate an invalid API key
    const response = await request(app).get("/names");
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "An error occurred");
    done();
  });
});
//amount route

describe("GET /amount", () => {
  it("should return the calculated target amount", async () => {
    const query = {
      date: "2023-12-01", // Example date
      sourceCurrency: "USD",
      targetCurrency: "EUR",
      sourceAmount: 100,
    };
    const response = await request(app).get("/amount").query(query);
    expect(response.status).toBe(200);
    expect(typeof response.body).toBe("number"); // Target amount should be numeric
    expect(response.body).toBeGreaterThan(0); // Ensure valid conversion
    done();
  });

  it("should return 500 if date is invalid", async () => {
    const query = {
      date: "INVALID_DATE",
      sourceCurrency: "USD",
      targetCurrency: "EUR",
      sourceAmount: 100,
    };
    const response = await request(app).get("/amount").query(query);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "An error occurred");
    done();
  });

  it("should return 500 if required query params are missing", async () => {
    const response = await request(app).get("/amount");
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "An error occurred");
    done();
  });
});
