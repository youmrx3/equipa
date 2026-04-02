import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", address: "" });

  if (!user) {
    return (
      <div className="container py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Please log in to checkout</h1>
        <Button asChild><Link to="/login">Login</Link></Button>
      </div>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <div className="container py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Your cart is empty</h1>
        <Button asChild><Link to="/shop">Shop Now</Link></Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container py-16 text-center space-y-4 animate-fade-in">
        <CheckCircle className="h-16 w-16 mx-auto text-accent" />
        <h1 className="text-2xl font-bold text-foreground">Order Confirmed!</h1>
        <p className="text-muted-foreground">Your order has been placed. Payment will be collected on delivery.</p>
        <div className="flex gap-3 justify-center">
          <Button asChild><Link to="/orders">View Orders</Link></Button>
          <Button variant="outline" asChild><Link to="/shop">Continue Shopping</Link></Button>
        </div>
      </div>
    );
  }

  const delivery = totalPrice >= 50 ? 0 : 5;
  const total = totalPrice + delivery;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          full_name: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          total_price: total,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((i) => ({
        order_id: order.id,
        product_id: i.product.id,
        quantity: i.quantity,
        price: i.product.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-8 max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
      <p className="text-sm text-muted-foreground">Payment Method: <strong className="text-foreground">Cash on Delivery</strong></p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required maxLength={100} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required maxLength={20} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Delivery Address</Label>
          <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required maxLength={255} />
        </div>

        <div className="p-4 border rounded-lg bg-card space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Items ({items.length})</span>
            <span className="text-foreground">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery</span>
            <span className="text-foreground">{delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-foreground">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Placing Order..." : "Confirm Order"}
        </Button>
      </form>
    </div>
  );
};

export default Checkout;
