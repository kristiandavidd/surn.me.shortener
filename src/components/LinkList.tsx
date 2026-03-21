"use client";

import { useState } from "react";
import { IconExternalLink, IconCopy, IconCheck, IconPencil } from "@tabler/icons-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LinkListProps {
  links: {
    id: string;
    shortCode: string;
    longUrl: string;
    title: string | null;
    createdAt: string;
  }[];
  onEdit?: (link: any) => void;
  editingId?: string;
}

export function LinkList({ links, onEdit, editingId }: LinkListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (shortCode: string, id: string) => {
    const url = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Short link copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
      {links.map((link) => {
        const isEditing = editingId === link.id;
        const isOtherEditing = editingId && editingId !== link.id;

        return (
          <div
            key={link.id}
            className={cn(
              "border rounded-[24px] p-5 flex items-center justify-between group transition-all duration-300",
              isEditing 
                ? "bg-primary text-[#F7F5E6] border-primary shadow-xl scale-[1.02]" 
                : isOtherEditing
                  ? "bg-gray-100/50 border-gray-100 opacity-50 grayscale"
                  : "bg-white border-gray-100 hover:border-primary/20 hover:shadow-md"
            )}
          >
            <div className="flex-1 min-w-0 mr-4">
              <div className={cn(
                "font-semibold text-sm md:text-lg truncate mb-0.5",
                isEditing ? "text-[#F7F5E6]" : "text-primary"
              )}>
                {link.title || "Untitled Link"}
              </div>
              <div className={cn(
                "text-[10px] md:text-sm truncate font-light",
                isEditing ? "text-[#F7F5E6]/70" : "text-brown/60"
              )}>
                surn.me/{link.shortCode}
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-2 transition-opacity",
              isEditing ? "opacity-100" : "opacity-100 md:opacity-0 group-hover:opacity-100"
            )}>
              {onEdit && (
                <button
                  title="Edit"
                  disabled={!!isOtherEditing}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                    isEditing 
                      ? "bg-[#F7F5E6] text-primary" 
                      : "bg-gray-50 hover:bg-primary hover:text-white"
                  )}
                  onClick={() => onEdit(link)}
                >
                  <IconPencil size={18} />
                </button>
              )}
              <button
                title="Copy"
                disabled={!!isOtherEditing}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                  copiedId === link.id
                    ? "bg-green-500 text-white"
                    : isEditing
                      ? "bg-[#F7F5E6]/20 text-[#F7F5E6] hover:bg-[#F7F5E6]/40"
                      : "bg-gray-50 hover:bg-primary hover:text-white"
                )}
                onClick={() => handleCopy(link.shortCode, link.id)}
              >
                {copiedId === link.id ? (
                  <IconCheck size={18} />
                ) : (
                  <IconCopy size={18} />
                )}
              </button>
              <a
                title="Open"
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                  isEditing
                    ? "bg-[#F7F5E6]/20 text-[#F7F5E6] hover:bg-[#F7F5E6]/40"
                    : "bg-gray-50 hover:bg-primary hover:text-white"
                )}
                href={`/${link.shortCode}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconExternalLink size={18} />
              </a>
            </div>
          </div>
        );
      })}
      {links.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center py-20">
          <p className="text-primary font-medium">No links shortened yet. Let&apos;s get started!</p>
        </div>
      )}
    </div>
  );
}
