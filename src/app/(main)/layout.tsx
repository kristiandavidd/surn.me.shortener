import { Header } from "@/components/Header";
import { Navbar } from "@/components/Navbar";
import { ModeProvider } from "@/components/ModeProvider";
import { getSession } from "@/lib/auth";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <ModeProvider>
      <div className="pt-20">
        <Header session={session} />
        {session && <Navbar />}
        {children}
      </div>
    </ModeProvider>
  );
}
