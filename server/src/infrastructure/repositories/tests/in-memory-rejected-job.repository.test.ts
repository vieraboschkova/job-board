import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryRejectedJobRepository } from "../in-memory-rejected-job.repository";

import {
    CountryCode,
    EmploymentType,
} from "../../../domain/job/job.enums";

import { RejectedJob } from "../../../domain/job/job.types";

import { RejectionReason } from "../../../domain/review/review.enums";


const createRejectedJob = (
    id = "1",
): RejectedJob => ({
    job: {
        id,
        title: "Backend Developer",
        company: "Test Company",
        description: "Node job",
        location: {
            country: CountryCode.US,
            remote: true,
        },
        employmentType: EmploymentType.FullTime,
        sourceName: "test",
        rawData: {},
        createdAt: new Date(),
    },
    rejectedAt: new Date(),
    rejectionReasons: [
        {
            reason: RejectionReason.Other,
            details: "Rejected during review",
        },
    ],
});


describe("InMemoryRejectedJobRepository", () => {
    let repository: InMemoryRejectedJobRepository;


    beforeEach(() => {
        repository = new InMemoryRejectedJobRepository();
    });


    it("saves rejected jobs", async () => {
        const job = createRejectedJob();

        await repository.save(job);

        const result = await repository.getAll();

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(job);
    });


    it("returns rejected job by id", async () => {
        await repository.save(createRejectedJob());

        const result = await repository.getById("1");

        expect(result?.job.id).toBe("1");
    });


    it("returns empty list when no rejected jobs exist", async () => {
        const result = await repository.getAll();

        expect(result).toEqual([]);
    });
});