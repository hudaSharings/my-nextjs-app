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

import { NavMain } from "@/components/navs/nav-main";
import { NavProjects } from "@/components/navs/nav-projects";
import { NavUser } from "@/components/navs/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
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
import { NavAttendance } from "./navs/nav-attendace";
import { NavTimesheet } from "./navs/nav-timesheet";
import { NavMasters } from "./navs/nav-masters";
import { NavSetups } from "./navs/nav-setups";
import Link from "next/link";

import { SessionPayload, UserInfo } from "@/lib/auth/sessionPayload";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/auth/session";
import { User } from "@/lib/types";

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

// const {data:userSession} = useQuery({
//   queryKey: ["userSession"],
//   queryFn: () => 
//      getSession()
// });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <div className="flex w-full items-center justify-center ">
        <img src="fts-logo.png" width="100px" height="50px"/>
        </div>
        
      </SidebarHeader>
      <SidebarSeparator><hr/></SidebarSeparator>
      <SidebarContent className="overflow-auto scrollbar-none">
        <SidebarMenu className="ml-2 mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Dashboard">
              <LayoutDashboard />
              <Link href="/dashboard">Dashboard</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator><hr/></SidebarSeparator>
        <NavSetups items={data.navSetups} />
     
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
