import AppTopbar from "@/components/layout/AppTopbar";
import AppSidebar from "@/components/layout/AppSidebar";
import Guard from "@/components/layout/Guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Guard allow={["ADMIN"]}>
      <AppTopbar />
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex gap-6 py-4 h-[calc(100dvh-3.5rem)] overflow-hidden">
          <AppSidebar />
          <main
            id="main"
            className="flex-1 h-full overflow-y-auto [scrollbar-gutter:stable]"
          >
            {children}
          </main>
        </div>
      </div>
    </Guard>
  );
}
