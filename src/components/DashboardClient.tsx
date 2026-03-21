"use client";

import { useState } from "react";
import { useMode } from "./ModeProvider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LinkList } from "@/components/LinkList";
import { LinkTreeForm, TreeList } from "@/components/LinkTreeComponents";
import { cn } from "@/lib/utils";
import { X as IconX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";

interface DashboardClientProps {
  links: any[];
  trees: any[];
  error?: string;
  success?: string;
  createShortUrl: (formData: FormData) => Promise<void>;
  handleCreateLinkTree: (formData: FormData) => Promise<void>;
  getTreeDetails: (id: string) => Promise<any>;
}

export function DashboardClient({
  links,
  trees,
  createShortUrl,
  handleCreateLinkTree,
  getTreeDetails,
}: DashboardClientProps) {
  const { mode } = useMode();
  const [editingTree, setEditingTree] = useState<any>(null);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    if (window.innerWidth < 1024 && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleEditTree = async (id: string) => {
    const details = await getTreeDetails(id);
    if (details) {
      setEditingTree(details);
      scrollToForm();
    }
  };

  const handleEditLink = (link: any) => {
    setEditingLink(link);
    scrollToForm();
  };

  const handleCancelEdit = () => {
    setEditingTree(null);
    setEditingLink(null);
  };

  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col h-full md:h-[calc(100vh-80px)] overflow-hidden pb-24 md:pb-8"
    >
      {/* Unified Section Container */}
      <div className="bg-[#F7F5E6] rounded-[32px] md:rounded-[40px] p-4 md:p-10 border border-[#DCC9A6] shadow-xl shadow-brown/10 flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 flex-1 min-h-0 overflow-y-auto lg:overflow-hidden custom-scrollbar pr-1 lg:pr-0">
          {/* Left Column: Form Section */}
          <div ref={formRef} className="flex flex-col h-auto lg:h-full min-h-0 scroll-mt-20 md:scroll-mt-24">
            <AnimatePresence mode="wait">
              <motion.div 
                key={mode}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full min-h-0"
              >
            {mode === "shortener" ? (
              // ... shortener form
              <div className="flex flex-col h-full min-h-0">
                <div className="mb-6 md:mb-8 shrink-0 text-center lg:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 md:mb-3 font-georgia">
                    {editingLink ? "Edit Link Title" : "Shorten Your Link"}
                  </h2>
                  <p className="text-brown text-sm md:text-base">
                    {editingLink 
                      ? `Editing surn.me/${editingLink.shortCode}` 
                      : "Just put your long annoying URL here. We'll handle it."}
                  </p>
                </div>

                <div className="flex-1 min-h-0">
                  <form
                    onSubmit={() => setLoading(true)}
                    action={createShortUrl}
                    className="flex flex-col h-full space-y-4 md:space-y-6"
                  >
                    {editingLink && <input type="hidden" name="linkId" value={editingLink.id} />}
                    
                    <div className="flex-1 overflow-y-visible lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar space-y-4 md:space-y-6">
                      <div className="space-y-1 md:space-y-2">
                        <Label
                          htmlFor="title"
                          className="text-brown font-medium ml-1 text-sm md:text-base"
                        >
                          Title 
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          required={!!editingLink}
                          defaultValue={editingLink?.title || ""}
                          placeholder="Link to my store"
                          className="bg-white border-[#DCC9A6] focus:ring-primary h-12 md:h-14 rounded-xl md:rounded-2xl text-sm md:text-base px-4 md:px-5 shadow-sm"
                        />
                      </div>

                      <div className="space-y-1 md:space-y-2">
                        <Label
                          htmlFor="longUrl"
                          className="text-brown font-medium ml-1 text-sm md:text-base"
                        >
                          Long URL
                        </Label>
                        <Input
                          id="longUrl"
                          name="longUrl"
                          type="url"
                          required
                          defaultValue={editingLink?.longUrl || ""}
                          placeholder="https://your-long-link/..."
                          className="bg-white border-[#DCC9A6] focus:ring-primary h-12 md:h-14 rounded-xl md:rounded-2xl text-sm md:text-base px-4 md:px-5 shadow-sm"
                        />
                      </div>

                      <div className="space-y-1 md:space-y-2">
                        <Label
                          htmlFor="shortCode"
                          className="text-brown font-medium ml-1 text-sm md:text-base"
                        >
                          Custom Alias
                        </Label>
                        <div className="flex items-center group">
                          <div className="bg-[#DCC9A6]/20 px-3 md:px-5 h-12 md:h-14 flex items-center text-xs md:text-sm font-semibold text-primary border border-r-0 border-[#DCC9A6] rounded-l-xl md:rounded-l-2xl group-focus-within:border-primary/50 transition-colors shrink-0">
                            surn.me/
                          </div>
                          <Input
                            id="shortCode"
                            name="shortCode"
                            type="text"
                            disabled={!!editingLink}
                            defaultValue={editingLink?.shortCode || ""}
                            placeholder="shorten-link"
                            className="bg-white border-[#DCC9A6] focus:ring-primary h-12 md:h-14 rounded-none rounded-r-xl md:rounded-r-2xl text-sm md:text-base px-4 md:px-5 shadow-sm disabled:bg-gray-100 disabled:text-brown/50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 md:pt-4 shrink-0 flex gap-3">
                      {editingLink && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={loading}
                          className="flex-1 h-12 md:h-14 border-2 border-[#DCC9A6] text-brown hover:bg-[#DCC9A6]/10 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all"
                        >
                          <IconX size={20} className="mr-2" /> Cancel
                        </Button>
                      )}
                      <Button
                        type="submit"
                        disabled={loading}
                        className={cn(
                          "h-12 md:h-14 bg-primary text-[#F7F5E6] hover:bg-primary/90 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]",
                          editingLink ? "flex-2" : "w-full"
                        )}
                      >
                        {loading 
                          ? "Memproses..." 
                          : (editingLink ? "Save Changes" : "Get Short URL")}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full min-h-0">
                <div className="mb-6 shrink-0 text-center lg:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 md:mb-3 font-georgia">
                    {editingTree ? "Edit Link Tree" : "Create Link Tree"}
                  </h2>
                  <p className="text-brown text-sm md:text-base">
                    {editingTree 
                      ? `Editing ${editingTree.title}` 
                      : "Combine all your links in one beautiful page."}
                  </p>
                </div>
                <div className="flex-1 min-h-0">
                  <LinkTreeForm 
                    action={handleCreateLinkTree} 
                    initialData={editingTree}
                    onCancel={handleCancelEdit}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Column: List Section */}
      <div className="bg-white/40 backdrop-blur-sm rounded-[24px] md:rounded-[32px] p-4 md:p-8 flex flex-col h-[400px] lg:h-full border border-white/50 shadow-inner overflow-hidden min-h-0 mt-6 lg:mt-0">
        <div className="flex items-center justify-between mb-6 md:mb-8 shrink-0">
          <h3 className="text-lg md:text-xl font-bold text-brown">
            {mode === "shortener" ? "Your Shorten Link" : "Your Link Trees"}
          </h3>
          <div className="bg-primary/10 text-primary px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider shrink-0">
            {mode === "shortener"
              ? `${links.length} Links`
              : `${trees.length} Trees`}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {mode === "shortener" ? (
            <LinkList 
              links={links} 
              onEdit={handleEditLink}
              editingId={editingLink?.id}
            />
          ) : (
            <TreeList 
              trees={trees} 
              onEdit={handleEditTree}
              editingId={editingTree?.id}
            />
          )}
        </div>
      </div>
    </div>
  </div>
</motion.main>
  );
}
