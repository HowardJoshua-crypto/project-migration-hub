// Application status rules shared by the talent and employer screens.
import type { ApplicationStatus } from "./types";

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  SUBMITTED: "Submitted", UNDER_REVIEW: "Under review", SHORTLISTED: "Shortlisted", INTERVIEW: "Interview",
  ACCEPTED: "Accepted", REJECTED: "Rejected", WITHDRAWN: "Withdrawn",
};

/** Final statuses: nobody can move an application out of these. */
export const FINAL_STATUSES: ReadonlySet<ApplicationStatus> = new Set<ApplicationStatus>(["ACCEPTED", "REJECTED", "WITHDRAWN"]);

/** Statuses an employer may set. Employers can never submit or withdraw on a talent's behalf. */
export const EMPLOYER_STATUSES: ApplicationStatus[] = ["UNDER_REVIEW", "SHORTLISTED", "INTERVIEW", "ACCEPTED", "REJECTED"];

export function canEmployerSet(from: ApplicationStatus, to: ApplicationStatus): boolean {
  return !FINAL_STATUSES.has(from) && from !== to && EMPLOYER_STATUSES.includes(to);
}

export function canWithdraw(status: ApplicationStatus): boolean {
  return !FINAL_STATUSES.has(status);
}

export function employerOptions(from: ApplicationStatus): ApplicationStatus[] {
  return EMPLOYER_STATUSES.filter((to) => canEmployerSet(from, to));
}
