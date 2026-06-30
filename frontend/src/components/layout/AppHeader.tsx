export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-700">
          S
        </div>

        <div>
          <h1 className="text-lg font-bold leading-tight">SalamatPo</h1>
          <p className="text-xs text-gray-500">
            Medicine access helper
          </p>
        </div>
      </div>
    </header>
  );
}