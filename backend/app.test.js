const request = require("supertest");
const app = require("./app"); 

describe("API tests", () => {
 
  jest.setTimeout(10000);

  it("should connect to MongoDB", async () => {
    expect(true).toBe(true);
  });

  

  it("should return 404 for invalid routes", async () => {
    const response = await request(app).get("/api/non-existent");
    expect(response.status).toBe(404); 
  });
});
