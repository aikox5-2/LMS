import { useState } from "react";
import SidebarMockup, { SidebarInset } from "../components/sidebar";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] relative transition-all duration-300">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="hidden lg:block lg:w-70 lg:ml-6 lg:flex-none" />

      <SidebarInset className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 px-4 lg:px-6 lg:pr-8 py-4 lg:py-6">
          <div className="z-30 w-full mb-6">
            <Header onMenuClick={toggleSidebar} />
          </div>
          <Outlet />
        </main>
      </SidebarInset>
    </div>
  );
};

export default Layout;