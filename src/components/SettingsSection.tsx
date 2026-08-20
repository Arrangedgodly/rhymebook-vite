import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  danger?: boolean;
  children: ReactNode;
}

export const SettingsSection = ({
  title,
  description,
  danger = false,
  children,
}: SettingsSectionProps) => (
  <section
    className={[
      "rounded-lg border bg-base-100 p-4 md:p-5",
      danger ? "border-error/50" : "border-base-300",
    ].join(" ")}
  >
    <h2 className={["text-base font-semibold", danger ? "text-error" : ""].join(" ")}>
      {title}
    </h2>
    {description && <p className="mt-1 text-sm opacity-65">{description}</p>}
    <div className="mt-4 flex flex-col gap-3">{children}</div>
  </section>
);

export default SettingsSection;
