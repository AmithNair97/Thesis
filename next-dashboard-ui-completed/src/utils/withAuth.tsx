"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (Component: React.ComponentType<any>) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const checkSession = async () => {
        const res = await fetch("http://localhost:8000/me", {
          credentials: "include",
        });

        if (!res.ok) {
          router.replace("/login");
        }
      };

      checkSession();
    }, []);

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
