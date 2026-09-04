const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;