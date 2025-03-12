"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavSetups({
  items,
}: {
  items: {
    Title: string
    URL: string
    Icon?: string | LucideIcon
    isActive?: boolean
    StaticIcon ?: boolean
    items?: {
      Title: string
      URL: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Setup</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.Title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.Title}>
                  {item.URL && item.URL !== '#' ? 
                  <Link href={item.URL}>
                  {(item.StaticIcon  && item.Icon ? <item.Icon /> : <i className={'mx-2 ' + (item.Icon?item.Icon:item?.items?.length == 0?'tabler-ti ti-point-filled':'')}></i>)}                
                   <span>{item.Title}</span>
                   </Link>
                   : <>
                   {(item.StaticIcon && item.Icon ? <item.Icon /> : <i className={'mx-2 ' + (item.Icon?item.Icon:item?.items?.length == 0?'tabler-ti ti-point-filled':'')}></i>)}                  
                   <span>{item.Title}</span>
                   </>
                   }
                  {item.items && item.items.length > 0 && (
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.items && item.items.length > 0 && (
                <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.Title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.URL}>
                          <span>{subItem.Title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
              )}
              
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
