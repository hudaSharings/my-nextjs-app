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
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavAttendance } from "./nav-attendace";
import { NavTimesheet } from "./nav-timesheet";
import { NavMasters } from "./nav-masters";
import { NavSetups } from "./nav-setups";

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
          title: "PunchIn / PunchOut",
          url: "#",
        },
        {
          title: "My settings",
          url: "#",
        },
        {
          title: "Reports",
          url: "#",
        },
        {
          title: "Adjustment Requests",
          url: "#",
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
          url: "#",
        },
        {
          title: "All Timesheet",
          url: "#",
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
          url: "#",
        },
        {
          title: "User",
          url: "#",
        },
        {
          title: "Clients",
          url: "#",
        },
        {
          title: "Projects",
          url: "#",
        },
        {
          title: "Work Types",
          url: "#",
        },
        {
          title: "Work Statuses",
          url: "#",
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
          url: "#",
        },
        {
          title: "Shifts",
          url: "#",
        },
        {
          title: "Work days",
          url: "#",
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
      <NavSetups items={data.navSetups} />
        <NavAttendance items={data.navAttendance} />
        <NavTimesheet items={data.navTimesheet} />
        <NavMasters items={data.navMasters} />
      
        {/*<NavMain items={data.navMain} />        
         <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
