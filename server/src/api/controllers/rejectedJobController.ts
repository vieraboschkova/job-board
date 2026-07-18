import { NextFunction, Request, Response } from "express";

import { HttpStatusCode } from "../constants";
import { RejectedJobsReader } from "../../domain/job/job.types";

export function createRejectedJobController(
  rejectedJobsReader: RejectedJobsReader,
) {
  return {
    getAll: async (
      _req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const rejections = await rejectedJobsReader.getAll();
        res.status(HttpStatusCode.Ok).json(rejections);
      } catch (error) {
        next(error);
      }
    },
  };
}
