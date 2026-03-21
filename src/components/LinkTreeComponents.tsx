"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IconTrash, IconPlus, IconExternalLink, IconCopy, IconCheck, IconChevronDown, IconPencil, IconX, IconPhoto } from "@tabler/icons-react";
import { IconPickerModal } from "./IconPicker";
import { getIconByValue } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TreeListProps {
  trees: {
    id: string;
    slug: string;
    title: string;
    createdAt: string;
  }[];
  onEdit?: (id: string) => void;
  editingId?: string;
}

export function TreeList({ trees, onEdit, editingId }: TreeListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (slug: string, id: string) => {
    const url = `${window.location.origin}/f/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
      {trees.map((tree) => {
        const isEditing = editingId === tree.id;
        const isOtherEditing = editingId && editingId !== tree.id;

        return (
          <div
            key={tree.id}
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
                {tree.title}
              </div>
              <div className={cn(
                "text-[10px] md:text-sm truncate font-light",
                isEditing ? "text-[#F7F5E6]/70" : "text-brown/60"
              )}>
                surn.me/f/{tree.slug}
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
                  onClick={() => onEdit(tree.id)}
                >
                  <IconPencil size={18} />
                </button>
              )}
              <button
                title="Copy"
                disabled={!!isOtherEditing}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                  copiedId === tree.id
                    ? "bg-green-500 text-white"
                    : isEditing
                      ? "bg-[#F7F5E6]/20 text-[#F7F5E6] hover:bg-[#F7F5E6]/40"
                      : "bg-gray-50 hover:bg-primary hover:text-white"
                )}
                onClick={() => handleCopy(tree.slug, tree.id)}
              >
                {copiedId === tree.id ? (
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
                href={`/f/${tree.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconExternalLink size={18} />
              </a>
            </div>
          </div>
        );
      })}
      {trees.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center py-20">
          <p className="text-primary font-medium">No Link Trees yet. Create your first one!</p>
        </div>
      )}
    </div>
  );
}

