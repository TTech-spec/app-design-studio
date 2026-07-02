import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Camera, Plus, X } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, TextInput } from "@/components/mobile/ui";
import { useAuth, authErrorMessage } from "@/lib/auth-context";
import { NIGERIA_STATES, PRIMARY_CROPS } from "@/lib/agricon-data";

export const Route = createFileRoute("/add-product")({
  head: () => ({ meta: [{ title: "Agricon NG — Add product" }] }),
  component: AddProductPage,
});

function AddProductPage() {
  const navigate = useNavigate();
  const { createProduct, uploadProductImage } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cropType, setCropType] = useState(PRIMARY_CROPS[0]);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const [state, setState] = useState("Oyo");
  const [lga, setLga] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadProductImage(file);
      setImages([...images, url]);
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setUploadingImage(false);
    }
  }

  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!title || !quantity || !price || !state) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      await createProduct({
        title,
        description,
        crop_type: cropType,
        quantity: Number(quantity),
        unit,
        price_per_unit: Number(price),
        currency: "NGN",
        location_state: state,
        location_lga: lga,
        available_from: availableFrom || new Date().toISOString().split('T')[0],
        images,
        status: "active",
      });
      toast.success("Product listed successfully!");
      navigate({ to: "/marketplace" });
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell standalone title="Add product" showBottomNav={false} backTo="/home">
      <div className="space-y-4">
        <TextInput label="Product title" placeholder="e.g. Fresh Yam Tubers" value={title} onChange={setTitle} />
        <TextInput label="Description" placeholder="Describe your product..." value={description} onChange={setDescription} multiline />
        
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Crop type</label>
          <select
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            className="flex h-13 min-h-[52px] w-full appearance-none items-center rounded-2xl border-2 border-border bg-card px-4 text-left text-[15px] text-foreground outline-none focus:border-primary"
          >
            {PRIMARY_CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TextInput label="Quantity" placeholder="100" type="number" value={quantity} onChange={setQuantity} />
          <TextInput label="Unit" placeholder="kg" value={unit} onChange={setUnit} />
        </div>

        <TextInput label="Price per unit (₦)" placeholder="5000" type="number" value={price} onChange={setPrice} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="flex h-13 min-h-[52px] w-full appearance-none items-center rounded-2xl border-2 border-border bg-card px-4 text-left text-[15px] text-foreground outline-none focus:border-primary"
            >
              {NIGERIA_STATES.map((s) => <option key={s} value={s}>{s} State</option>)}
            </select>
          </div>
          <TextInput label="LGA" placeholder="Ibarapa" value={lga} onChange={setLga} />
        </div>

        <TextInput label="Available from" type="date" value={availableFrom} onChange={setAvailableFrom} />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Product images</label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <div key={i} className="relative shrink-0">
                <img src={img} alt={`Product ${i + 1}`} className="h-24 w-24 rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-card hover:border-primary">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
              {uploadingImage ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Camera className="h-6 w-6 text-muted-foreground" />
              )}
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={handleSubmit} loading={loading}>List product</PrimaryButton>
      </div>
    </MobileShell>
  );
}
