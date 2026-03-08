const ConfirmModal = ({
  title,
  message,
  confirmText,
  confirmColor,
  onConfirm,
  close,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-sm sm:max-w-md space-y-4">
        <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
        <p className="text-sm sm:text-base text-gray-600">{message}</p>
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
          <button
            onClick={close}
            className="w-full sm:w-auto px-4 py-2 border rounded-lg hover:bg-gray-100 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`${confirmColor} w-full sm:w-auto text-white px-4 py-2 rounded-lg text-sm sm:text-base`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
