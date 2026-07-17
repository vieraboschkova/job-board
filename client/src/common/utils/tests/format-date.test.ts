import { describe, expect, it } from "vitest";
import { formatDate } from "../format-date";

describe("formatDate", () => {
    it("formats Date object to DD/MM/YYYY", () => {
        const date = new Date("2026-01-01");

        expect(formatDate(date)).toBe("01/01/2026");
    });

    it("formats string date to DD/MM/YYYY", () => {
        expect(formatDate("2026-12-05")).toBe("05/12/2026");
    });

    it("adds leading zeros for single digit days and months", () => {
        const date = new Date("2026-02-09");

        expect(formatDate(date)).toBe("09/02/2026");
    });

    it("throws error for invalid date", () => {
        expect(() => formatDate("invalid-date")).toThrow("Invalid date");
    });
});