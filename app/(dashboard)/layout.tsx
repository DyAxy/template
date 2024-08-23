"use client";

import React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    Link,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Avatar,
    Badge,
    Image
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

import cfg from "@/config";
import { useAuth } from "@/lib/auth";
import { SwitchI18N } from "@/components/switchI18N";
import { SwitchTheme } from "@/components/switchTheme";

export default function Component({ children }: { children: React.ReactNode }) {
    const { webConfig } = useAuth()

    return (<>
        <Navbar
            classNames={{
                base: "lg:bg-transparent lg:backdrop-filter-none",
                item: "data-[active=true]:text-primary",
                wrapper: "px-4 sm:px-6",
            }}
            height="60px"
        >
            <NavbarBrand>
                <NavbarMenuToggle className="mr-2 h-6 sm:hidden" />
                {webConfig?.logo && (<div className="rounded-full bg-foreground text-background">
                    <Image src={webConfig.logo} alt={cfg.appName} width={40} height={40} />
                </div>)}
                <p className="ml-4 text-xl font-bold text-inherit">{cfg.appName}</p>
            </NavbarBrand>
            <NavbarContent
                className="ml-4 hidden h-12 w-full max-w-fit gap-4 rounded-full bg-content2 px-4 dark:bg-content1 sm:flex"
                justify="start"
            >
                <NavbarItem>
                    <Link className="flex gap-2 text-inherit" href="#">
                        主页
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link aria-current="page" className="flex gap-2 text-inherit" href="#">
                        Deployments
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link className="flex gap-2 text-inherit" href="#">
                        Analytics
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link className="flex gap-2 text-inherit" href="#">
                        Team
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link className="flex gap-2 text-inherit" href="#">
                        Settings
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent
                className="ml-auto flex h-12 max-w-fit items-center gap-1 rounded-full p-0 lg:bg-content2 lg:px-1 lg:dark:bg-content1"
                justify="end"
            >
                <NavbarItem className="hidden sm:flex">
                    <SwitchI18N iconOnly radius="full" />
                </NavbarItem>
                <NavbarItem className="hidden sm:flex">
                    <SwitchTheme iconOnly radius="full" />
                </NavbarItem>
                <NavbarItem className="px-2">
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <button className="mt-1 h-8 w-8 outline-none transition-transform">
                                <Badge
                                    className="border-transparent"
                                    color="success"
                                    content=""
                                    placement="bottom-right"
                                    shape="circle"
                                    size="sm"
                                >
                                    <Avatar size="sm" src="https://i.pravatar.cc/150?u=a04258114e29526708c" />
                                </Badge>
                            </button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">johndoe@example.com</p>
                            </DropdownItem>
                            <DropdownItem key="settings">My Settings</DropdownItem>
                            <DropdownItem key="team_settings">Team Settings</DropdownItem>
                            <DropdownItem key="analytics">Analytics</DropdownItem>
                            <DropdownItem key="system">System</DropdownItem>
                            <DropdownItem key="configurations">Configurations</DropdownItem>
                            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                            <DropdownItem key="logout" color="danger">
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
            </NavbarContent>

            {/* Mobile Menu */}
            <NavbarMenu>
                <NavbarMenuItem>
                    <Link className="w-full" color="foreground" href="#">
                        Dashboard
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem isActive>
                    <Link aria-current="page" className="w-full" color="primary" href="#">
                        Deployments
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link className="w-full" color="foreground" href="#">
                        Analytics
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link className="w-full" color="foreground" href="#">
                        Team
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link className="w-full" color="foreground" href="#">
                        Settings
                    </Link>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
        <div>

            {children}
        </div>
    </>);
}
