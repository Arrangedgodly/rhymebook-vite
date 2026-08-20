import type { ReactNode } from "react";
import type { ActionState } from "../hooks/useAccountLogic";

export const fieldInput =
  "w-full rounded-md border border-base-300 bg-base-100 px-3 py-2 text-sm " +
  "outline-none transition focus:border-primary " +
  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary";

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}

export const Field = ({ label, htmlFor, hint, children }: FieldProps) => (
  <div className="flex flex-col gap-1">
    <label
      htmlFor={htmlFor}
      className="text-[0.68rem] font-medium uppercase tracking-wider opacity-55"
    >
      {label}
    </label>
    {children}
    {hint && <p className="text-xs opacity-55">{hint}</p>}
  </div>
);

/** Small caption reporting how the last attempt went. */
export const StatusNote = ({ state }: { state: ActionState }) => {
  if (state.status === "idle" || state.status === "working") return null;
  return (
    <p
      role="status"
      className={[
        "text-sm",
        state.status === "error" ? "text-error" : "text-success",
      ].join(" ")}
    >
      {state.message}
    </p>
  );
};

/** A plain message line, for pages that track their own error strings. */
export const FormMessage = ({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: ReactNode;
}) => (
  <p
    role="status"
    className={[
      "text-sm",
      tone === "error" ? "text-error" : "text-success",
    ].join(" ")}
  >
    {children}
  </p>
);
