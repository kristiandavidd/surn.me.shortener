import { getLinkTreeBySlug } from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getIconByValue } from "@/lib/icons";
import Link from "next/link";



export default async function LinkTreePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tree = await getLinkTreeBySlug(slug);

  if (!tree) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#DDDBCD] py-20 px-4">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        {/* Profile/Header */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-primary rounded-full shadow-xl flex items-center justify-center text-[#F7F5E6] text-4xl font-bold font-georgia border-4 border-[#F7F5E6] overflow-hidden">
            {tree.image ? (
              <img src={tree.image} alt={tree.title} className="w-full h-full object-cover" />
            ) : (
              tree.title[0]?.toUpperCase()
            )}
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-primary mb-2 font-georgia text-center">
          {tree.title}
        </h1>
        <p className="text-brown mb-12 text-center max-w-sm">
          {tree.description || "Check out my latest links below"}
        </p>

        {/* Links List */}
        <div className="w-full space-y-4">
          {tree.items.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full group"
            >
              <Button
                variant="outline"
                className="w-full py-8 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-[#F7F5E6] transition-all duration-300 rounded-2xl bg-[#F7F5E6]/50 backdrop-blur-sm shadow-md hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="flex items-center justify-center gap-3 w-full px-6">
                  {item.icon && (
                    <span className="shrink-0 transition-transform group-hover:scale-110">
                      {getIconByValue(item.icon)}
                    </span>
                  )}
                  <span className="truncate">{item.title}</span>
                  {/* Invisible spacer for centering text if icon exists */}
                  {item.icon && <span className="w-5 shrink-0 invisible"></span>}
                </div>
              </Button>
            </a>
          ))}
          
          {tree.items.length === 0 && (
            <div className="text-center text-brown/50 py-10">
              No links available yet.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-20">
          <Link href="/" className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <span className="text-brown font-semibold text-sm">created with</span>
            <span className="text-primary font-bold mb-1 font-georgia ">surn.me</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
