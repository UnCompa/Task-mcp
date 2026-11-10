"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import type { Task } from "@/lib/api";
import { tasksQuery } from "@/lib/tasks-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCard } from "@/components/task-card";
import { TaskFormDialog } from "@/components/task-form-dialog";

type Filter = "all" | "pending" | "completed";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

export function TasksView() {
  const [filter, setFilter] = React.useState<Filter>("all");
  const [createOpen, setCreateOpen] = React.useState(false);
  const { data, error, isPending, isError, refetch, isRefetchError } = useQuery(
    tasksQuery.options(),
  );

  const tasks = data ?? [];
  const completedCount = tasks.filter((task) => task.completed).length;
  const visibleTasks = tasks.filter((task) =>
    filter === "all" ? true : filter === "completed" ? task.completed : !task.completed,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {filters.map(({ value, label }) => {
            const count =
              value === "all"
                ? tasks.length
                : value === "completed"
                  ? completedCount
                  : tasks.length - completedCount;
            return (
              <Button
                key={value}
                variant={filter === value ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter(value)}
              >
                {label} ({count})
              </Button>
            );
          })}
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <PlusIcon data-icon="inline-start" />
          New task
        </Button>
      </div>

      {(isPending || (isError && isRefetchError && tasks.length === 0)) && (
        <div className="flex flex-col gap-2">
          {isError && <p className="text-sm text-destructive">{error.message}</p>}
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && tasks.length === 0 && !isRefetchError && (
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Could not load tasks: {error?.message}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCwIcon data-icon="inline-start" />
            Try again
          </Button>
        </Card>
      )}

      {!isPending && !isError && visibleTasks.length === 0 && (
        <Card className="flex flex-col items-center gap-3 p-12 text-center">
          <p className="font-medium">
            {tasks.length === 0 ? "No tasks yet" : "Nothing here"}
          </p>
          <p className="max-w-xs text-sm text-muted-foreground">
            {tasks.length === 0
              ? "Create your first task to get started."
              : filter === "completed"
                ? "No completed tasks match this filter."
                : "No pending tasks match this filter."}
          </p>
          {tasks.length === 0 && (
            <Button onClick={() => setCreateOpen(true)}>
              <PlusIcon data-icon="inline-start" />
              New task
            </Button>
          )}
        </Card>
      )}

      {!isPending && !isError && visibleTasks.length > 0 && (
        <ul className="flex flex-col gap-2">
          {visibleTasks.map((task: Task) => (
            <li key={task.id}>
              <TaskCard task={task} />
            </li>
          ))}
        </ul>
      )}

      <TaskFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
