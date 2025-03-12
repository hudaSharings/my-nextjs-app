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
  LayoutPanelLeftIcon
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
import { usePathname } from "next/navigation";
import { apps4xService, FilterDuplicateMetaobject, handleBarData } from "@/services/apps4xService";
import { AppId } from "@/app/api/baseApiApps4x";
import { useEffect, useState } from "react";
import { useGroupedState } from "@/app/(features)/apps4x/customState";

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
      StaticIcon: true,
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
      StaticIcon: true,
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
      StaticIcon: true,
    },
  ],
  navSetups: [
    {
      Title: "Setup",
      URL: "#",
      Icon: Settings2,
      StaticIcon: true,
      isActive: true,
      items: [
        { Title: "locations", URL: "/location" },
        { Title: "Shifts", URL: "/shift" },
        { Title: "Work days", URL: "/workday" },
      ],
    },
    {
      Title: "Master Data",
      URL: "#",
      Icon: Database,
      StaticIcon: true,
      isActive: true,
      items: [
        { Title: "Employees", URL: "/employees" },
        { Title: "User", URL: "/users" },
        { Title: "Clients", URL: "/clients" },
        { Title: "Projects", URL: "/projects" },
        { Title: "Work Types", URL: "/worktypes" },
        { Title: "Work Statuses", URL: "/workstatus" },
      ],
    },
    {
      Title: "Timesheet",
      URL: "#",
      Icon: FileSpreadsheet,
      StaticIcon: true,
      isActive: true,
      items: [
        { Title: "My Timesheet", URL: "/myTimeSheet" },
        { Title: "All Timesheet", URL: "/allTimeSheet" },
      ],
    },
    {
      Title: "Attendance",
      URL: "#",
      Icon: FileClock,
      StaticIcon: true,
      isActive: true,
      items: [
        { Title: "Punch In/Out", URL: "/punchinpunchout" },
        { Title: "My settings", URL: "/mysetting" },
        { Title: "Reports", URL: "/reports" },
        { Title: "Adjustments", URL: "/adjustments" },
      ],
    },
    {
      Title: "Apps4x",
      URL: "#",
      Icon: LayoutPanelLeftIcon,
      StaticIcon: true,
      isActive: true,
      items: [{ Title: "Home", URL: "/apps4x" }],
    },
  ],
  navMain: [
    {
      Title: "Playground",
      URL: "#",
      Icon: SquareTerminal,
      StaticIcon: true,
      isActive: true,
      items: [
        { Title: "History", URL: "#" },
        { Title: "Starred", URL: "#" },
        { Title: "Settings", URL: "#" },
      ],
    },
    {
      Title: "Models",
      URL: "#",
      Icon: Bot,
      StaticIcon: true,
      items: [
        { Title: "Genesis", URL: "#" },
        { Title: "Explorer", URL: "#" },
        { Title: "Quantum", URL: "#" },
      ],
    },
    {
      Title: "Documentation",
      URL: "#",
      Icon: BookOpen,
      StaticIcon: true,
      items: [
        { Title: "Introduction", URL: "#" },
        { Title: "Get Started", URL: "#" },
        { Title: "Tutorials", URL: "#" },
        { Title: "Changelog", URL: "#" },
      ],
    },
    {
      Title: "Settings",
      URL: "#",
      Icon: Settings2,
      StaticIcon: true,
      items: [
        { Title: "General", URL: "#" },
        { Title: "Team", URL: "#" },
        { Title: "Billing", URL: "#" },
        { Title: "Limits", URL: "#" },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      URL: "#",
      Icon: Frame,
      StaticIcon: true,
    },
    {
      name: "Sales & Marketing",
      URL: "#",
      Icon: PieChart,
      StaticIcon: true,
    },
    {
      name: "Travel",
      URL: "#",
      Icon: Map,
      StaticIcon: true,
    },
  ],
};

