interface SectionDividerProps {
  number?: string;
  title: string;
  count?: number;
  dotColor?: string;
  children?: React.ReactNode;
}

export function SectionDivider({ number, title, count, dotColor, children }: SectionDividerProps) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex items-center gap-2.5 shrink-0">
        {dotColor && (
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
        )}
        <span className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-muted-foreground">
          {number ? `${number} // ${title}` : title}
        </span>
      </div>
      <div className="h-px flex-1 bg-border" />
      {count !== undefined && (
        <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-muted-foreground shrink-0">
          {count}
        </span>
      )}
      {children}
    </div>
  );
}
