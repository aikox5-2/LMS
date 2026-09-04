import { Bell, List } from "@phosphor-icons/react";

const Header = ({ onMenuClick }) => {
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
          <h1 className="text-lg font-bold text-[#344054]">Dashboard</h1>
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