export function LinkTreeForm({ 
  action, 
  initialData,
  onCancel 
}: { 
  action: (formData: FormData) => Promise<void>,
  initialData?: any,
  onCancel?: () => void
}) {
  const [items, setItems] = useState(
    initialData?.items 
      ? initialData.items.map((i: any) => ({ ...i, id: i.id || Date.now() + Math.random() })) 
      : [{ id: Date.now(), title: "", url: "", icon: "link" }]
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<number | string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image || null);
  const [loading, setLoading] = useState(false);

  // Sync initialData when it changes
  useEffect(() => {
    if (initialData) {
      setItems(initialData.items.map((i: any) => ({ ...i, id: i.id || Date.now() + Math.random() })));
      setPreviewImage(initialData.image || null);
    } else {
      setItems([{ id: Date.now(), title: "", url: "", icon: "link" }]);
      setPreviewImage(null);
    }
    setLoading(false);
  }, [initialData]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), title: "", url: "", icon: "link" }]);
  };

  const removeItem = (id: number | string) => {
    if (items.length > 1) {
      setItems(items.filter((item: any) => item.id !== id));
    }
  };

  const updateItemIcon = (id: number | string, icon: string) => {
    setItems(items.map((item: any) => item.id === id ? { ...item, icon } : item));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("File size too large", {
          description: "Maksimal ukuran file adalah 1MB",
        });
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form 
      onSubmit={() => setLoading(true)}
      action={action} 
      className="space-y-6 flex flex-col h-full overflow-hidden" 
      key={initialData?.id || 'new'}
    >
      {initialData && <input type="hidden" name="treeId" value={initialData.id} />}
      {initialData && <input type="hidden" name="existingImage" value={initialData.image || ""} />}
      
      <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar space-y-6">
        <div className="space-y-4">
          {/* Image Upload */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="relative group">
              <div className="w-24 h-24 bg-white border-2 border-dashed border-[#DCC9A6] rounded-full overflow-hidden flex items-center justify-center group-hover:border-primary transition-colors">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <IconPhoto className="text-[#DCC9A6] group-hover:text-primary transition-colors" size={32} />
                )}
                <input
                  type="file"
                  name="treeImage"
                  accept="image/*"
                  disabled={loading}
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-[#F7F5E6]">
                <IconPlus size={14} />
              </div>
            </div>
            <span className="text-xs text-brown font-medium">Upload Links Picture</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="treeTitle" className="text-brown font-medium ml-1">Tree Title</Label>
            <Input
              id="treeTitle"
              name="treeTitle"
              required
              disabled={loading}
              defaultValue={initialData?.title}
              placeholder="My Awesome Links"
              className="bg-white border-[#DCC9A6] focus:ring-primary h-12 rounded-xl text-base px-5 shadow-sm disabled:bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treeDescription" className="text-brown font-medium ml-1">Description</Label>
            <Input
              id="treeDescription"
              name="treeDescription"
              disabled={loading}
              defaultValue={initialData?.description}
              placeholder="Check out my latest links below"
              className="bg-white border-[#DCC9A6] focus:ring-primary h-12 rounded-xl text-base px-5 shadow-sm disabled:bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treeSlug" className="text-brown font-medium ml-1">Custom Slug</Label>
            <div className="flex items-center group">
              <div className="bg-[#DCC9A6]/20 px-4 h-12 flex items-center text-sm font-semibold text-primary border border-r-0 border-[#DCC9A6] rounded-l-xl group-focus-within:border-primary/50 transition-colors shrink-0">
                surn.me/f/
              </div>
              <Input
                id="treeSlug"
                name="treeSlug"
                required
                disabled={!!initialData || loading}
                defaultValue={initialData?.slug}
                placeholder="my-links"
                className="bg-white border-[#DCC9A6] focus:ring-primary h-12 rounded-none rounded-r-xl text-base px-5 shadow-sm w-full disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-brown font-bold ml-1 sticky top-0 bg-[#F7F5E6] z-10 py-1">Links</Label>
          {items.map((item: any, index: number) => (
            <div key={item.id} className="bg-white/50 p-4 rounded-2xl border border-[#DCC9A6]/50 space-y-3 relative group">
              <button
                type="button"
                disabled={loading}
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:hidden"
              >
                <IconTrash size={16} />
              </button>
              
              <div className="flex gap-3">
                <div className="shrink-0">
                  <Label className="text-[10px] text-brown/60 ml-1 mb-1 block">Icon</Label>
                  <input type="hidden" name={`itemIcon[]`} value={item.icon} />
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setActiveItemId(item.id);
                      setIsPickerOpen(true);
                    }}
                    className="w-12 h-12 bg-white border border-[#DCC9A6] rounded-xl flex items-center justify-center text-primary hover:border-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {getIconByValue(item.icon)}
                  </button>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-brown/60 ml-1 block">Title</Label>
                    <Input
                      name={`itemTitle[]`}
                      placeholder="Instagram"
                      required
                      disabled={loading}
                      defaultValue={item.title}
                      className="bg-white border-[#DCC9A6] h-10 rounded-lg text-sm disabled:bg-gray-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-brown/60 ml-1 block">URL</Label>
                    <Input
                      name={`itemUrl[]`}
                      type="url"
                      placeholder="https://instagram.com/..."
                      required
                      disabled={loading}
                      defaultValue={item.url}
                      className="bg-white border-[#DCC9A6] h-10 rounded-lg text-sm disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={addItem}
            className="w-full border-dashed border-2 border-[#DCC9A6] text-brown hover:bg-[#DCC9A6]/10 rounded-xl"
          >
            <IconPlus size={18} className="mr-2" /> Add More Link
          </Button>
        </div>
      </div>

      <IconPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        currentValue={items.find((i: any) => i.id === activeItemId)?.icon || "link"}
        onSelect={(icon) => activeItemId && updateItemIcon(activeItemId, icon)}
      />

      <div className="pt-4 mt-auto flex gap-3">
        {initialData && (
          <Button 
            type="button" 
            variant="outline"
            disabled={loading}
            onClick={onCancel}
            className="flex-1 h-14 border-2 border-[#DCC9A6] text-brown hover:bg-[#DCC9A6]/10 rounded-2xl font-bold text-lg transition-all"
          >
            <IconX size={20} className="mr-2" /> Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={loading}
          className={cn(
            "h-14 bg-primary text-[#F7F5E6] hover:bg-primary/90 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]",
            initialData ? "flex-[2]" : "w-full"
          )}
        >
          {loading ? "Memproses..." : (initialData ? "Save Changes" : "Create Link Tree")}
        </Button>
      </div>
    </form>
  );
}
