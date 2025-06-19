// src/components/ProtectedPage.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("http://localhost:8000/me", {
        credentials: "include",
      });
      if (!res.ok) router.replace("/login");
    };

    checkSession();
  }, []);

  return <>{children}</>;
}
