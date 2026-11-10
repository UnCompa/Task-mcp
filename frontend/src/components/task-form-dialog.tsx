"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tasksApi, type Task } from "@/lib/api";
import { tasksQuery } from "@/lib/tasks-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present in edit mode, absent when creating a new task. */
  task?: Task;
}

interface FormState {
  title: string;
  description: string;
  completed: boolean;
}

const emptyForm: FormState = { title: "", description: "", completed: false };

export function TaskFormDialog({ open, onOpenChange, task }: TaskFormDialogProps) {
  const isEdit = task !== undefined;
  const [form, setForm] = React.useState<FormState>(emptyForm);
  const queryClient = useQueryClient();

  // Reset the form each time the dialog opens.
  React.useEffect(() => {
    if (!open) return;
    setForm(
      task
        ? {
            title: task.title,
            description: task.description ?? "",
            completed: task.completed,
          }
        : emptyForm,
    );
  }, [open, task]);

  const save = useMutation({
    mutationFn: () =>
      isEdit
        ? tasksApi.update(task.id, {
            title: form.title,
            description: form.description || undefined,
            completed: form.completed,
          })
        : tasksApi.create({
            title: form.title,
            description: form.description || undefined,
          }),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: tasksQuery.key });
      toast.success(isEdit ? "Task updated" : `Task "${saved.title}" created`);
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the task details below."
              : "Give your task a title and an optional description."}
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={form.title}
              maxLength={100}
              required
              placeholder="What needs to be done?"
              onChange={(event) =>
                setForm((form) => ({ ...form, title: event.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={form.description}
              maxLength={255}
              placeholder="Optional details (max 255 characters)"
              onChange={(event) =>
                setForm((form) => ({ ...form, description: event.target.value }))
              }
            />
          </div>
          {isEdit && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="task-completed"
                checked={form.completed}
                onCheckedChange={(checked) =>
                  setForm((form) => ({ ...form, completed: checked }))
                }
              />
              <Label htmlFor="task-completed">Completed</Label>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving…" : isEdit ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
