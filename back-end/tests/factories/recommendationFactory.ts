import { faker } from "@faker-js/faker";

import { prisma } from "../../src/database.js";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";

const recommendationFactory = {
  createRecommendation: async () => {
    const recommendation: CreateRecommendationData = await prisma.recommendation.create({
      data: {
        name: faker.name.firstName(),
        youtubeLink: faker.internet.url(),
      },
    });
    return recommendation;
  },
};

export default recommendationFactory;
