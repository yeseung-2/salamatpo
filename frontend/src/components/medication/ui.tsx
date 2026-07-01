import { ReactNode } from "react";

/* ── Design tokens (Tailwind class strings) ── */
export const pageBg = "min-h-screen bg-[#F8FAF7]";
export const cardClass =
  "rounded-2xl border border-gray-100 bg-white p-5 shadow-sm";
export const inputClass =
  "w-full min-h-[48px] rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-50 disabled:text-gray-500";
export const inputWarningClass =
  "w-full min-h-[48px] rounded-xl border-2 border-amber-300 bg-amber-50/40 px-4 py-3 text-base text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";
export const labelClass = "mb-2 block text-base font-medium text-gray-800";
export const helperClass = "mt-1.5 text-sm leading-relaxed text-gray-500";
export const primaryBtnClass =
  "flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300";
export const secondaryBtnClass =
  "flex min-h-[48px] w-full items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-base font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50";

/* ── Step progress ── */
type Step = { label: string };

export function StepProgress({
  steps,
  current,
}: {
  steps: Step[];
  current: number;
}) {
  return (
    <nav aria-label="Progress" className="mb-6">
      <ol className="flex items-center gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < current;
          const isActive = stepNumber === current;

          return (
            <li key={step.label} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {index > 0 && (
                  <div
                    className={`h-0.5 flex-1 ${isDone || isActive ? "bg-emerald-400" : "bg-gray-200"}`}
                  />
                )}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : isActive
                        ? "border-2 border-emerald-600 bg-emerald-50 text-emerald-700"
                        : "border border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  {isDone ? "✓" : stepNumber}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${isDone ? "bg-emerald-400" : "bg-gray-200"}`}
                  />
                )}
              </div>
              <span
                className={`mt-1.5 text-center text-xs leading-tight ${
                  isActive ? "font-semibold text-emerald-700" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ── Cards & banners ── */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`${cardClass} ${className}`}>{children}</section>;
}

export function AiNoticeBanner() {
  return (
    <div
      role="note"
      className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5"
    >
      <span className="text-lg leading-none" aria-hidden>
        ⚠️
      </span>
      <div>
        <p className="text-sm font-semibold text-amber-900">
          Please review carefully
        </p>
        <p className="mt-0.5 text-sm leading-relaxed text-amber-800">
          AI may not read your prescription perfectly. Check every field before
          saving.
        </p>
      </div>
    </div>
  );
}

export function AutoDetectedBadge() {
  return (
    <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
      Auto-detected
    </span>
  );
}

export function SectionHeader({
  title,
  description,
  badge,
}: {
  title: string;
  description?: string;
  badge?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && <p className={helperClass}>{description}</p>}
      </div>
      {badge}
    </div>
  );
}

/* ── Form fields ── */
export function FieldLabel({
  htmlFor,
  children,
  showAutoBadge = false,
  required = false,
}: {
  htmlFor?: string;
  children: ReactNode;
  showAutoBadge?: boolean;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
      {showAutoBadge && <AutoDetectedBadge />}
    </label>
  );
}

export function TextInput({
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  needsReview,
  min,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  needsReview?: boolean;
  min?: number;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      min={min}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={needsReview && !value.trim() ? inputWarningClass : inputClass}
    />
  );
}

export function TextArea({
  id,
  value,
  onChange,
  rows = 3,
  placeholder,
  disabled,
  needsReview,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  needsReview?: boolean;
}) {
  return (
    <textarea
      id={id}
      value={value}
      rows={rows}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`${needsReview && !value.trim() ? inputWarningClass : inputClass} resize-none`}
    />
  );
}

/* ── Buttons ── */
export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={primaryBtnClass}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={secondaryBtnClass}
    >
      {children}
    </button>
  );
}

/* ── Yes/No toggle ── */
export function YesNoToggle({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  required?: boolean;
}) {
  return (
    <div>
      <p className={labelClass}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </p>
      <div className="flex gap-3">
        {([true, false] as const).map((option) => {
          const selected = value === option;
          return (
            <button
              key={String(option)}
              type="button"
              onClick={() => onChange(option)}
              className={`min-h-[48px] flex-1 rounded-xl border-2 text-base font-semibold transition-colors ${
                selected
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-emerald-200"
              }`}
            >
              {option ? "Yes" : "No"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Chip select ── */
export function ChipSelect({
  label,
  description,
  options,
  selected,
  onToggle,
  required,
}: {
  label: string;
  description?: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <p className={labelClass}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </p>
      {description && <p className={helperClass}>{description}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`min-h-[44px] rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-emerald-200"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Loading spinner ── */
export function ScanningLoader() {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-emerald-50 text-2xl">
          📋
        </div>
      </div>
      <p className="mt-5 text-lg font-semibold text-gray-900">
        Reading your prescription…
      </p>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-500">
        This may take a moment. We are extracting patient details and medicines
        from your image.
      </p>
    </div>
  );
}

/* ── Hub card ── */
export function HubCard({
  step,
  title,
  description,
  icon,
  onClick,
  accent = "emerald",
}: {
  step?: string;
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  accent?: "emerald" | "blue" | "gray";
}) {
  const accentMap = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
    gray: "bg-gray-50 text-gray-600 ring-gray-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-all hover:border-emerald-200 hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ring-1 ${accentMap[accent]}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          {step && (
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              {step}
            </p>
          )}
          <h2 className="mt-0.5 text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
            {description}
          </p>
        </div>
        <span className="mt-1 text-gray-300" aria-hidden>
          →
        </span>
      </div>
    </button>
  );
}

/* ── Back link ── */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
    >
      ← {label}
    </a>
  );
}
