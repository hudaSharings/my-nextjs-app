import React, { useEffect, useState } from "react";
import PageController from "./pageController";
import { useParams } from "next/navigation";
import { pageService } from "@/services/pageService";
import { apps4xService, handleBarData } from "@/services/apps4xService";
import { useGroupedState } from "../../customState";
import { CheckSingleQuoteReplace } from "../../_Details/page";
declare var $:any;
type Props = {
  ViewType:'Root'|'Page'|'Popup'
  entityForm?:any;
  EntityId?: any;
  EntityObjectsId?: any;
  Parentgroup?:any ;
  RecId?: number;
  PageViewType?: string;
}
function PageForm ({ ViewType = 'Root' , entityForm = null ,EntityId,EntityObjectsId,Parentgroup,RecId,PageViewType}:Props) {
  const [showPageData, setShowPageData] = useState(false);
  const {stateObject,setState} = useGroupedState();

  useEffect(() => {
    const pageLoadSub = pageService.onPageLoad.subscribe((x) => {
      if(x){
        if(x.isLoad && !x.GroupIds){
          setShowPageData(false);
        setTimeout(() => {
        getPageData();
        }, 1);
        }
      }
    });


    const controllerSub = pageService.onControllerTrigger.subscribe((x) => {
      if (x.ControllerId) {
        let _controllers = x.ControllerId.split(",");
        stateObject?.contentGroups.forEach((row:any) =>
          row.Groups.forEach((group:any) => {
            if (_controllers.includes(group.ID)) {
              group.DisableController = x.Type === "Disable";
            }
            group.Tabs?.forEach((tab:any) => {
              if (_controllers.includes(tab.group?.ID)) {
                tab.group.DisableController = x.Type === "Disable";
              }
            });
          })
        );
      }
    });

    return () => {
      pageLoadSub.unsubscribe();
      controllerSub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (EntityObjectsId) {
      getPageForm();
    }
  }, [EntityObjectsId]);

  const getPageData = () => {
    let storeCriteria:any ={};
    if (!entityForm) {
      setShowPageData(true);
      return
    }

    entityForm.OnSaveDSType = entityForm?.OnSaveDSType;
    entityForm.OnSaveDSId = entityForm?.OnSaveDSId;
    entityForm.OnSaveDSData = entityForm?.OnSaveDSData;

    let _handleData:any = {};

    if (entityForm.OnSaveDSType == "Query") {

      if(entityForm.OnSaveDSId) {

        let Parameter = []
        if (entityForm.OnSaveDSData) {
          let _param = JSON.parse(entityForm.OnSaveDSData)
          Parameter = _param.QueryStrings.map((x:any) => {
            x.Value = handleBarData(x.Value,{...arguments[0],...stateObject,..._handleData});
            return x
          });
 
        }


        setState('PageData',null);
        apps4xService.getDyamicQueryData(entityForm.OnSaveDSId)
        .then((res: any) => {
          setState('PageData',res.Data?res.Data:res);
          setShowPageData(true);

        },
          (error) => {
            
          });
      }
      else {
        setShowPageData(true);
      }
    }
    else if (entityForm.OnSaveDSType == "Entity") {
      if (entityForm.OnSaveDSId) {

        let QueryString = [];
        if (entityForm.OnSaveDSData) {
          let _param = JSON.parse(entityForm.OnSaveDSData)
          QueryString = _param.QueryStrings.map((x:any) => {
            x.Value = handleBarData(x.Value,{...arguments[0],...stateObject,..._handleData});
            return x
          });
        }
        let _QueryString:any[] = [];
        if(QueryString.length > 0){
         
          QueryString.map((x:any) => {
            let filterobj = {
              Field: '',
              Operator: 'eq',
              TableAlias: '',
              Value: '',
            };
            filterobj.Field = x.Name,
            filterobj.Value = x.Value,
            _QueryString.push(filterobj);
          });
          storeCriteria.Where = [];
          storeCriteria.Where.push(..._QueryString);
        }
       
        apps4xService.getDynamicList(null,entityForm.OnSaveDSId).then(
          (res: any) => {
          setState('PageData',res.Data);
          setShowPageData(true);
              
          },
          (error) => {
            
          }
        );

      }
      else {
          setShowPageData(true);
      }
    }
    else if(entityForm.OnSaveDSType == "SQLConnector") {

      if(entityForm.OnSaveDSId){

        let _objectType = JSON.parse(entityForm.OnSaveDSData);

        let condition = null;
        if (_objectType.Condition && _objectType.Condition.length > 0) {
          let _condition = {
            Condition:_objectType.Condition,
            ConditionOperator:_objectType.ConditionOperator
          }
          condition = JSON.stringify(_condition)
          condition = handleBarData(condition);
        }

        apps4xService.getSqlDetails(entityForm.OnSaveDSId,_objectType.Type,_objectType.Name)
        .then((res: any) => {
          let _data: any = res.Data ? res.Data : res;
          setState('PageData',_data);
          setShowPageData(true);
        },
          (error) => {
          
          });

      }

    }
    else {

      let isQueryMandatory:boolean = true;

      if (entityForm.OnSaveDSData) {
        let RestData = JSON.parse(entityForm.OnSaveDSData)
        if(RestData.Path && RestData.Path.length>0){
          RestData.Path.forEach((x:any) => {
           let path = {
            [x.name]:handleBarData(x.Value,{_handleData,...arguments[0],...stateObject})
          }
          _handleData = {..._handleData,...path}
          })
          if(RestData.ApiUrl){
            RestData.ApiUrl = CheckSingleQuoteReplace(RestData.ApiUrl)
          }
        }
        RestData.ApiUrl =handleBarData(RestData.ApiUrl,{_handleData,...arguments[0],...stateObject});
        RestData.Body = handleBarData(RestData.Body,{_handleData,...arguments[0],...stateObject});
      if(RestData.QueryStrings){
        RestData.QueryStrings = RestData.QueryStrings.map((x:any) => {
          x.Value = handleBarData(x.Value,{_handleData,...arguments[0],...stateObject});
          return x
        });
      }
        if(RestData?.Headers){
        RestData.Headers = RestData.Headers.map((x:any) => {
          x.Value = handleBarData(x.Value,{_handleData,...arguments[0],...stateObject});
          return x
        });
      }

      RestData.QueryStrings.forEach((query:any) => {
        if(query.Mandatory && !query.Value) {
          isQueryMandatory = false;
        }
      });

      if (!isQueryMandatory) {
        setShowPageData(true);
        return;
      }
       
        apps4xService.dynamicAPi(RestData,null,storeCriteria,null,true)
          .then((res: any) => {
            setState('PageData',[]);
            
            let _data: any = res;
            if (RestData.ResponseView) {
              let _rview = RestData.ResponseView.split(".");
              _rview.forEach((x:any) => {
                _data = _data[x];
              });
            }
            setState('PageData',_data);
            setState('showPageData',true);

          },
            (error) => {
              
            });
      }
      else {
        setState('showPageData',true);
      }
    }
  }

  const getAllControls = (_contentGroups:any,_sideContentGroups:any) => {
    let _controls: any[] = [];
    let contentGroups = stateObject?.contentGroups;
    if(_contentGroups){
      contentGroups = _contentGroups;
    }
    let sideContentGroups = stateObject?.sideContentGroups;
    if(_sideContentGroups){
      sideContentGroups = _sideContentGroups;
    }
    contentGroups.forEach((row:any) => {
      row.Groups.forEach((group:any) => {

        if(Parentgroup) {
          group.ParentID = Parentgroup.ID; 
          group.ControlData.ParentID = Parentgroup.ID; 
        }

        if(!group.HideableControls){
          group.HideableControls = new PageControlsAction
          }
          if(Parentgroup && Parentgroup.HideableControls){
            group.HideableControls = Parentgroup.HideableControls
          }
        let _temp: any = { Id: group.ID, Description: group.ID };
        _controls.push(_temp);
        group.Tabs.forEach((tab:any) => {
          let _temp: any = { Id: tab.group.ID, Description: tab.group.ID };
          _controls.push(_temp);
        });
        group.Section.forEach((tab:any) => {
          let _temp: any = { Id: tab.group.ID, Description: tab.group.ID };
          _controls.push(_temp);
        });
      });
    });

    sideContentGroups.forEach((row:any) => {
      row.Groups.forEach((group:any) => {
        let _temp: any = { Id: group.ID, Description: group.ID };
        _controls.push(_temp);
        group.Tabs.forEach((tab:any) => {
          let _temp: any = { Id: tab.group.ID, Description: tab.group.ID };
          _controls.push(_temp);
        });
        group.Section.forEach((tab:any) => {
          let _temp: any = { Id: tab.group.ID, Description: tab.group.ID };
          _controls.push(_temp);
        });
      });
    });

    if (ViewType != 'Page') {
      pageService.AllControlList = _controls;
      pageService.pageScema = [];
      pageService.pageScema.push(...contentGroups);
    }
    else if (Parentgroup && PageViewType == 'viewer') {
      contentGroups.forEach((row:any) => {
        if (!pageService.pageScema.find(x => x.ID == row.ID))
          pageService.pageScema.push(row);
      });
    }
    setState('contentGroups',contentGroups);
    setState('sideContentGroups',sideContentGroups);
  }

  const checkAndSetGroupID = (_contentGroups:any) => {
    let contentGroups = stateObject?.contentGroups;
    if(_contentGroups){
      contentGroups = _contentGroups;
    }
    let _ID = 0;
    contentGroups.forEach((row:any) => {
      row.Groups.forEach((group:any) => {
        _ID = _ID + 1;
        if (!group.ID || group.ID == "1") {
          group.ID = "Group_" + _ID;
        }
      });
    });
    setState('contentGroups',contentGroups);

  }

  const checkAndControlData = (_contentGroups:any) => {  
    let contentGroups = stateObject?.contentGroups;
    if(_contentGroups){
      contentGroups = _contentGroups;
    } 
    contentGroups.forEach((row:any) => {
      row.Groups.forEach((group:any) => {
        if (!group.ControlData) {
          group.ControlData = new ControlData(group.ID)
        }
      });
    });
    setState('contentGroups',contentGroups);
  }
  const divResize = () => {
    
    $(function () {
      var startX: number,
        startWidth: number,
        $handle,
        $totalWidth,
        $table,
        $ele,
        $width,
        pressed = false;
     
     
      $(document).on({
        mousemove: function (event: { pageX: number; }) {
          $totalWidth = $("#total_screen").width();
          if (pressed) {
            
               $width = startWidth + (startX - event.pageX) 
  
            $("#page_right").width(startWidth + (startX - event.pageX ));
            $("#page_left").width( $totalWidth - $width);
           
          }
        },
        mouseup: function () {
          if (pressed) {
            
            pressed = false;
          }
        }
      }).on('mousedown', '.page_side_view > .resize_element', function (event: { pageX: any; }) { 
        $handle = $().parent();
        pressed = true;
        startX = event.pageX;
        startWidth = $handle.width();
        
      });
  
    });
  
   
    
  }
  const getPageDataSource = (ObjectData:any) => {
    let PageLoadData =[];
    if(ObjectData.DataSource && ObjectData.DataSource.length > 0){
      for (let i = 0; i < ObjectData.DataSource.length; i++) {
        let _dataSource = ObjectData.DataSource[i];
        PageLoadData.push({data:null,showPageData:false});
        // this.callPageDataSource(_dataSource,i);
      }
    }
    setState('PageLoadData',PageLoadData);

  }

  const getPageForm = async () => {
    entityForm = null;
    let ObjectData:any = {
      Canvas:[],
      DataSource:[]
    };
    setState('contentGroups',[]);
    setState('sideContentGroups',[]);


    let serviceMethod:any=null;
    if(RecId){
      serviceMethod = apps4xService.getSingleMetaObjectByRecId(RecId)
    }else if(EntityObjectsId){
      serviceMethod = apps4xService.getSingleMetaObject(EntityObjectsId)
    }
   serviceMethod.then((res: any) => {
      let metaObjectDetails = res;

      let _page:any = null;
      if(metaObjectDetails.Data) {
        _page = JSON.parse(metaObjectDetails.Data);
        _page.PageId = metaObjectDetails.Id;
        _page.RecId = metaObjectDetails.RecId;
      }
      if(!EntityObjectsId)
        EntityObjectsId = metaObjectDetails.Id;

      entityForm = _page;
      if(entityForm?.PageData){
        
        ObjectData = JSON.parse(entityForm?.PageData);
        let _contentGroups:any[]=[];
        let _sideContentGroups:any[]=[];
        if(ObjectData.Canvas[0].contentGroups || ObjectData.Canvas[0].sideContentGroups){
          _contentGroups = ObjectData.Canvas[0].contentGroups;

          for (let i = 0; i < _contentGroups.length; i++) {
            _contentGroups[i].ID=EntityObjectsId+"_"+i
          }
          _sideContentGroups = ObjectData.Canvas[0].sideContentGroups;
          }else{
            _contentGroups = ObjectData.Canvas;
          }
          setState('contentGroups',_contentGroups);
          setState('sideContentGroups',_sideContentGroups);
        if ((_contentGroups && _contentGroups.length > 0) ||
          (_sideContentGroups && _sideContentGroups.length>0)
        ) {
          checkAndSetGroupID(_contentGroups);
          checkAndControlData(_contentGroups);
          getAllControls(_contentGroups,_sideContentGroups);
          getPageData();
          getPageDataSource(ObjectData);
          // divResize();
        }
      }

    },
      (error:any) => {
        
        console.error(error.error);
      }
    );
  };

  return (
    <section id={`page_form_${EntityObjectsId}`} className="content">
      <div className="container-fluid">
        <section className="page-view p-0">
          {stateObject?.contentGroups && stateObject?.contentGroups.length > 0 && (
          <section id="total_screen" className="details-wrapper engine-dev request-details clearfix">
            <div id="page_left" className={`${stateObject?.sideContentGroups && stateObject?.sideContentGroups.length > 0 ? "pull-left page_main_view" : ""}` }>
              {stateObject?.contentGroups.map((row:any, rowIndex:number) => (
                <div key={rowIndex} className="content-row row">
                  {row.Groups.map((group:any, groupIndex:number) => (
                    <div
                      key={groupIndex}
                      className={`content_add col position-relative clearfix ${group.Class}`}
                      style={{ flexBasis: `${group.Width}%`, minWidth: `${group.Width}%` }}
                    >
                      {showPageData && !group.DisableController && (
                        stateObject?.PageData ? 
                        <PageController group={group} contentGroups={stateObject?.contentGroups} 
                        ViewType="viewer" entityForm={entityForm} PageData={stateObject?.PageData} PageLoadData={stateObject?.PageLoadData} />
                        :
                        <PageController group={group} entityForm={entityForm} ViewType="viewer"
                         contentGroups={stateObject?.contentGroups} PageData={null} PageLoadData={[]} />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {stateObject?.sideContentGroups.length > 0 && (
              <div id="page_right" className="pull-right page_side_view position-relative">
                <span className="resize_element"></span>
                <div className="p-l-10">
                  {stateObject?.sideContentGroups.map((row:any, rowIndex:number) => (
                    <div key={rowIndex} className="content-row row">
                      {row.Groups.map((group:any, groupIndex:number) => (
                        <div
                          key={groupIndex}
                          className={`content_add col position-relative clearfix ${group.Class}`}
                          style={{ flexBasis: `${group.Width}%`, minWidth: `${group.Width}%` }}
                        >
                          {showPageData && (
                            stateObject?.PageData ? 
                            <PageController group={group} contentGroups={stateObject?.sideContentGroups} 
                            ViewType="viewer" entityForm={entityForm} PageData={stateObject?.PageData} PageLoadData={stateObject?.PageLoadData} />
                            :
                            <PageController group={group} entityForm={entityForm} ViewType="viewer"
                             contentGroups={stateObject?.sideContentGroups} PageData={null} PageLoadData={[]} />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
)}
        </section>
      </div>
    </section>
  );
};

export default PageForm;
export class ControlData {
  constructor(id: string) {
    this.ID = id;
  }
  ID: string;
  GridSelectedData: any = null;
  FormData: any = null;
  ParentID?: any = null;
}
export class PageControlsAction{
  HideAction:boolean=false
  HideHeader:boolean=false
  HidePagination:boolean=false
}