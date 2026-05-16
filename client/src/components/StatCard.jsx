export const StatCard = ({ label, value, icon: Icon }) => (
  <div className="surface animate-rise group p-4 transition duration-300 hover:-translate-y-1 hover:border-black hover:shadow-[0_26px_70px_rgba(0,0,0,0.12)]">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        <p className="mt-2 text-3xl font-black text-black">{value ?? 0}</p>
      </div>
      {Icon ? (
        <div className="grid h-11 w-11 place-items-center rounded-lg border border-neutral-200 bg-neutral-50 transition duration-300 group-hover:bg-black group-hover:text-white">
          <Icon size={20} />
        </div>
      ) : null}
    </div>
  </div>
);
