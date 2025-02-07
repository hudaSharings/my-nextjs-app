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
} from "@/components/ui/sidebar";
import { NavAttendance } from "./navs/nav-attendace";
import { NavTimesheet } from "./navs/nav-timesheet";
import { NavMasters } from "./navs/nav-masters";
import { NavSetups } from "./navs/nav-setups";
import Link from "next/link";

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
  navAttendance: [
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
  navTimesheet: [
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
  ],
  navMasters: [
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent className="overflow-auto scrollbar-none" >        
          <SidebarMenu className="ml-2">
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Dashboard">
                <LayoutDashboard />
                <Link href="/dashboard">Dashboard</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <NavSetups items={data.navSetups} />
          <NavAttendance items={data.navAttendance} />
          <NavTimesheet items={data.navTimesheet} />
          <NavMasters items={data.navMasters} />
          
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
