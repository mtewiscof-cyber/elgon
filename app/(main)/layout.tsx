import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import FixedShopButton from "@/components/FixedShopButton";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      {children}
      <FixedShopButton />
      <Footer />
    </>
  );
}
