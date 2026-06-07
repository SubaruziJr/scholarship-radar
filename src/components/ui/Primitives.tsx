import { classNames } from "@/lib/format";

type Tone = "lime" | "brand" | "sky" | "coral" | "faint";

const TONE_CLASSES: Record<Tone, string> = {
  lime: "bg-lime-soft text-brand-dark",
  brand: "bg-brand-light text-brand-dark",
  sky: "bg-sky-soft text-sky",
  coral: "bg-coral-soft text-coral-dark",
  faint: "bg-cream text-ink-soft border border-line",
};

export function Badge({
  children,
  tone = "faint",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={classNames("chip", TONE_CLASSES[tone], className)}>
      {children}
    </span>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "ghostLight" | "lime" | "danger";
  size?: "sm" | "md";
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-ring disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
  };
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark active:scale-[0.99] shadow-card",
    secondary: "bg-ink text-cream hover:bg-ink/90 active:scale-[0.99]",
    ghost: "bg-transparent text-ink hover:bg-ink/5",
    ghostLight: "bg-transparent text-cream hover:bg-cream/10",
    lime: "bg-lime text-brand-dark hover:bg-lime-dark active:scale-[0.99] shadow-card",
    danger: "bg-coral-soft text-coral-dark hover:bg-coral/20",
  };
  return (
    <button
      className={classNames(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={classNames("card", className)}>{children}</div>;
}

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-widest text-brand">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-semibold text-ink sm:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
