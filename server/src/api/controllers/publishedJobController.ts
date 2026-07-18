import { NextFunction, Request, Response } from "express";

import { ApiErrorCode, HttpStatusCode } from "../constants";
import { PublishedJobsReader } from "../../domain/job/job.types";
import { JobsQuery } from "../schemas/jobs-query.schema";
import { sendApiError } from "../utils/send-api-error";

export interface PublishedJobControllerDeps {
  publishedJobsReader: PublishedJobsReader;
}

export function createPublishedJobController(deps: PublishedJobControllerDeps) {
  const { publishedJobsReader } = deps;

  return {
    getAll: async (
      _req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const jobs = await publishedJobsReader.getAll();
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
        const jobs = await publishedJobsReader.search(query);
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
        const job = await publishedJobsReader.getById(req.params.id);

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
