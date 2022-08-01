import { Router } from "express";

import { recommendationController } from "../controllers/recommendationController.js";

const testRouter = Router();

testRouter.delete("/truncate", recommendationController.truncate);

export default testRouter;
