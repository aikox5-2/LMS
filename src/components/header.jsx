import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, List } from "@phosphor-icons/react";
import whiteLogo from "../assets/white-logo.svg";

const Header = ({ onMenuClick }) => {
  const location = useLocation();

  const getBreadCrumbs = () => {
    const path = location.pathname;
    const crumbs = [{ label: "Menu", path: "/dashboard" }];

    if (path.includes("/dashboard")) {
      crumbs.push({ label: "Dashboard" });
    }
    else if (path.includes('/users')) {
      crumbs.push({ label: 'Kelola Pengguna', path: '/users'});
      if (path.includes('/create')) crumbs.push ({label: 'Tambah Pengguna'});
      if (path.includes('/edit')) crumbs.push ({label: 'Edit Pengguna'});
    }
    else if (path.includes('/courses')) {
      crumbs.push({ label: 'Kelola Kursus', path: '/courses'});
      if (path.includes('/create')) crumbs.push ({label: 'Tambah Kursus'});
      if (path.includes('/edit')) crumbs.push ({label: 'Edit Kursus'});
    }
    return crumbs;
  };

  const breadcrumbs = getBreadCrumbs();

  return (
    <header className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#344054] hover:bg-gray-100 lg:hidden"
          aria-label="Buka menu"
        >
          <List size={24} weight="bold" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-[#344054]">
            {breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard"}
          </h1>
          <p className="text-sm text-[#667085]">Selamat datang kembali</p>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#667085] hover:bg-gray-100"
        aria-label="Notifikasi"
      >
        <Bell size={21} />
      </button>
    </header>
  );
};

export default Header;