import { NavLink } from "react-router-dom";
import { FaTrophy, FaHistory, FaCog } from "react-icons/fa";

const links = [
  { to: "/", icon: FaTrophy, label: "Score" },
  { to: "/history", icon: FaHistory, label: "History" },
  { to: "/settings", icon: FaCog, label: "Settings" },
];

export default function Menu() {
  return (
    <div className="flex shrink-0 w-full justify-around items-center pt-3 px-6 bg-slate-800 border-t border-white/10" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-opacity ${
              isActive ? "opacity-100" : "opacity-40"
            }`
          }
        >
          <Icon size={24} />
          <span className="text-xs">{label}</span>
        </NavLink>
      ))}
    </div>
  );
}
