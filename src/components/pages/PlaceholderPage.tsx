interface Props {
  title: string;
}

export function PlaceholderPage({ title }: Props) {
  return (
    <div className="max-w-6xl">
      <h1 className="text-xl font-bold text-foreground tracking-tight mb-1">{title}</h1>
      <p className="text-muted-foreground text-sm">This section is under development.</p>
      <div className="mt-8 panel-card border-dashed p-16 flex flex-col items-center justify-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span className="text-2xl">🚧</span>
        </div>
        <span className="text-muted-foreground text-sm font-medium">Content for "{title}" will appear here.</span>
      </div>
    </div>
  );
}
