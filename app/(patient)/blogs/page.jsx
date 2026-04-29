export default function PatientBlogs() {
  return (
    <div className="container-custom py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight gradient-text">Supportive Insights</h1>
        <p className="text-xl text-foreground/60 mt-2">Find stories, advice, and community wisdom.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <article key={i} className="group rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-md">
            <div className="h-48 bg-secondary/30 group-hover:bg-secondary/50 transition-colors" />
            <div className="p-6">
              <div className="h-4 w-1/4 bg-primary/20 rounded mb-4" />
              <div className="h-6 w-3/4 bg-secondary rounded mb-2" />
              <div className="h-4 w-full bg-secondary/50 rounded" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
