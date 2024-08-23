'use client'

import { useAuth } from "@/lib/auth";
import { Button } from "@nextui-org/react";

export default function Component() {
    const { logout } = useAuth();
    return (
        <Button
            onPress={logout}>
            1234
        </Button>
    )
}