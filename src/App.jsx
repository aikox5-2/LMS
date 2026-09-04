import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Button from "./components/button";
import Input from "./components/input";
import Modal from "./components/modal";
import Layout from "./layouts/layout";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <div className="flex flex-col gap-4 w-96 justify-center p-8 items-center mx-auto min-h-[80vh]">
                <Input
                  label="name"
                  id="name"
                  placeholder="Masukkan nama anda"
                  required
                />
                <Button onClick={() => setIsModalOpen(true)}>Click Me</Button>
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-[#344054]">
                      Modal Example
                    </h2>
                    <p className="mt-2 text-sm text-[#667085]">
                      Ini hanya mockup modal sederhana.
                    </p>
                    <div className="mt-6 flex justify-end">
                      <Button onClick={() => setIsModalOpen(false)}>Close</Button>
                    </div>
                  </div>
                </Modal>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;