import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Home, ShoppingBag, Grid3X3, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/shop", label: "Shop", icon: ShoppingBag },
    { to: "/categories", label: "Categories", icon: Grid3X3 },
    { to: "/contact", label: "Contact", icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Home className="h-6 w-6" />
          HouseEquip
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
              <Shield className="h-4 w-4 mr-1" /> Admin
            </Button>
          )}
          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/cart")}>
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/orders")}>
                My Orders
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" className="hidden md:inline-flex" onClick={() => navigate("/login")}>
              <User className="h-4 w-4 mr-1" /> Login
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-2 animate-fade-in">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm">
              <l.icon className="h-4 w-4" /> {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm">
                My Orders
              </Link>
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm w-full text-left">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm">
              <User className="h-4 w-4" /> Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
