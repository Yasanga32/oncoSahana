export default function AISupport() {
  return (
    <div className="container-custom py-12 h-[calc(100vh-10rem)] flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">AI Health Assistant</h1>
        <p className="text-foreground/60">Get instant answers and emotional support.</p>
      </header>

      <div className="flex-grow flex flex-col gap-4 overflow-hidden border border-border rounded-2xl bg-card p-6 shadow-sm">
        <div className="flex-grow overflow-y-auto space-y-4 pr-4">
          <div className="flex justify-start">
            <div className="max-w-[80%] p-4 rounded-2xl bg-secondary text-sm">
              Hello! I'm your oncoSahana AI assistant. How can I help you today?
            </div>
          </div>
          
          <div className="flex justify-end">
            <div className="max-w-[80%] p-4 rounded-2xl bg-primary text-white text-sm">
              I'm feeling a bit overwhelmed by my treatment plan.
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <div className="flex-grow p-4 rounded-xl bg-secondary/50 border border-border text-foreground/40 text-sm">
            Ask me anything about your care...
          </div>
          <button disabled className="px-6 py-2 bg-primary/50 text-white rounded-xl font-medium cursor-not-allowed">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
