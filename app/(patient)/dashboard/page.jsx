export default function PatientDashboard() {
  return (
    <div className="container-custom py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Patient Dashboard</h1>
        <p className="text-xl text-foreground/60 mt-2">Welcome back to your health journey.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-2xl border border-border bg-card p-6 animate-pulse">
            <div className="h-4 w-1/3 bg-secondary rounded mb-4" />
            <div className="h-8 w-2/3 bg-secondary rounded mb-2" />
            <div className="h-4 w-full bg-secondary rounded" />
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 rounded-2xl border border-dashed border-border bg-secondary/20 text-center">
        <p className="text-foreground/60 italic">Real-time data integration coming in Phase 3.</p>
      </div>
    </div>
  );
}
