import { jest } from "@jest/globals";

import { recommendationRepository } from "../../src/repositories/recommendationRepository";

import {
  CreateRecommendationData,
  recommendationService,
} from "../../src/services/recommendationsService.js";
import * as errorUtils from "../../src/utils/errorUtils.js";

jest.mock("../../src/repositories/recommendationRepository.ts");

describe("Recommendation service insert tests suite", () => {
  it("Should call the repository to create a new recommendation", async () => {
    const createRecommendationData: CreateRecommendationData = {
      name: "Test",
      youtubeLink: "https://www.youtube.com/test",
    };

    await recommendationService.insert(createRecommendationData);
    expect(recommendationRepository.findByName).toHaveBeenCalledTimes(1);
    expect(recommendationRepository.create).toHaveBeenCalledTimes(1);
  });
});

describe("Recommendation service upvote tests suite", () => {
  it("should call the updateScore ('increment') method from the repository once", async () => {
    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((id: number): any => {
      return {
        id: 1,
        name: "Test",
        youtubeLink: "https://www.youtube.com/test",
        score: 0,
      };
    });
    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {});

    const testId = 1;
    await recommendationService.upvote(testId);

    expect(recommendationRepository.find).toBeCalledTimes(1);
    expect(recommendationRepository.updateScore).toBeCalledTimes(1);
    expect(recommendationRepository.updateScore).toBeCalledWith(testId, "increment");
  });
});

describe("Recommendation service downvote tests suite", () => {
  it("should call the updateScore ('decrement') method from the repository once", async () => {
    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((id: number): any => {
      return {
        id: 1,
        name: "Test",
        youtubeLink: "https://www.youtube.com/test",
        score: 0,
      };
    });
    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {
      return {
        id: 1,
        name: "Test",
        youtubeLink: "https://www.youtube.com/test",
        score: -1,
      };
    });
    jest.spyOn(recommendationRepository, "remove").mockImplementationOnce((): any => {});

    const testId = 1;
    await recommendationService.downvote(testId);

    expect(recommendationRepository.find).toBeCalledTimes(2);
    expect(recommendationRepository.updateScore).toBeCalledTimes(2);
    expect(recommendationRepository.updateScore).toBeCalledWith(testId, "decrement");
  });
});

describe("Recommendation service 'get by id' tests suite", () => {
  it("should call the find method from the repository once", async () => {
    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((id: number): any => {
      return {
        id: 1,
        name: "Test",
        youtubeLink: "https://www.youtube.com/test",
        score: 0,
      };
    });

    const testId = 1;
    const recommendation = await recommendationService.getById(testId);

    expect(recommendationRepository.find).toBeCalledTimes(3);
    expect(recommendation).toEqual({
      id: 1,
      name: "Test",
      youtubeLink: "https://www.youtube.com/test",
      score: 0,
    });
  });

  it("should throw an error if the recommendation is not found", async () => {
    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {});
    jest.spyOn(errorUtils, "notFoundError").mockImplementationOnce((): any => {
      throw "error";
    });

    try {
      const testId = 1;
      await recommendationService.getById(testId);
    } catch (error) {
      expect(error).toEqual("error");
    }
  });
});

describe("Recommendation service 'get' test suite", () => {
  it("should call the 'fildAll' method from the repository once", async () => {
    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
      return [
        {
          id: 1,
          name: "Test",
          youtubeLink: "https://www.youtube.com/test",
          score: 0,
        },
      ];
    });

    const recommendations = await recommendationService.get();

    expect(recommendationRepository.findAll).toBeCalledTimes(1);
    expect(recommendations).toEqual([
      {
        id: 1,
        name: "Test",
        youtubeLink: "https://www.youtube.com/test",
        score: 0,
      },
    ]);
  });
});

describe("Recommendation service 'getTop' test suite", () => {
  it("should call the 'getAmountByScore' method from the repository once", async () => {
    jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementationOnce((): any => {});
    const amount = 10;
    await recommendationService.getTop(amount);
    expect(recommendationRepository.getAmountByScore).toBeCalledTimes(1);
  });
});
