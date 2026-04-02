import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const CATEGORIES = [
  { name: "Kitchen", icon: "🍳", slug: "kitchen" },
  { name: "Cleaning", icon: "🧹", slug: "cleaning" },
  { name: "Electronics", icon: "💡", slug: "electronics" },
  { name: "Tools", icon: "🔧", slug: "tools" },
  { name: "Garden", icon: "🌿", slug: "garden" },
  { name: "Bathroom", icon: "🚿", slug: "bathroom" },
];

const Index = () => {
  const [featured, setFeatured] = useState<Tables<"products">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .limit(8)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setFeatured(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
        <div className="container py-20 md:py-28 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground leading-tight">
            Equip Your Home<br />With The Best
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto">
            Quality home appliances, tools, and equipment. Everything you need to make your house a home.
          </p>
          <div className="flex gap-3 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/shop">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Truck, title: "Free Delivery", desc: "On orders over $50" },
            { icon: Shield, title: "Secure Shopping", desc: "Cash on delivery" },
            { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-4 p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Shop by Category</h2>
          <Link to="/categories" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/shop?category=${c.slug}`}
              className="flex flex-col items-center gap-2 p-6 rounded-lg border bg-card hover:border-primary hover:shadow-sm transition-all"
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="text-sm font-medium text-foreground">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
          <Link to="/shop" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-4 space-y-3 animate-pulse">
                <div className="aspect-square bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No products yet. Add some from the admin panel!
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
