import { createFileRoute } from "@tanstack/react-router";
import { Award, Check, Plus, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  MATERIALS,
  STUDENT_DISCOUNT,
  courseById,
  materialById,
  naira,
  type Material,
} from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import {
  btn,
  Card,
  ChipTabs,
  CourseTile,
  MaterialCard,
  PageTitle,
  SectionTitle,
} from "@/components/academy/ui";

export const Route = createFileRoute("/student/store")({
  head: () => ({ meta: [{ title: "Store · DarlTech Academy" }] }),
  component: Store,
});

const TYPES = ["All", "E-book", "Template", "Project files", "Video bundle"] as const;

function Store() {
  const { cart, owned, toggleCart, checkoutCart } = useAcademy();
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [cartOpen, setCartOpen] = useState(false);
  const items = MATERIALS.filter((m) => type === "All" || m.type === type);
  const inCart = cart.map(materialById).filter(Boolean) as Material[];
  const subtotal = inCart.reduce((s, m) => s + m.price, 0);
  const discount = Math.round(subtotal * STUDENT_DISCOUNT);
  const total = subtotal - discount;

  const checkout = () => {
    checkoutCart();
    setCartOpen(false);
    toast.success("Purchase complete. Your materials are ready to download from your profile.");
  };

  const cartPanel = (
    <Card>
      <SectionTitle title="Your cart" />
      {inCart.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Your cart is empty. Add e-books, templates or project files.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {inCart.map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <CourseTile course={courseById(m.courseId)!} size={44} radius={10} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-bold">{m.title}</span>
                  <span className="text-xs text-muted-foreground">{m.type}</span>
                </span>
                <span className="text-sm font-bold">{naira(m.price)}</span>
                <button
                  type="button"
                  aria-label={`Remove ${m.title}`}
                  onClick={() => toggleCart(m.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="my-4 h-px bg-border" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>{naira(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>Student discount (10%)</span>
            <span>−{naira(discount)}</span>
          </div>
          <div className="mt-3 flex justify-between text-[17px] font-extrabold">
            <span>Total</span>
            <span>{naira(total)}</span>
          </div>
          <button type="button" onClick={checkout} className={cn(btn.big, "mt-4 h-12")}>
            Checkout
          </button>
        </>
      )}
    </Card>
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-w-0 flex-col gap-4">
        <PageTitle
          title="Course materials"
          sub="E-books, templates and project files made by DarlTech tutors."
        />
        <ChipTabs items={TYPES} value={type} onChange={setType} label="Material type" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {items.map((m) => {
            const have = owned.includes(m.id);
            const added = cart.includes(m.id);
            return (
              <MaterialCard
                key={m.id}
                material={m}
                action={
                  have ? (
                    <span className="flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-[#e3f3ea] text-[13px] font-bold text-[#16794a]">
                      <Check size={16} /> Owned
                    </span>
                  ) : (
                    <button
                      type="button"
                      aria-pressed={added}
                      onClick={() => toggleCart(m.id)}
                      className={cn(
                        "flex h-10 items-center justify-center gap-1.5 rounded-[10px] border text-[13px] font-bold",
                        added
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white hover:bg-surface",
                      )}
                    >
                      {added ? <Check size={16} /> : <Plus size={16} />}
                      {added ? "Added" : "Add to cart"}
                    </button>
                  )
                }
              />
            );
          })}
        </div>
        <Card className="flex items-start gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
            <Award size={20} />
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-sm font-bold">Included with your course</span>
            <span className="text-[13px] leading-relaxed text-muted-foreground">
              Lesson slides and worksheets are free once you enroll.
            </span>
          </span>
        </Card>
      </div>
      <aside className="hidden xl:block">{cartPanel}</aside>
      {cart.length > 0 && (
        <div className="fixed inset-x-0 bottom-[70px] z-20 flex items-center gap-3 border-t border-border bg-white px-4 py-3 xl:hidden">
          <span className="flex flex-1 flex-col">
            <span className="text-xs text-muted-foreground">
              {cart.length} items · student discount applied
            </span>
            <span className="text-[17px] font-extrabold">{naira(total)}</span>
          </span>
          <button type="button" onClick={() => setCartOpen(true)} className={btn.primary + " h-12"}>
            <ShoppingBag size={18} /> View cart
          </button>
        </div>
      )}
      {cartOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Your cart"
          className="fixed inset-0 z-50 flex items-end bg-primary/60 xl:hidden"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="w-full rounded-t-3xl bg-surface p-4 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            {cartPanel}
          </div>
        </div>
      )}
    </div>
  );
}
