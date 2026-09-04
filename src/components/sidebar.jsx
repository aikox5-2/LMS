import { NavLink } from "react-router-dom";
import { MENU_DATA } from "../config/menu";
import { cn } from "../lib/utils";
import colorLogo from "../assets/color-logo.svg";

const Sidebar = ({ isOpen = true }) => {
  const menuItems = MENU_DATA.admin;

  return (
    <aside
      data-state={isOpen ? "expanded" : "collapsed"}
      data-variant="inset"
      className={`
        fixed inset-y-4 left-4 z-50 w-70 bg-white rounded-4xl flex flex-col p-6
        transition-all duration-300 ease-in-out peer
        lg:fixed lg:top-6 lg:left-6 lg:z-auto lg:h-[calc(100vh-48px)] lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)] lg:translate-x-0"}
      `}
    >
      <div className="flex items-center justify-start gap-3 mb-10 pr-6">
        <img src={colorLogo} alt="Web Ujian" className="w-10 h-10 object-contain" />
        <div className="flex flex-col">
          <span className="font-bold text-[#344054] text-lg leading-tight whitespace-nowrap">
            Web Ujian
          </span>
          <span className="font-bold text-[#344054] text-lg leading-tight whitespace-nowrap">
            Online Sekolah
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1 flex-1 overflow-y-auto pr-2">
        <span className="text-[12px] font-bold text-[#98a2b3] tracking-widest uppercase mb-2 px-3">
          Menu
        </span>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${
                isActive
                  ? "bg-[#F0F9FF] text-[#3641F5] font-medium"
                  : "text-[#344054] hover:bg-gray-50 hover:text-black font-normal"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  weight={isActive ? "fill" : "regular"}
                  className={
                    isActive
                      ? "text-[#3641F5]"
                      : "text-[#667085] group-hover:text-[#344054]"
                  }
                />
                <span>{item.title}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-[#e4e7ec]">
        <div className="relative overflow-hidden rounded-2xl min-h-19 bg-[#465FFF]">
          <div className="relative z-10 flex items-center justify-between px-4 py-4 h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm">
                AD
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-white font-semibold text-sm leading-tight truncate max-w-27.5">
                  Admin Tutorial
                </span>
                <span className="text-white/70 text-[12px] capitalize">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export function SidebarInset({ className, ...props }) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col transition-all duration-300 ease-in-out",
        "lg:peer-data-[state=expanded]:ml-0",
        className,
      )}
      {...props}
    />
  );
}

export default Sidebar;