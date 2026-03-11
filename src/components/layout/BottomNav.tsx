import { 
  Home, 
  ShoppingBag, 
  Stethoscope, 
  Wrench, 
  Users, 
  User, 
  Bell, 
  Search,
  Truck
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/src/utils/cn";

export default function BottomNav() {
  const navItems = [
    { icon: Home, label: "الرئيسية", path: "/" },
    { icon: ShoppingBag, label: "السوق", path: "/marketplace" },
    { icon: Truck, label: "توصيل", path: "/delivery" },
    { icon: Stethoscope, label: "الأطباء", path: "/doctors" },
    { icon: Users, label: "المجتمع", path: "/community" },
    { icon: User, label: "حسابي", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50 md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center p-2 rounded-lg transition-colors",
                isActive ? "text-emerald-600" : "text-gray-500 hover:text-emerald-500"
              )
            }
          >
            <item.icon size={20} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
