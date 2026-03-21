"use client";

import { ICONS } from "@/lib/icons";

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  currentValue: string;
}

export function IconPickerModal({ isOpen, onClose, onSelect, currentValue }: IconPickerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#F7F5E6] border border-[#DCC9A6] rounded-[32px] p-6 w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h3 className="text-xl font-bold text-primary font-georgia">Pilih Icon</h3>
          <button onClick={onClose} className="text-brown hover:text-primary transition-colors">
            Tutup
          </button>
        </div>
        
        <div className="grid grid-cols-5 gap-3 overflow-y-auto pr-2 custom-scrollbar p-1">
          {ICONS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                onSelect(item.value);
                onClose();
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 ${
                currentValue === item.value 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                  : "bg-white text-brown border-[#DCC9A6]/30 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-1 font-medium truncate w-full text-center">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
