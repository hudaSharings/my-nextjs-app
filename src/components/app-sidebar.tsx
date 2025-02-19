"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Database,
  FileClock,
  FileSpreadsheet,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { NavUser } from "@/components/navs/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { NavSetups } from "./navs/nav-setups";
import Link from "next/link";

import { UserInfo } from "@/lib/auth/sessionPayload";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ], 
  navSetups: [
    {
      title: "Setup",
      url: "#",
      icon: Settings2,
      isActive: true,
      items: [
        {
          title: "locations",
          url: "/location",
        },
        {
          title: "Shifts",
          url: "/shift",
        },
        {
          title: "Work days",
          url: "/workday",
        },
      ],
    },
    {
      title: "Master Data",
      url: "#",
      icon: Database,
      isActive: true,
      items: [
        {
          title: "Employees",
          url: "/employees",
        },
        {
          title: "User",
          url: "/users",
        },
        {
          title: "Clients",
          url: "/clients",
        },
        {
          title: "Projects",
          url: "/projects",
        },
        {
          title: "Work Types",
          url: "/worktypes",
        },
        {
          title: "Work Statuses",
          url: "/workstatus",
        },
      ],
    },
    {
      title: "Timesheet",
      url: "#",
      icon: FileSpreadsheet,
      isActive: true,
      items: [
        {
          title: "My Timesheet",
          url: "/myTimeSheet",
        },
        {
          title: "All Timesheet",
          url: "/allTimeSheet",
        },
      ],
    },
    {
      title: "Attendance",
      url: "#",
      icon: FileClock,
      isActive: true,
      items: [
        {
          title: "Punch In/Out",
          url: "/punchinpunchout",
        },
        {
          title: "My settings",
          url: "/mysetting",
        },
        {
          title: "Reports",
          url: "/reports",
        },
        {
          title: "Adjustments",
          url: "/adjustments",
        },
      ],
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({userInfo, ...props }: React.ComponentProps<typeof Sidebar>&{userInfo?:UserInfo}) {

  sessionStorage.setItem('user', JSON.stringify({
    name: userInfo?.name, 
    userName: userInfo?.userName,
    email: userInfo?.email,
  }));

  return (
    <Sidebar collapsible="icon" {...props} className="bg-card text-foreground">
      <SidebarHeader className="text-primary-foreground">
        {/* <TeamSwitcher teams={data.teams} /> */}
        <div className="flex w-full items-center justify-center">
          <img src="fts-logo.png" alt="FTS Logo" width="100px" height="50px" />
        </div>
      </SidebarHeader>
      <SidebarSeparator>
        <hr className="border-border" />
      </SidebarSeparator>
      <SidebarContent className="overflow-auto scrollbar-none bg-card text-foreground">
        <SidebarMenu className="ml-2 mt-2">
          <SidebarMenuItem className="hover:bg-muted hover:text-muted-foreground dashboard">
            <SidebarMenuButton tooltip="Dashboard">
              <LayoutDashboard className=" text-primary" />
              <Link
                href="/dashboard"
                className="text-foreground"
              >
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator>
          <hr className="border-border" />
        </SidebarSeparator>
        <NavSetups items={data.navSetups} />
      </SidebarContent>
      <SidebarFooter className=" text-muted-foreground">
        <NavUser user={userInfo} />
      </SidebarFooter>
      <SidebarRail className="bg-card text-foreground" />
    </Sidebar>
  );
}
