'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonColor?: string;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  confirmButtonColor = '#ef4444'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1e293b] border-2 border-[#ef4444] rounded-sm w-full max-w-xs p-6 relative pixel-border">
        <h3 className="text-lg font-bold mb-4 text-center text-[#ef4444] font-pixel">
          <i className="fa fa-exclamation-triangle mr-2"></i>{title}
        </h3>
        <p className="text-gray-300 text-sm mb-6 text-center font-mono">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-[#2d3748] hover:bg-gray-700 text-white py-2 px-4 rounded-sm transition pixel-button"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 text-white font-bold py-2 px-4 rounded-sm transition pixel-button`}
            style={{ backgroundColor: confirmButtonColor }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}