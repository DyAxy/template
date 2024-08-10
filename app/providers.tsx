'use client'

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { NextUIProvider } from '@nextui-org/react'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from "@/lib/auth";

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    useEffect(() => {
        const hash = window.location.hash;
        if (hash.startsWith('#/')) {
            router.replace(hash.substring(1));
        }
    }, [router])

    return (
        <NextUIProvider navigate={router.push}>
            <NextThemesProvider attribute="class">
                <AuthProvider>
                    <ThemeProvider />
                    <ToastProvider />
                    {children}
                </AuthProvider>
            </NextThemesProvider>
        </NextUIProvider>
    )
}

const ThemeProvider = () => {
    const { theme, systemTheme, setTheme } = useTheme();

    useEffect(() => {
        if (theme !== 'system' && systemTheme === theme) {
            setTheme('system');
        }
    }, [theme, systemTheme, setTheme]);

    return null;
}
const ToastProvider = () => {
    const { theme } = useTheme();
    return (
        <Toaster position="top-center" theme={theme as "light" | "dark" | "system"} />
    );
}