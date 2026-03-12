import OwnerSidebar from '@/components/dashboard/OwnerSidebar';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OwnerSidebar />
      <div className="flex-1 overflow-y-auto ml-0 lg:ml-64 transition-all duration-300">
        {children}
      </div>
    </>
  );
}
