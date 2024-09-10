"use client";

import { useEffect } from "react";
import { Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { SwitchI18N } from "@/components/switchI18N";
import { SwitchTheme } from "@/components/switchTheme";
import Loading from "@/components/loading";
import { useAuth } from "@/lib/auth";

import cfg from "@/config";

export default function Component({ children }: { children: React.ReactNode }) {
    const { isAuthChecked, isLoggedIn, webConfig } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isAuthChecked && isLoggedIn) {
            router.push('/dashboard')
        }
    }, [isAuthChecked, isLoggedIn])

    if (!webConfig) return <div className="h-screen w-screen flex items-center justify-center">
        <Loading />
    </div>

    return (
        <div className="relative flex h-screen w-screen flex-col items-center justify-center">
            {children}
        </div >
    );
}