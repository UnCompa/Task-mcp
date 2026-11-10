"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { tasksApi, type Task } from "@/lib/api";
import { tasksQuery } from "@/lib/tasks-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskFormDialog } from "@/components/task-form-dialog";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function TaskCard({ task }: { task: Task }) {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = React.useState(false);

  // Optimistic toggle: the checkbox reflects the change immediately and the
  // previous list is restored if the request fails.
  const toggle = useMutation({
    mutationFn: (completed: boolean) => tasksApi.update(task.id, { completed }),
    onMutate: async (completed) => {
      await queryClient.cancelQueries({ queryKey: tasksQuery.key });
      const previous = queryClient.getQueryData(tasksQuery.key);
      queryClient.setQueryData(tasksQuery.key, (tasks: Task[] | undefined) =>
        tasks?.map((t) => (t.id === task.id ? { ...t, completed } : t)) ?? [],
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(tasksQuery.key, context?.previous);
      toast.error("Could not update the task. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tasksQuery.key });
    },
  });

  const remove = useMutation({
    mutationFn: () => tasksApi.remove(task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksQuery.key });
      toast.success(`Task "${task.title}" deleted`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Card className="flex items-start gap-3 p-4">
      <Checkbox
        className="mt-0.5"
        checked={task.completed}
        aria-label={`Mark "${task.title}" as ${task.completed ? "pending" : "completed"}`}
        onCheckedChange={(checked) => toggle.mutate(checked)}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={
              task.completed
                ? "font-medium line-through text-muted-foreground"
                : "font-medium"
            }
          >
            {task.title}
          </p>
          {task.completed && (
            <Badge variant="secondary" className="shrink-0">
              Completed
            </Badge>
          )}
        </div>
        {task.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {task.description}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Updated {dateFormatter.format(new Date(task.updatedAt))}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Edit "${task.title}"`}
          onClick={() => setEditOpen(true)}
        >
          <PencilIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Delete "${task.title}"`}
          disabled={remove.isPending}
          onClick={() => remove.mutate()}
        >
          <Trash2Icon />
        </Button>
      </div>
      <TaskFormDialog open={editOpen} onOpenChange={setEditOpen} task={task} />
    </Card>
  );
}
