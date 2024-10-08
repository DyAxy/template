'use client'

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { NextUIProvider } from '@nextui-org/react'
import { Toaster } from 'sonner';
import { Crisp } from "crisp-sdk-web";
import { AuthProvider } from "@/lib/auth";

import config from "@/config";

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
                <CrispProvider />
            </NextThemesProvider>
        </NextUIProvider>
    )
}

const CrispProvider = () => {
    const locale = useLocale()
    useEffect(() => {
        if (config.crispWebsiteId) {
            Crisp.configure(config.crispWebsiteId, {
                locale: locale ?? '',
            })
        }
    }, [locale]);
    return null;
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
        <Toaster richColors position="top-center" theme={theme as "light" | "dark" | "system"} />
    );
}