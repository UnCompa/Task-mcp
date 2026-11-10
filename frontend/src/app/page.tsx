import { TasksView } from "@/components/tasks-view";

export default function Home() {
  return (
    <div className="min-h-svh bg-muted/40">
      <div className="mx-auto w-full max-w-2xl px-4 py-12">
        <header className="mb-8 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Manage your tasks, kept in sync with the tasks API.
          </p>
        </header>
        <TasksView />
      </div>
    </div>
  );
}