export function AppSidebar({userInfo, ...props }: React.ComponentProps<typeof Sidebar>&{userInfo?:UserInfo}) {

  const [systemMenu,SetSystemMenu] = useState<any[]>([]);

  sessionStorage.setItem('user', JSON.stringify({
    name: userInfo?.name, 
    userName: userInfo?.userName,
    email: userInfo?.email,
  }));
  const pathname = usePathname(); 
  
  const isApps4x = () => {
    return pathname.includes('apps4x');
  };

  const checkIsParent = (Parent: any, menu: any[]) => {
    let ret = false;
    let _childMenu = menu.filter(x => x.ParentKey == Parent.Key);
    if (_childMenu.length > 0)
      ret = true;
    return {ret , _childMenu};
  }

  const getChildmenu = (Parent: any, menu: any[]) => {

    let _childmenu: any[] = [];
    _childmenu = menu.filter(x => x.ParentKey == Parent.Key);
    return _childmenu

  }
  const { stateObject, setState } = useGroupedState();

  const getParentmenu = (menu: any[]) => {

    let _childmenu: any[] = [];
    _childmenu = menu.filter(x => !x.ParentKey);
    return _childmenu

  }

  const populateMenu = (_menu: any[]) => {

    _menu = _menu.map((x: any) => {
      // x.IsParent = false;
      let obj:any = {}
      obj = checkIsParent(x, _menu);
      x.IsParent = obj.ret;
      x.items = obj._childMenu;
      return x;
    });
    _menu = _menu.filter((x) => (x.IsParent || (!x.IsParent && x.ParentId == null)));

    _menu = _menu.sort((a: any, b: any) => {
      if (a.Alignment < b.Alignment) return -1;
      else if (a.Alignment > b.Alignment) return 1;
      else return 0;
    });

    return _menu
  }

  const getappsMenu = () => {
    apps4xService.getAllMetaObjectByObjectType(["Menu"],AppId,true).then(
      (res) => {
        let data: any[] = res.Data ? res.Data : res;
        let _customMenuData = data.filter(x => x.Type == "Menu"  && x.ParentId==AppId );
        data = FilterDuplicateMetaobject(data);
        let _collectionData = data.filter(x => x.Type == "Collection" && x.ParentId==AppId && JSON.parse(x.Data).CollectionType == "Multiple");
        let _singleEntityData = data.filter(x => x.Type == "Collection" && x.ParentId==AppId && JSON.parse(x.Data).CollectionType == "Single");
        let _entityData = data.filter(x => x.Type == "Entity");
        let _viewData = data.filter(x => x.Type == "Form");
        let _QueryData = data.filter(x => x.Type == "Query"  && x.ParentId==AppId );
        let _PageData = data.filter(x => x.Type == "Page"  && x.ParentId==AppId);
        let _FunctionData = data.filter(x => x.Type == "Function"  && x.ParentId==AppId );
        

        let _custommenu: any[] = [];
        let _collectionmenu: any[] = [];
        let __singleEntitymenu:any[]=[];
        let _entitymenu: any[] = [];
        let _viewmenu: any[] = [];
        let _querymenu: any[] = [];
        let _pagemenu: any[] = [];
        let _functionmenu: any[] = [];

        let CollectionListMenu = [];
        let SingleEntityListMenu = [];
        let CustomMenu = [];
        let EntityListMenu = [];
        let ViewListMenu = [];
        let PageListMenu = [];
        let QueryListMenu = [];
        let FunctionListMenu = [];
        let devModeListMenu = [];
        let SystemMenu = [];

        let _homemenu: any = {
          Key: "home_" + AppId, ParentKey: null,
          MenuType: "Home",
          Alignment:1,
          Icon: "tabler-ti ti-home", URL: "/apps4x",
          IsParent: false, Title: "Home",
        };

        // if (appId == "Studio") {
        //   _homemenu.ActionType = 'Click';
        // }

        // let _defaultmenu:any[] = [

        //   {
        //     Key: "MetaObject" , ParentKey: null,
        //     MenuType: "MetaObject",
        //     Icon: "tabler-ti ti-brand-codesandbox", URL: "/" + this.globalService.currentCompanyPath + "/",
        //     IsParent: false, Title: "Meta Object",ActionType: 'Click'
        //   },

        //   {
        //     Key: "menu_collection", ParentKey: null,
        //     MenuType: E_menuType.Custom,
        //     Alignment:2,
        //     Icon: "tabler-ti ti-table-row", URL: null,
        //     IsParent: true, Title: "Collection",
        //   },
        //   {
        //     Key: "menu_singleEntity", ParentKey: null,
        //     MenuType: E_menuType.Custom,
        //     Alignment:2,
        //     Icon: "tabler-ti ti-table", URL: null,
        //     IsParent: true, Title: "Entity",
        //   },
        //   {
        //     Key: "menu_workflow", ParentKey: null,
        //     MenuType: E_menuType.Custom,
        //     Alignment:3,
        //     Icon: "tabler-ti ti-brand-stackshare", URL: null,
        //     IsParent: true, Title: "Workflow",
        //   },
        //   {
        //     Key: "menu_query", ParentKey: null,
        //     MenuType: E_menuType.Custom,
        //     Alignment:4,
        //     Icon: "tabler-ti ti-brand-google-big-query", URL: null,
        //     IsParent: true, Title: "Query",
        //   },
        //   {
        //     Key: "menu_page", ParentKey: null,
        //     MenuType: E_menuType.Custom,
        //     Alignment:5,
        //     Icon: "tabler-ti ti-clipboard-text", URL: null,
        //     IsParent: true, Title: "Page",
        //   }

        // ];
        // _defaultmenu.unshift(_homemenu);
        
        // if (this.appId == "Studio") {
        //   let _functionFolderMenu: any = {
        //     Key: "menu_function", ParentKey: null,
        //     MenuType: E_menuType.Custom,
        //     Alignment:6,
        //     Icon: "tabler-ti ti-code", URL: null,
        //     IsParent: true, Title: "Function",
        //   }
        //   _defaultmenu.push(_functionFolderMenu);

        //   let _menuform: any = {
        //     Key: "Form_" + AppId, ParentKey: null, Icon: "tabler-ti ti-table-column", IsParent: false,
        //     Alignment: 7,
        //    Title: "Form", URL:null,ActionType:'Click',MenuType: E_menuType.EntityForm
        //   };
        //   _defaultmenu.push(_menuform);

        //   let _cutomFolderMenu: any = {
        //     Key: "Menu_" + AppId, ParentKey: null,
        //     MenuType: E_menuType.Menu,
        //     Alignment: 8,
        //     Icon: "tabler-ti ti-list-details", URL: null,
        //     IsParent: false, Title: "Menu",
        //     ActionType: 'Click'
        //   }
        //   _defaultmenu.push(_cutomFolderMenu);
        // }else if (this.globalService.currentAppId != "Studio" && this.globalService.devMode == true){
        //   let devmodelist:any[] =[
        //     {
        //       Key: "menu_collection", ParentKey: null,
        //       MenuType: E_menuType.Custom,
        //       Alignment:2,
        //       Icon: "tabler-ti ti-table-row", URL: null,
        //       IsParent: true, Title: "Collection",
        //     },
        //     {
        //       Key: "menu_singleEntity", ParentKey: null,
        //       MenuType: E_menuType.Custom,
        //       Alignment:2,
        //       Icon: "tabler-ti ti-table", URL: null,
        //       IsParent: true, Title: "Entity",
        //     },
        //     {
        //       Key: "menu_page", ParentKey: null,
        //       MenuType: E_menuType.Custom,
        //       Alignment:5,
        //       Icon: "tabler-ti ti-clipboard-text", URL: null,
        //       IsParent: true, Title: "Page",
        //     },
        //     {
        //       Key: "Menu", ParentKey: null,
        //       MenuType: E_menuType.Menu,
        //       Alignment: 2,
        //       Icon: "tabler-ti ti-list-details", URL: null,
        //       IsParent: false, Title: "Menu",
        //       ActionType: 'Click',MenuViewType:'PopUp'
        //     }
        //   ]
        //   this.devModeListMenu.push(...devmodelist)

        // }

        let _Custom_Menu :any[] =[];

        _customMenuData.forEach(_d => {
          if (_d.Data) {
            let menu: any = JSON.parse(_d.Data);
            menu.MenuId =_d.Id;

            if(menu.Type !="SubMenu" && menu.Authenticate !=99)
            _custommenu.push(menu);

            _Custom_Menu.push(menu);
          }
        });
        CustomMenu = _custommenu;
        apps4xService.currentAppMenuList = JSON.parse(JSON.stringify(_Custom_Menu));

        CustomMenu.map((cmenu: any) => {

          let _menu:any = cmenu;

          let _MenuType = _menu.MenuType;

          if (_menu.MenuId == _menu.ParentId)
            _menu.MenuId = "child_" + _menu.ParentId;

          cmenu.Key = _menu.MenuId;
          cmenu.ParentKey = _menu.ParentId;
          cmenu.IsParent = false;
          cmenu.CustomMenuType = _menu.MenuType;
          cmenu.Title = _menu.Title

                   
          if (_MenuType == "Folder") {
            cmenu.IsParent = true
          }
          else if (_MenuType == "Collection") {
            if (_menu.FormId) {
              _menu.URL = "/apps4x/"  + _menu.CollectionId + '/' + _menu.EntityId + '/View/' + _menu.FormId;
            }
            else if (_menu.EntityId) {
              _menu.URL ="/apps4x/"  + _menu.CollectionId + '/' + _menu.EntityId;
            }
            else
            _menu.URL = "/apps4x" + '/Collection/' + _menu.CollectionId;
          }

          else if (_MenuType == "Query") {
            _menu.URL = "/apps4x"  + '/query/' + _menu.FormId;
          }
          else if (_MenuType == "Page") {
            _menu.URL = "/apps4x"  + '/page/' + _menu.FormId;
          }
         
          else if (_MenuType == "Create") {
            _menu.URL ="/apps4x"  + '/' + _menu.CollectionId + '/' + _menu.EntityId + '/' + 'Create'
          }


          if(_menu.RootUrl) {
            _menu.URL ="/apps4x/Root/"  +_menu.RootUrl

          }
          
          if(_menu.MenuViewType=="PopUp"){
            cmenu.ActionType = 'Click';
            _menu.URL = null;
          }


          // if (this.appId == "Studio") {
          //   if(_menu.Type == "SubMenu" && !_menu.ParentId){
          //     cmenu.ParentKey = "SubMenu_"+AppId
          //   }
          //   else if (!_menu.ParentId) {
          //     cmenu.ParentKey = "Menu_" + AppId
          //   }
          //   cmenu.ActionType = 'Click';
          //   //x.MenuType = "Menu"
          // }
      
          cmenu.URL = handleBarData(_menu.URL);
          cmenu.MenuType = "Menu";
          return cmenu
        });

        CustomMenu = populateMenu(CustomMenu);

        _collectionData.forEach(_d => {
          if (_d.Data) {
            let collection: any = JSON.parse(_d.Data);

            if (!collection.CollectionId)
              collection.CollectionId = _d.Id;

            let _menuP: any = {
              Key: "Collection_" + collection.CollectionId,
              ParentKey: collection.IsWorkFlow ? "menu_workflow" : "menu_collection" , MenuType: "Collection",
              CollectionType: collection.CollectionType,
              Icon: collection.IsWorkFlow ? "tabler-ti ti-brand-stackshare" : "tabler-ti ti-table-row",
              IsParent: true, Title: collection.Name, Data: collection,
              URL: "/apps4x"  + "/Collection/" + collection.CollectionId
            };

            // if (this.appId == "Studio") {
            //   _menuP.ActionType = 'Click';
            // }


            _collectionmenu.push(_menuP);
       
            // let _menuT: any = {
            //   Key: "Collection_" + collection.CollectionId + "_Type", ParentKey: "Collection_" + collection.CollectionId,
            //   MenuType: E_menuType.Folder,
            //   Icon: "tabler-ti ti-table-plus", URL: null,
            //   IsParent: true, Title: "Type",
            // }
            // let _menuV: any = {
            //   Key: "Collection_" + collection.CollectionId + "_View", ParentKey: "Collection_" + collection.CollectionId,
            //   MenuType: E_menuType.Folder,
            //   Icon: "tabler-ti ti-folder", URL: null,
            //   IsParent: true, Title: "View",
            // }

            // _collectionmenu.push(_menuT);
            // _collectionmenu.push(_menuV);
          }
        });
        CollectionListMenu = _collectionmenu;

        _singleEntityData.forEach(_d => {
          if (_d.Data) {
            let singleEntity: any = JSON.parse(_d.Data);

            if (!singleEntity.CollectionId)
              singleEntity.CollectionId = _d.Id;
            let _menuP: any = {
              Key: "singleEntity_" + singleEntity.CollectionId,
              ParentKey: singleEntity.IsWorkFlow ? "menu_workflow" : "menu_singleEntity" , MenuType: "Collection",
              CollectionType: singleEntity.CollectionType,
              Icon: singleEntity.IsWorkFlow ? "tabler-ti ti-brand-stackshare" : "tabler-ti ti-table-row",
              IsParent: false, Title: singleEntity.Name, Data: singleEntity,
              URL: "/apps4x"  + "/" + singleEntity.CollectionId + "/" + _entityData.find(x => x.ParentId == singleEntity.CollectionId).Id
            };

            // if (this.globalService.currentAppId == "Studio") {
            //   _menuP.ActionType = 'Click';
            // }


            __singleEntitymenu.push(_menuP);
       
            // let _menuT: any = {
            //   Key: "singleEntity_" + singleEntity.CollectionId + "_Type", ParentKey: "singleEntity_" + singleEntity.CollectionId,
            //   MenuType: E_menuType.Folder,
            //   Icon: "tabler-ti ti-table-plus", URL: null,
            //   IsParent: true, Title: "Type",
            // }
            // let _menuV: any = {
            //   Key: "singleEntity_" + singleEntity.CollectionId + "_View", ParentKey: "singleEntity_" + singleEntity.CollectionId,
            //   MenuType: E_menuType.Folder,
            //   Icon: "tabler-ti ti-folder", URL: null,
            //   IsParent: true, Title: "View",
            // }

            // __singleEntitymenu.push(_menuT);
            // __singleEntitymenu.push(_menuV);
          }
        });
        SingleEntityListMenu = __singleEntitymenu;

        _entityData.forEach(_d => {
          if (_d.Data) {
            let entity: any = JSON.parse(_d.Data);
            if (!entity.EntityId)
              entity.EntityId = _d.Id;

            // ParentKey: "Collection_" + entity.CollectionId + "_Type",
            let _menuP: any = {
              Key: "Entity_" + entity.EntityId, ParentKey: "Collection_" + entity.CollectionId,          
              Icon: "tabler-ti ti-freeze-row", MenuType: "Entity", Data:entity,
              IsParent: false, Title: entity.Name, URL: "/apps4x"  + "/" + entity.CollectionId + "/" + entity.EntityId
            };
            // if (this.appId == "Studio") {
            //   _menuP.ActionType = 'Click';
            // }

            _entitymenu.push(_menuP);
          }
        });
        EntityListMenu = _entitymenu;


        // _viewData.forEach(_d => {
        //   if (_d.Data) {
        //     let form: IEntityForm = JSON.parse(_d.Data);
        //     if(form.Type == E_EntityView.Table || form.Type ==E_EntityView.Board
        //     ||form.Type ==E_EntityView.Card  ||form.Type ==E_EntityView.Chart
        //     ||form.Type ==E_EntityView.Chat  ||form.Type ==E_EntityView.TimeLine
        //     ||form.Type ==E_EntityView.TreeGrid  ||form.Type ==E_EntityView.TreeView
        //     ||form.Type ==E_EntityView.CustomTemplate  ||form.Type ==E_EntityView.Report){

        //     if(_d.ParentId && _d.ParentType == E_MetaobjectType.Collection && !form.CollectionId){
        //       form.CollectionId = _d.ParentId;
        //     }
        //     if(_d.ParentId && _d.ParentType == E_MetaobjectType.Entity && !form.EntityId){
        //       form.EntityId = _d.ParentId;
        //     }
        //     if (!form.FormId)
        //       form.FormId = _d.Id;

        //     let _menuP: any = {
        //       Key: "view_" + form.FormId, ParentKey: "Collection_" + form.CollectionId + "_View",
        //       Icon: "tabler-ti ti-table-row", MenuType: E_menuType.View,Data:form,
        //       IsParent: false, Title: form.Name, URL: "/" + this.globalService.currentCompanyPath + "/" + _appPrefix + "/" + form.CollectionId + "/View/" + form.FormId
        //     };
        //     if (this.appId == "Studio") {
        //       _menuP.ActionType = 'Click';
        //     }

        //     _viewmenu.push(_menuP);
        //   }
        // }
        // });
        // ViewListMenu = _viewmenu;


        // _QueryData.forEach(_d => {
        //   if (_d.Data) {
        //     let query: IQuery = JSON.parse(_d.Data);

        //     if (!query.QueryId)
        //       query.QueryId = _d.Id;

        //     let _menuP: any = {
        //       Key: "Page_" + query.QueryId, ParentKey: "menu_query", MenuType: E_menuType.Query,
        //       Icon: "tabler-ti ti-brand-google-big-query",Data:query,
        //       IsParent: false, Title: query.Name, URL: "/" + this.globalService.currentCompanyPath + "/" + _appPrefix + "/query/" + query.QueryId
        //     };
        //     if (this.appId == "Studio") {
        //       _menuP.ActionType = 'Click';
        //     }

        //     _querymenu.push(_menuP);
        //   }
        // });
        // this.QueryListMenu = _querymenu;

        // _PageData.forEach(_d => {
        //   if (_d.Data) {
        //     let page: IPage = JSON.parse(_d.Data);

        //     if (!page.PageId)
        //       page.PageId = _d.Id;

        //     let _menuP: any = {
        //       Key: "Page_" + page.PageId, ParentKey: "menu_page", MenuType: E_menuType.Page,
        //       Icon: "tabler-ti ti-clipboard-text",Data:page,
        //       IsParent: false, Title: page.Name, URL: "/" + this.globalService.currentCompanyPath + "/" + _appPrefix + "/page/" + page.PageId
        //     };
        //     if (this.appId == "Studio") {
        //       _menuP.ActionType = 'Click';
        //     }
        //     _pagemenu.push(_menuP);
        //   }
        // });
        // this.PageListMenu = _pagemenu;

        // _FunctionData.forEach(_d => {
        //   if (_d.Data) {
        //     let func: ILogic = JSON.parse(_d.Data);

        //     if (!func.LogicId)
        //       func.LogicId = _d.Id;

        //     let _menuP: any = {
        //       Key: "Page_" + func.LogicId, ParentKey: "menu_function", MenuType: E_menuType.Function,
        //       Icon: "tabler-ti ti-code",Data:func,
        //       IsParent: false, Title: func.Name, 
        //       URL: "/" + this.globalService.currentCompanyPath + "/" + _appPrefix + "/function/" + func.LogicId
        //     };
        //     if (this.appId == "Studio") {
        //       _menuP.ActionType = 'Click';
        //     }

        //     _functionmenu.push(_menuP);
        //   }
        // });
        // this.FunctionListMenu = _functionmenu;


        // if (this.appId == "Studio") {
        //   this.SystemMenu.push(..._defaultmenu, ...this.CollectionListMenu, ...this.SingleEntityListMenu ,...this.EntityListMenu, ...this.ViewListMenu, ...this.QueryListMenu, ...this.PageListMenu);
        //   this.SystemMenu.push(...this.FunctionListMenu, ...this.StudioMenu);
        //   this.tempMenudata.push(..._defaultmenu, ...this.CollectionListMenu, ...this.EntityListMenu, ...this.ViewListMenu, ...this.QueryListMenu, ...this.PageListMenu, ...this.CustomMenu);
        //   this.tempMenudata.push(...this.FunctionListMenu, ...this.StudioMenu);
        // }
        // else {
          SystemMenu = [];
          SystemMenu.push(_homemenu);
          // if(this.globalService.devMode){
          //   this.SystemMenu.push(...devModeListMenu,...this.CollectionListMenu, ...this.SingleEntityListMenu ,...this.EntityListMenu, ...this.PageListMenu)
          // }
          SystemMenu.push(...CustomMenu);
          
          SetSystemMenu(SystemMenu);
          // tempMenudata.push(_homemenu);
          // if(this.globalService.devMode){
          //   this.tempMenudata.push(...this.devModeListMenu, ...this.CollectionListMenu, ...this.SingleEntityListMenu ,...this.EntityListMenu, ...this.PageListMenu)
          // }
          // this.tempMenudata.push(...this.CustomMenu);
        // }



      },
      (error) => {
        // setTimeout(()=>{
        //   this.loader = false;
        // })
        console.log(error);
      });
  }

  useEffect(() => {
    if(isApps4x()){
    getappsMenu()
    }
  },[]);

  

  return (
    <Sidebar collapsible="icon" {...props} className="bg-card text-foreground">
      <SidebarHeader className="text-primary-foreground">
        {/* <TeamSwitcher teams={data.teams} /> */}
        <div className="flex w-full items-center justify-center">
          <img src="/fts-logo.png" alt="FTS Logo" width="100px" height="50px" />
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
        <NavSetups items={isApps4x()?systemMenu:data.navSetups} />
      </SidebarContent>
      <SidebarFooter className="">
        <NavUser user={userInfo} />
      </SidebarFooter>
      <SidebarRail className="bg-card text-foreground" />
    </Sidebar>
  );
}
