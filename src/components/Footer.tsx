import { Home } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-card mt-auto">
    <div className="container py-8 text-center text-sm text-muted-foreground">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Home className="h-4 w-4 text-primary" />
        <span className="font-semibold text-foreground">HouseEquip</span>
      </div>
      <p>© {new Date().getFullYear()} House Equipment. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
