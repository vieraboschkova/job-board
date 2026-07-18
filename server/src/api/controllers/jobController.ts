import { NextFunction, Request, Response } from "express";

import { ApiErrorCode, HttpStatusCode } from "../constants";
import { JobReader } from "../../domain/job/job.types";
import { JobsQuery } from "../schemas/jobs-query.schema";
import { sendApiError } from "../utils/send-api-error";

export interface JobControllerDeps {
  jobReader: JobReader;
}

export function createJobController(deps: JobControllerDeps) {
  const { jobReader } = deps;

  return {
    getAll: async (
      _req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const jobs = await jobReader.getAll();
        res.status(HttpStatusCode.Ok).json(jobs);
      } catch (error) {
        next(error);
      }
    },

    search: async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const query = req.query as JobsQuery;
        const jobs = await jobReader.search(query);
        res.status(HttpStatusCode.Ok).json(jobs);
      } catch (error) {
        next(error);
      }
    },

    getById: async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const job = await jobReader.getById(req.params.id);

        if (!job) {
          sendApiError(res, HttpStatusCode.NotFound, ApiErrorCode.NotFound);
          return;
        }

        res.status(HttpStatusCode.Ok).json(job);
      } catch (error) {
        next(error);
      }
    },
  };
}
