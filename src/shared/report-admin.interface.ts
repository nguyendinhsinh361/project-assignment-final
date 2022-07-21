/* eslint-disable prettier/prettier */

export class ReportAdminI {
    task_in_progress: number;
    task_completed: number;
    task_failed: number;
    task_pending: number;
    total_bug: number;
    bug_per_task_rate: number | string;
}
