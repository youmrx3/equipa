import { Link } from "react-router-dom";

const CATEGORIES = [
  { name: "Kitchen", icon: "🍳", slug: "kitchen", desc: "Cookware, utensils, and appliances" },
  { name: "Cleaning", icon: "🧹", slug: "cleaning", desc: "Vacuums, mops, and supplies" },
  { name: "Electronics", icon: "💡", slug: "electronics", desc: "Smart home and gadgets" },
  { name: "Tools", icon: "🔧", slug: "tools", desc: "Power tools and hand tools" },
  { name: "Garden", icon: "🌿", slug: "garden", desc: "Garden tools and equipment" },
  { name: "Bathroom", icon: "🚿", slug: "bathroom", desc: "Bathroom accessories" },
];

const Categories = () => (
  <div className="container py-8 space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Categories</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          to={`/shop?category=${c.slug}`}
          className="p-6 border rounded-lg bg-card hover:border-primary hover:shadow-sm transition-all space-y-2"
        >
          <span className="text-4xl">{c.icon}</span>
          <h2 className="text-lg font-semibold text-foreground">{c.name}</h2>
          <p className="text-sm text-muted-foreground">{c.desc}</p>
        </Link>
      ))}
    </div>
  </div>
);

export default Categories;
