import { BehaviorSubject } from "rxjs";
class PageService {

    constructor() { }
  
    onControllerTrigger : BehaviorSubject<{ ControllerId:any,Type:'Enable'|'Load'|'Disable'|null}> = new BehaviorSubject<{ControllerId:any,Type:'Enable'|'Load'|'Disable'|null}>({ ControllerId:null,Type:null});
    onPageLoad: BehaviorSubject<{ isLoad: boolean ,GroupIds?:string | null}> = new BehaviorSubject<{
      isLoad: boolean; GroupIds?:string | null;
    }>({ isLoad: false , GroupIds:null});
  
    AllControlList:any[]=[];
      pageScema:any[] = [];
      PageAllData:any[] = [];
    
      getAllPageData() { 
        let _pagedata: any[] = [];
        this.pageScema.forEach(page => {
          page.Groups.forEach((group:any) => {
            if (group.ControlData) {
              group.ControlData.ID = group.ID;
              _pagedata.push(group.ControlData);
            }
  
            if(group.Tabs && group.Tabs.length>0){
              group.Tabs.forEach((tabs:any)=>{
                if (tabs.group.ControlData) {
                  tabs.group.ControlData.ID = tabs.group.ID;
                  _pagedata.push(tabs.group.ControlData);
                }
              })
            }
          });
        });
        this.PageAllData = _pagedata;
      }
  }
  export const pageService = new PageService();