import { faker } from "@faker-js/faker";
import { prisma } from "../src/database.js";
import supertest from "supertest";

import app from "../src/app.js";
import scenarioFactory from "./factories/scenarioFactory.js";

import { CreateRecommendationData } from "../src/services/recommendationsService.js";

beforeAll(async () => {
  await prisma.recommendation.deleteMany();
});

const agent = supertest(app);

describe("recommendation tests", () => {
  it("should return status code 201 if created", async () => {
    const recommendation: CreateRecommendationData = {
      name: faker.name.firstName(),
      youtubeLink: faker.internet.url(),
    };
    const response = await agent.post("/").send(recommendation);
    expect(response.status).toBe(201);

    const createdRecommendation = await prisma.recommendation.findFirst({
      where: { name: recommendation.name },
    });
    expect(createdRecommendation).not.toBeNull();
  }, 10000);

  it("should return all found recommendations and status code 200", async () => {
    const recommendations = await scenarioFactory.createScenarioWithFiveRecommendations();
    const response = await agent.get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(recommendations);
  }, 10000);
});

afterAll(async () => {
  await prisma.$disconnect();
});
