"use client";

import React, { Suspense } from "react";

import { Image } from "@nextui-org/react";

import { SwitchI18N } from "@/components/switchI18N";
import { SwitchTheme } from "@/components/switchTheme";
import { useAuth } from "@/lib/auth";

import cfg from "@/config";
import Loading from "./loading";

export default function Component({ children }: { children: React.ReactNode }) {
    const { webConfig } = useAuth()

    if (!webConfig) return <Loading />

    return (
        <div className="relative flex h-screen w-screen flex-col items-center justify-center">
            <div className="absolute top-2 right-2 flex flex-row gap-2">
                <SwitchI18N iconOnly />
                <SwitchTheme iconOnly />
            </div>
            <div className="flex flex-col items-center pb-6 gap-2">
                {webConfig?.logo && (<Image src={webConfig.logo} alt={cfg.appName} width={48} height={48} radius="full" />)}
                <p className="text-xl font-medium">{cfg.appName}</p>
                <p className="text-small text-default-500">{webConfig?.app_description}</p>
            </div>
            {children}
        </div >
    );
}