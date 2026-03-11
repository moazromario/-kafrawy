import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import BottomNav from "./BottomNav";

export default function Layout() {
  const location = useLocation();
  const isCommunity = location.pathname.startsWith("/community");
  const isHome = location.pathname === "/";
  const isMedical = location.pathname.startsWith("/medical");
  const isJobs = location.pathname.startsWith("/jobs");

  const shouldHide = isCommunity || isHome || isMedical || isJobs;

  return (
    <div className={`min-h-screen bg-gray-50 ${!shouldHide ? "pb-20 md:pb-0" : ""}`}>
      {!shouldHide && <Header />}
      <main className={!shouldHide ? "max-w-7xl mx-auto px-4 py-6" : ""}>
        <Outlet />
      </main>
      {!shouldHide && <BottomNav />}
    </div>
  );
}
