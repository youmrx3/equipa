import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

const CATEGORIES = ["kitchen", "cleaning", "electronics", "tools", "garden", "bathroom"];

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Tables<"products">[]>([]);
  const [orders, setOrders] = useState<Tables<"orders">[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", image_url: "", category: "kitchen" });

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
  };

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([fetchProducts(), fetchOrders()]).then(() => setLoading(false));
  }, [isAdmin]);

  if (authLoading) return <div className="container py-16 text-center text-muted-foreground">Loading...</div>;
  if (!user || !isAdmin) {
    return (
      <div className="container py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Admin Access Required</h1>
        <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        <Button asChild><Link to="/">Go Home</Link></Button>
      </div>
    );
  }

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", image_url: "", category: "kitchen" });
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      image_url: form.image_url.trim() || null,
      category: form.category,
    };

    if (editId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editId);
      if (error) { toast.error(error.message); return; }
      toast.success("Product updated");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Product added");
    }
    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Product deleted");
    fetchProducts();
  };

  const handleEdit = (p: Tables<"products">) => {
    setForm({ name: p.name, description: p.description || "", price: p.price.toString(), image_url: p.image_url || "", category: p.category });
    setEditId(p.id);
    setShowForm(true);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) { toast.error(error.message); return; }
    toast.success("Order status updated");
    fetchOrders();
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button variant={tab === "products" ? "default" : "outline"} onClick={() => setTab("products")}>
          Products
        </Button>
        <Button variant={tab === "orders" ? "default" : "outline"} onClick={() => setTab("orders")}>
          Orders
        </Button>
      </div>

      {tab === "products" && (
        <div className="space-y-4">
          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Product
          </Button>

          {showForm && (
            <div className="p-4 border rounded-lg bg-card space-y-4 animate-fade-in">
              <h3 className="font-semibold text-foreground">{editId ? "Edit Product" : "New Product"}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} maxLength={500} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={500} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>{editId ? "Update" : "Add"} Product</Button>
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-3 border rounded-lg bg-card">
                  <img src={p.image_url || "/placeholder.svg"} alt={p.name} className="h-12 w-12 rounded object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.category} · ${p.price.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
              {products.length === 0 && <p className="text-center text-muted-foreground py-8">No products yet.</p>}
            </div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-muted-foreground">No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="p-4 border rounded-lg bg-card space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">Order #{o.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">{o.full_name} · {o.phone}</p>
                      <p className="text-sm text-muted-foreground">{o.address}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground">${o.total_price.toFixed(2)}</span>
                      <Select value={o.status} onValueChange={(v) => updateOrderStatus(o.id, v)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
