interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function Sidebar({
  activePage,
  setActivePage,
}: SidebarProps) {
  const menuItems = [
    "Dashboard",
    "Jobs",
    "Resume",
    "Applications",
    "Interview",
  ];

  return (
    <div className="w-64 bg-slate-900 text-white p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-8">
        JobBuddy
      </h2>

      {menuItems.map((item) => (
        <button
          key={item}
          onClick={() => setActivePage(item)}
          className={`block w-full text-left px-4 py-3 rounded mb-2 ${
            activePage === item
              ? "bg-blue-600"
              : "bg-slate-800"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}