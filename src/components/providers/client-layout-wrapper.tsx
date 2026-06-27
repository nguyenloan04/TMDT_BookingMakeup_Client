"use client";

import { useEffect, useState } from "react";
import AuthProvider from "@/contexts/auth-context";
import { AuthDto } from "@/types/auth";
import { Toaster } from "@/components/ui/sonner";

export default function ClientLayoutWrapper({ initialUser, children }: { initialUser: AuthDto | null, children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <AuthProvider initialUser={initialUser}>
            {children}
            {mounted && <Toaster richColors closeButton />}
        </AuthProvider>
    );
}