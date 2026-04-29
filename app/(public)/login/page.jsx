export default function LoginPage() {
  return (
    <div className="container-custom flex items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Welcome Back</h1>
          <p className="text-foreground/60 mt-2">Log in to your oncoSahana account</p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-secondary/50 border border-border text-center text-sm italic">
            Login form logic will be implemented in Phase 2.
          </div>
          <button disabled className="w-full py-3 bg-primary/50 text-white rounded-xl font-medium cursor-not-allowed">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
