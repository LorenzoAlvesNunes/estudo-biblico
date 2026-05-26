export function StatCard({ label, value, detail, icon: Icon }) {
  return (
    <div className="glass group rounded-lg p-5 transition duration-300 hover:-translate-y-1 hover:border-gold-300/40">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-white/58">{label}</span>
        {Icon && (
          <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-gold-300">
            <Icon size={18} />
          </span>
        )}
      </div>
      <div className="text-3xl font-semibold text-halo">{value}</div>
      <p className="mt-2 text-sm text-white/52">{detail}</p>
    </div>
  );
}
