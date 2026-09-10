import Button from "../../components/button";

const NotFound = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-[#3641f5]">404</h1>
      <p className="text-lg text-gray-700">Halaman tidak ditemukan</p>
      <Button variant="primary" onClick={() => window.history.back()}>
        Kembali
      </Button>
    </div>
  );
};

export default NotFound;