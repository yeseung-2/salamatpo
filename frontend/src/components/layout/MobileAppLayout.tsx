import AppHeader from "./AppHeader";
import BottomNav from "./BottomNav";

type MobileAppLayoutProps = {
  children: React.ReactNode;
};

export default function MobileAppLayout({ children }: MobileAppLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col border-x border-gray-100">
        <AppHeader />

        <main className="flex-1 px-5 pb-24 pt-4">
          {children}
        </main>

        <BottomNav />
      </div>
    </div>
  );
}