import PhoneShell from "../components/PhoneShell";

export default function ShopPage() {
  return (
    <PhoneShell>
      <section className="flex-1 rounded-[26px] bg-white/55 p-5 backdrop-blur-sm">
        <h1 className="text-[30px] font-bold">Shop</h1>
        <p className="mt-2 text-sm">Items you can buy with your XP will appear here.</p>
      </section>
    </PhoneShell>
  );
}