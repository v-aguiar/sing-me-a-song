import { prisma } from "../../src/database.js";
import recommendationFactory from "./recommendationFactory.js";

const scenarioFactory = {
  createScenarioWithFiveRecommendations: async () => {
    const recommendation1 = await recommendationFactory.createRecommendation();
    const recommendation2 = await recommendationFactory.createRecommendation();
    const recommendation3 = await recommendationFactory.createRecommendation();
    const recommendation4 = await recommendationFactory.createRecommendation();
    const recommendation5 = await recommendationFactory.createRecommendation();

    return [
      { ...recommendation1 },
      { ...recommendation2 },
      { ...recommendation3 },
      { ...recommendation4 },
      { ...recommendation5 },
    ];
  },

  createScenarioWithTwentyRecommendations: async () => {
    const recommendations = [];
    for (let i = 0; i < 20; i++) {
      recommendations.push(await recommendationFactory.createRecommendation());
    }

    return recommendations;
  },

  createScenarioWithOneUpvotedRecommendation: async () => {
    const recommendation = await recommendationFactory.createRecommendation();
    const updatedRecommendation = await prisma.recommendation.update({
      where: { id: recommendation.id },
      data: { score: 1 },
    });

    return { ...updatedRecommendation };
  },

  createScenarioWithNegativeScoreLimitRecommendation: async () => {
    const recommendation = await recommendationFactory.createRecommendation();
    const updatedRecommendation = await prisma.recommendation.update({
      where: { id: recommendation.id },
      data: { score: -5 },
    });

    return { ...updatedRecommendation };
  },
};

export default scenarioFactory;
