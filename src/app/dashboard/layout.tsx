export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex overflow-hidden">
      {children}
    </div>
  );
}
