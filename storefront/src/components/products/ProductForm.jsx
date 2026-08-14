import { useState } from "react";
import { useTheme } from "../../theme/ThemeContext";
import Input from "../ui/Input";
import Button from "../ui/Button";

/**
 * Handles both create and edit:
 *   - no `product` prop  -> POST /api/v1/products (CreateProductRequest)
 *   - `product` provided -> PUT /api/v1/products/{id} (full Product)
 * `onDelete` (edit mode only) -> DELETE /api/v1/products/{id}
 */
export default function ProductForm({ product, onSubmit, onDelete }) {
  const { t } = useTheme();
  const isEdit = Boolean(product);
  const [form, setForm] = useState({
    title: product?.title ?? "",
    description: product?.description ?? "",
    category: product?.category ?? "",
    images: (product?.images ?? []).join(", "),
    discountPercentage: product?.discountPercentage ?? 0,
    rating: product?.rating ?? 0,
    price: product?.price ?? 0,
    discountPrice: product?.discountPrice ?? 0,
    thumbnail: product?.thumbnail ?? "",
    quantity: 0, // only used on create (CreateProductRequest.quantity)
  });
  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "number" ? Number(e.target.value) : e.target.value }));

  const submit = () => {
    const images = form.images.split(",").map((s) => s.trim()).filter(Boolean);
    if (isEdit) {
      onSubmit({ id: product.id, ...form, images });
    } else {
      onSubmit({ ...form, images });
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className={`mb-8 text-2xl font-black uppercase tracking-tighter ${t.text}`}>
        {isEdit ? "Edit product" : "Add product"}
      </h1>
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
          {!isEdit && <Input label="Stock quantity" type="number" value={form.quantity} onChange={set("quantity")} />}
        </div>
        <div className="flex gap-3">
          <Button className="flex-1" onClick={submit}>
            {isEdit ? "Save changes" : "Save product"}
          </Button>
          {isEdit && (
            <Button variant="secondary" className="border-rose-500 text-rose-400 hover:bg-rose-500/10" onClick={() => onDelete(product)}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
