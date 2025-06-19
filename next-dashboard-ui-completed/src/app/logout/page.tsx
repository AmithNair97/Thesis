'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      // Clear backend session cookie
      await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include", // ⬅️ required to send cookies
      });

      // Clear frontend session
      sessionStorage.removeItem("user");

      router.push("/login");
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">
      Logging out...
    </div>
  );
}
