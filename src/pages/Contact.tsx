import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => (
  <div className="container py-8 max-w-2xl space-y-8">
    <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
    <p className="text-muted-foreground">Have questions? We'd love to hear from you.</p>

    <div className="space-y-4">
      {[
        { icon: Mail, label: "Email", value: "support@houseequip.com" },
        { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
        { icon: MapPin, label: "Address", value: "123 Home Street, City, Country" },
      ].map((c) => (
        <div key={c.label} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <c.icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className="font-medium text-foreground">{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Contact;
