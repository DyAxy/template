"use client";

import React, { useEffect } from "react";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Component({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { isAuthChecked, isLoggedIn } = useAuth()

    useEffect(() => {
        if (isAuthChecked && !isLoggedIn) {
            router.push('/login')
        }
    }, [isAuthChecked, isLoggedIn])

    return (<>
        {children}
    </>);
}
