'use client'

import { useEffect} from 'react';
import { useRouter } from 'next-nprogress-bar';
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { NextUIProvider } from '@nextui-org/react'
import { Toaster } from 'sonner';
import { Crisp } from "crisp-sdk-web";
import { AuthProvider } from "@/lib/auth";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

import config from "@/config";
import { useLocale } from 'next-intl';
import cfg from '@/config';

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
                    <CrispProvider />
                    <ProgressBar
                        height="4px"
                        options={{ showSpinner: false }}
                        shallowRouting
                        color={cfg.appColor}
                    />
                    {children}
                </AuthProvider>
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