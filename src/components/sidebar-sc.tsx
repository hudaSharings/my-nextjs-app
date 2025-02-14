import { UserInfo } from "@/lib/auth/sessionPayload";
import { AppSidebar } from "./app-sidebar";
import { Sidebar } from "./ui/sidebar";
import { getSession } from "@/lib/auth/session";

export async function SidebarSC() {
    const session = await getSession()
    const userInfo = session?.userInfo??{} as UserInfo;
    return (
        <AppSidebar  userInfo={userInfo}  />
    )
}