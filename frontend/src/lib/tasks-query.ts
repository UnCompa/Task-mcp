import { queryOptions } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api";

// Shared query contract: one place defines the key and options so every
// call site (queries, mutations, invalidations) uses the same identity.
export const tasksQuery = {
  key: ["tasks"] as const,
  options: () =>
    queryOptions({
      queryKey: ["tasks"],
      queryFn: () => tasksApi.list(),
      staleTime: 30_000,
    }),
};
