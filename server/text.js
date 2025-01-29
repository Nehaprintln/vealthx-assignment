// npm install jest supertest --save-dev (install)
// npm install mongodb-memory-server --save-dev


const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // Import your Express app
const Claim = require("../models/Claim"); // Import your Claim model
const { MongoMemoryServer } = require("mongodb-memory-server");
const path = require("path");

let mongoServer;

// Set up a mock database before running tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, 
    useUnifiedTopology: true });
});

// Clean up the database after each test
afterEach(async () => {
  await Claim.deleteMany(); // Clear test data from the database
});

// Close the connection after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("POST /api/claims", () => {
  it("should successfully create a claim with an uploaded file", async () => {
    // Path to a sample file for upload
    const filePath = path.join(__dirname, "testFile.pdf");

    const response = await request(app)
      .post("/api/claims")
      .field("claimType", "Insurance")
      .field("policyNumber", "123456")
      .field("claimAmount", "5000")
      .field("incidentDate", "2023-12-31")
      .field("description", "Accident occurred")
      .field("email", "test@example.com")
      .field("phone", "1234567890")
      .attach("file", filePath); // Simulate file upload

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Claim submitted successfully!");

    // Verify that the claim was saved in the database
    const claim = await Claim.findOne({ policyNumber: "123456" });
    expect(claim).toBeTruthy();
    expect(claim.filePath).toBeTruthy();
  });

  it("should return an error if required fields are missing", async () => {
    const response = await request(app).post("/api/claims").send({});
    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeTruthy();
  });
});


//  get testing 
describe("GET /api/claims", () => {
    it("should return all claims from the database", async () => {
      // Seed the database with mock claims
      await Claim.create([
        {
          claimType: "Insurance",
          policyNumber: "12345",
          claimAmount: 5000,
          incidentDate: "2023-12-31",
          description: "Car accident",
          email: "test@example.com",
          phone: "1234567890",
          filePath: "uploads/file1.pdf",
        },
        {
          claimType: "Financial",
          policyNumber: "67890",
          claimAmount: 10000,
          incidentDate: "2023-11-15",
          description: "Property damage",
          email: "user@example.com",
          phone: "9876543210",
          filePath: "uploads/file2.pdf",
        },
      ]);
  
      const response = await request(app).get("/api/claims");
  
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.claims).toHaveLength(2); // Expect 2 claims
      expect(response.body.claims[0].policyNumber).toBe("12345");
      expect(response.body.claims[1].policyNumber).toBe("67890");
    });
  
    it("should return an empty array if no claims exist", async () => {
      const response = await request(app).get("/api/claims");
  
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.claims).toEqual([]); // Expect an empty array
    });
  
    it("should handle server errors gracefully", async () => {
      // Mock an error in the `Claim.find()` method
      jest.spyOn(Claim, "find").mockImplementationOnce(() => {
        throw new Error("Database error");
      });
  
      const response = await request(app).get("/api/claims");
  
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Database error");
  
      // Restore the original implementation
      Claim.find.mockRestore();
    });
  });