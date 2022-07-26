import supertest from "supertest";
import { faker } from "@faker-js/faker";

import app from "../src/app.js";
import { prisma } from "../src/database.js";
import scenarioFactory from "./factories/scenarioFactory.js";

import { CreateRecommendationData } from "../src/services/recommendationsService.js";

beforeAll(async () => {
  await prisma.recommendation.deleteMany();
});

describe("recommendation tests", () => {
  it("should return status code 201 if created", async () => {
    const recommendation: CreateRecommendationData = {
      name: faker.name.firstName(),
      youtubeLink: faker.internet.url(),
    };
    const response = await supertest(app).post("/").send(recommendation);
    expect(response.status).toBe(201);

    const createdRecommendation = await prisma.recommendation.findFirst({
      where: { name: recommendation.name },
    });
    expect(createdRecommendation).not.toBeNull();
  });

  it("should return all found recommendations and status code 200", async () => {
    const recommendations = scenarioFactory.createScenarioWithFiveRecommendations();
    const response = await supertest(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(recommendations);
  });
});
