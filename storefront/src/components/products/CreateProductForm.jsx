import { useState } from "react";
import { useTheme } from "../../theme/ThemeContext";
import Input from "../ui/Input";
import Button from "../ui/Button";

/**
 * Admin-only form. `form` matches Product-Service's CreateProductRequest
 * exactly: { title, description, category, images, discountPercentage,
 * rating, price, discountPrice, thumbnail, quantity }
 * POST /api/v1/products -> Product
 */
export default function CreateProductForm() {
  const { t } = useTheme();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    images: "",
    discountPercentage: 0,
    rating: 0,
    price: 0,
    discountPrice: 0,
    thumbnail: "",
    quantity: 0,
  });
  

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className={`mb-8 text-2xl font-black uppercase tracking-tighter ${t.text}`}>Add product</h1>
      <div className="space-y-4">
        <Input label="Title" value={form.title} onChange={set("title")} placeholder="Handloom Cotton Kurta" />
        <Input label="Description" value={form.description} onChange={set("description")} placeholder="Short product description" />
        <Input label="Category" value={form.category} onChange={set("category")} placeholder="clothing" />
        <Input label="Thumbnail URL" value={form.thumbnail} onChange={set("thumbnail")} placeholder="https://..." />
        <Input label="Image URLs (comma separated)" value={form.images} onChange={set("images")} placeholder="https://..., https://..." />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Price" type="number" value={form.price} onChange={set("price")} />
          <Input label="Discount price" type="number" value={form.discountPrice} onChange={set("discountPrice")} />
          <Input label="Discount %" type="number" value={form.discountPercentage} onChange={set("discountPercentage")} />
          <Input label="Rating" type="number" step="0.1" value={form.rating} onChange={set("rating")} />
          <Input label="Stock quantity" type="number" value={form.quantity} onChange={set("quantity")} />
        </div>
        <Button className="w-full" onClick={submit}>
          Save product
        </Button>
      </div>
    </div>
  );
}
