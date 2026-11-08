import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ServiceError } from "@/services/store";

/**
 * Runs a service write, refreshes every screen's data, and reports the outcome.
 * Field-level validation messages are passed to `onFieldErrors` for inline display.
 */
export function useAction<A, R>(
  fn: (args: A) => Promise<R>,
  opts: { success?: string | ((r: R) => string) | undefined; onSuccess?: ((r: R) => void) | undefined; onFieldErrors?: ((e: Record<string, string>) => void) | undefined } = {},
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: async (r) => {
      opts.onFieldErrors?.({});
      await qc.invalidateQueries();
      const msg = typeof opts.success === "function" ? opts.success(r) : opts.success;
      if (msg) toast.success(msg);
      opts.onSuccess?.(r);
    },
    onError: (e) => {
      if (e instanceof ServiceError && e.fields && opts.onFieldErrors) opts.onFieldErrors(e.fields);
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    },
  });
}

/** Reads a <form> into a plain object of strings (Radix selects submit through hidden inputs). */
export function formValues(form: HTMLFormElement): Record<string, string> {
  const out: Record<string, string> = {};
  // "_none" is the placeholder value SelectField uses for an empty choice.
  new FormData(form).forEach((v, k) => { out[k] = typeof v === "string" && v !== "_none" ? v : ""; });
  return out;
}
