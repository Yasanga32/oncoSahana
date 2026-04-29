const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border py-8 bg-card">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white font-bold text-xs">
              O
            </div>
            <span className="font-semibold text-foreground/80">oncoSahana</span>
          </div>
          
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} oncoSahana. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            <a href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
