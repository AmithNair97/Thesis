import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/admin"
          className="flex items-center justify-center lg:justify-start gap-2 cursor-pointer"
        >
          <div className="flex flex-col items-center lg:flex-row lg:items-center gap-2">
            <Image src="/redpitaya.png" alt="logo" width={72} height={72} />
            <span className="hidden lg:block font-bold text-xl lg:text-2xl tracking-wide">
              Database
            </span>
          </div>
        </Link>
        <Menu />
      </div>

      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        {children}
      </div>
    </div>
  );
}
