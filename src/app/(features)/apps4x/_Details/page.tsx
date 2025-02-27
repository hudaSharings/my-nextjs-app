import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import GroupField from "../_components/Fields";
import { apps4xService, checkConditionValidate, FilterDuplicateMetaobject } from "@/services/apps4xService";
import { useApi } from "@/app/api/useApi";
import { useEffect } from "react";
import { useGroupedState } from "../customState";
import { toast } from 'react-toastify';
type Props = {
    CloseDialog:() => void;
    openDialog:boolean;
    formData:any;
    EntityId:string;
    RecId:number
}

export default function DetailsPage({CloseDialog,openDialog,formData,EntityId,RecId}:Props) {
    const {stateObject,setState}= useGroupedState();
    const {theme}  = useTheme();
    const formDataConfig = formData?  JSON.parse(formData.Config):null;

    const GetDynamicSchema = async (init?:boolean) => {
   
      if (EntityId) {
        await apps4xService.getDynamicSchema(null, EntityId).then((res: any) => {
          let _data: any = res;
          if (EntityId) {
            let Entities: any[] = _data.Type.filter((x:any) => x.EntityId == EntityId);
            if (Entities.length > 1) {
  
              if (Entities.find((x) => x.Status == 'Active')) {
                setState('EntityDetails', Entities.filter(x => x.Status == 'Active')[0]);
              }
              else if (Entities.find((x) => x.Status == 'Draft')) {
                setState('EntityDetails',  Entities.filter(x => x.Status == 'Draft')[0]);
              }
              else {
                setState('EntityDetails',  Entities[Entities.length - 1]);
              }
  
            }
            else {
              setState('EntityDetails',  Entities[0]);
            }
  
          }
          // else if (this.CollectionId) {
          //   this.CollectionDetails = _data.Collection.filter((x: any) => x.CollectionId == this.CollectionId)[0];
          //   this.EntityFieldList = this.CollectionDetails.Fields;
          // }
          let _form: any[] = []
          let filteredForms = FilterDuplicateMetaobject(_data.Forms);
          filteredForms.forEach(x => {
            let Data: any = JSON.parse(x.Data)
            Data.FormId = x.Id;
            Data.RecId = x.RecId;
            Data.Status = x.Status;
            Data.Version = x.Version;
            _form.push(Data);
          })
  
          setState('ActionForm', _form.filter(x => x.Type == "Action"));
          setState('ActivityForm', _form.filter(x => x.Type == "Activity"));
  
          let _detailsform: any[] = [];
          _data.Forms.forEach((x:any) => {
            let Data: any = JSON.parse(x.Data)
            if (Data.Type == "Details") {
              Data.FormId = x.Id;
              Data.RecId = x.RecId;
              Data.Status = x.Status;
              Data.Version = x.Version;
              _detailsform.push(Data);
            }
          });
                    
          // if (this.group && this.group.PageEntity && this.group.PageEntity.FormId) {
          //   _detailsform = _detailsform.filter(x => x.FormId == this.group.PageEntity.FormId);
          // }
          // loadAction Form in useEffect  
          // this.EntityFieldList = this.EntityFieldList.sort((a:any, b:any) => {
          //   if (a.OrderId < b.OrderId) return -1;
          //   else if (a.OrderId > b.OrderId) return 1;
          //   else return 0;
          // });

          // this.SetColumnDefs();
  
        }),
          (error: any) => {
            
          }
      }
      // else {
      //   if (this.group && this.group.PageEntity && this.group.PageEntity.FormId) {
      //     this.EntityObjectsId = this.group.PageEntity.FormId;
      //     this.getEntityFormbyId(null,init);
      //   }
      //   else if(this.ConnectorId && this.EntityObjectsId)
      //     this.getEntityFormbyId(null,init);
      // }
    };
    
    const loadActionForm = () => {
      if (stateObject?.ActionForm && stateObject?.ActionForm.length > 0 && stateObject?.DetailsData) {
        setState('gridActionList',[]);
        setState('ActivityList',[]);
        let Forms:any[] = [...stateObject?.ActionForm,...stateObject?.ActivityForm];
        let _ActivityList:any[]=[];
        let _gridActionList:any[]=[];
        Forms.forEach((form: any) => {
          let _action: any = { Id: form.FormId, Name: form.Name, MethodType: "Action", NoRefresh: false,IconName:null, }
          if (form.Config) {
            let data: any = JSON.parse(form.Config);
            setState('showSwal',data.showSwal);
            if (data?.IsNoActionRefresh)
            _action.NoRefresh = data?.IsNoActionRefresh;
            _action.IconName = data.IconName;
            _action.Order = data.Order;
            _action.IconName = data.IconName;
            _action.Name = data.Title?data.Title:_action.Name;
  
            if (data?.ActionVisible && data.ActionCondition && data.ActionCondition.Condition && data.ActionCondition.Condition.length > 0) {
              let isConditionPassed: boolean = onRulesConditionCheck(data.ActionCondition, stateObject?.DetailsData);
              if (isConditionPassed) {
                if (data.ActionType == "Activity") {
                  _ActivityList.push(_action);
                }
                else
                _gridActionList.push(_action);
              }
            } else {
              if (data.ActionType == "Activity" || form.Type == "Activity") {
                _ActivityList.push(_action);
                }
                else
                _gridActionList.push(_action);
            }
          } else {
            _gridActionList.push(_action);
          };
        });
      
        if (formDataConfig?.ActionList.length > 0) {
          _gridActionList = _gridActionList.filter(obj =>
            formDataConfig.ActionList.some((t:any) => t.FormId === obj.Id)
          );
        }
  
        if (formDataConfig?.CustomAction && formDataConfig.CustomActionList.length > 0) {
          let _customActionlist = stateObject?.ActionForm.filter((obj:any) =>
            formDataConfig.CustomActionList.some((t:any) => t.FormId === obj.FormId)
          );
          if (_customActionlist) {
            _gridActionList = [];
            _customActionlist.forEach((form: any) => {
              let _action: any = { Id: form.FormId, Name: form.Name, MethodType: "Action", NoRefresh: false }
              if (form.Config) {
                let data: any = JSON.parse(form.Config);
                setState('showSwal',data.showSwal);
                if (data?.IsNoActionRefresh)
                  _action.NoRefresh = data?.IsNoActionRefresh;
                _action.IconName = data.IconName;
                _action.Order = data.Order;
                _action.Name = data.Title?data.Title:_action.Name;
      
                if (data?.ActionVisible && data.ActionCondition && data.ActionCondition.Condition && data.ActionCondition.Condition.length > 0) {
                  let isConditionPassed: boolean = onRulesConditionCheck(data.ActionCondition, stateObject?.DetailsData);
                  if (isConditionPassed) {
                    _gridActionList.push(_action);
                  }
                } else {
                 
                  _gridActionList.push(_action);
                }
              } else {
                _gridActionList.push(_action);
              };
            });
            setState('gridActionList',_gridActionList)
  
          }
          
  
        }
  
        if (formDataConfig?.IsAction == false) {
          _gridActionList = [];
        }
  
        _ActivityList = _ActivityList.sort((a, b) => {
          if (a.Order < b.Order) return -1;
          else if (a.Order > b.Order) return 1;
          else return 0;
        });

        setState('gridActionList',_gridActionList);
        setState('ActivityList',_ActivityList);
  
      }
    }
    
    const {data ,loading ,error , execute:getDynamicDetails} = useApi<any>(() => apps4xService.getDynamicDetails(EntityId,RecId));

    const setDynamicDetailsData = (_data:any) => {
      loadActionForm();
    }

    const getDatabyDatasource = async () => {
      let _handleData:any = {}
      if (formData.OnSaveDSType == "Query") {
    
        if(formData.OnSaveDSId) {
          let Parameter: any[] = [];

          if (formData) {
            let _QueryData = JSON.parse(formData.OnSaveDSData);
            let _param = _QueryData.DSQueryParamsList;

            Parameter = _param.map((x: any) => {
              x.Value = handleBarData(x.Value, {
                ...arguments[0],
                stateObject,
                _handleData,
              });
              return x;
            });
          }
            await apps4xService.getDyamicQueryData(formData.OnSaveDSId, Parameter).then((data) => {
              setState("DetailsData", data.Data ? data.Data : data);
              setDynamicDetailsData(data.Data ? data.Data : data);
            }).catch((error) => {
              console.error("Error fetching data:", error);
            });
        }
        
      }
      else if (formData.OnSaveDSType == "Entity") {
        if (formData.OnSaveDSId) {
    
          let EntityData = {
            Condition: {
              Condition: [],
              ConditionOperator: 1
            },
            QueryStrings: [],
            ResponseView: null,
            ActionType: "GET"
          }
          EntityData = JSON.parse(formData.OnSaveDSData);
          let data: any = {};
          EntityData.QueryStrings.forEach((x:any) => {
            x.Value =handleBarData(x.Value,{...arguments[0],...stateObject,_handleData});
            if (x.Value)
              data[x.name] = x.Value;
          });
    
          if (EntityData.ActionType == "GET") {

              await apps4xService.getDynamicList(null,formData.OnSaveDSId).then((data) => {
                setState("DetailsData", data.Data ? data.Data : data);
              setDynamicDetailsData(data.Data ? data.Data : data);
              }).catch((error) => {
                console.error("Error fetching data:", error);
              });
    
          } else {
            await apps4xService.getDynamicDetails(formData.OnSaveDSId, RecId).then((data) => {
              setState("DetailsData", data.Data ? data.Data : data);
              setDynamicDetailsData(data.Data ? data.Data : data);
            }).catch((error) => {
              console.error("Error fetching data:", error);
            });
          }
        }
        
      }
      else if(formData.OnSaveDSType == "SQLConnector") {
    
        if(formData.OnSaveDSId){
    
          let _objectType = JSON.parse(formData.OnSaveDSData);
    
          let condition = null;
          if (_objectType.Condition && _objectType.Condition.length > 0) {
            let _condition:any = {
              Condition:_objectType.Condition,
              ConditionOperator:_objectType.ConditionOperator
            }
            condition = JSON.stringify(_condition)
            condition = handleBarData(condition,_handleData);
          }

          await apps4xService.getSqlDetails(formData.OnSaveDSId,_objectType.Type,_objectType.Name)
          .then((data) => {
            setState("DetailsData", data.Data ? data.Data : data);
            setDynamicDetailsData(data.Data ? data.Data : data);

          }).catch((error) => {
            console.error("Error fetching data:", error);
          });
    
        }
    
      }
      else {
    
        if (formData.OnSaveDSData) {
          let RestData = JSON.parse(formData.OnSaveDSData)
              if(RestData.Path && RestData.Path.length>0){
                RestData.Path.forEach((x:any) => {
                 let path = {
                  [x.name]:handleBarData(x.Value,{...arguments[0],...stateObject,_handleData})
                 }
      
              _handleData = {..._handleData,...path}
                })
                RestData.ApiUrl = handleBarData(RestData.ApiUrl,{...arguments[0],...stateObject,_handleData});
                if(RestData.ApiUrl){
                  RestData.ApiUrl = CheckSingleQuoteReplace(RestData.ApiUrl)
                }
              }
    
          RestData.ApiUrl = handleBarData(RestData.ApiUrl,{...arguments[0],...stateObject,_handleData});
          if (RestData.Body && RestData.BodyType == 'json' && typeof RestData.Body == "string") {
            RestData.Body = handleBarData(RestData.Body,{...arguments[0],...stateObject,_handleData});
            RestData.Body = JSON.parse(RestData.Body);
          }
          else if (RestData.Body && RestData.BodyType == 'stringfyjson' && typeof RestData.Body == "string") {
            RestData.Body = JSON.parse(RestData.Body);
            Object.keys(RestData.Body).forEach(x => {
    
              RestData.Body[x] = handleBarData(RestData.Body[x],{...arguments[0],...stateObject,_handleData});
            });
          }
          else
            RestData.Body = handleBarData(RestData.Body,{...arguments[0],...stateObject,_handleData});
        if(RestData.QueryStrings){
          RestData.QueryStrings = RestData.QueryStrings.map((x:any) => {
            x.Value = handleBarData(x.Value,{...arguments[0],...stateObject,_handleData});
            return x
          });
        }
          if(RestData?.Headers){
          RestData.Headers = RestData.Headers.map((x:any) => {
            x.Value = handleBarData(x.Value,{...arguments[0],...stateObject,_handleData});
            return x
          });
        }

        await apps4xService.dynamicAPi(RestData)
        .then((data) => {
              let _data: any = data;
              if (RestData.ResponseView) {
                let _rview = RestData.ResponseView.split(".");
                _rview.forEach((x:any) => {
                  _data = _data[x];
                });
              }
    
              if(Array.isArray(_data))
                setState("DetailsData",_data[0]),setDynamicDetailsData(_data[0]);
                else
                setState("DetailsData",_data) ,setDynamicDetailsData(_data);

        }).catch((error) => {
          console.error("Error fetching data:", error);
        });
        
        }
       
      }
    }

    const onRulesConditionCheck = (rulesData:any,CurrentRow:any)=>{

      let _condition = true;
      let _handleData ={};
      if (CurrentRow)
        _handleData = CurrentRow;
      // _handleData.currentLang = this.globalService.CurrentLanguage;
  
      
      for (let index = 0; index < rulesData.Condition.length; index++) {
  
        let _conView = rulesData.Condition[index];
        let _con = _conView.ConditionElement;
  
        let _Icondition = false;
  
  
        if(_conView.ConditionElement == null && _conView.Group.length>0){
          let groupcondition:boolean =true;
          _conView.Group.forEach((x:any) => {
           let condition =  onRulesConditionCheck(x,CurrentRow);
           if(condition == false){
            groupcondition = condition
           }
          });
          _Icondition = groupcondition;
        }
        else if(_conView.ConditionElement !=null) {
          let _fieldValue = CurrentRow[_con.Field];
  
          if(_con.FieldType) {
    
             if (_con.FieldType == "Value"  || _con.FieldType == "Formula") {
              _fieldValue = handleBarData(_con.Field, {...arguments[0],...stateObject,_handleData})
            }
    
          }
    
          let value = CurrentRow[_con.Value];
    
          if(_con.ValueType) {
    
             if( _con.ValueType == "Value"  || _con.ValueType == "Formula") {
              value = handleBarData(_con.Value, {...arguments[0],...stateObject,_handleData})
            }
    
          }
    
    
          _Icondition = checkConditionValidate(_con.Type,_fieldValue,value);
    
        }
  
        else if(_conView.ConditionElement == null){
          _Icondition = true;
        }
    
  
        if (index > 0) {
          if (rulesData.ConditionOperator == 1) {
            _condition = (_condition && _Icondition ? true : false)
          }
          else {
            _condition = (_condition || _Icondition ? true : false)
          }
        }
        else {
          _condition = _Icondition;
        }
  
      }
  
      return _condition
  
    }
    const attachMethod = () => {

    }

    const openActionClickEvent = (item:any) => {
      let Forms:any[] = [...stateObject?.ActionForm,...stateObject?.ActivityForm];
      if (item.MethodType == "Action") {
        let selectedActionForm:any = Forms.filter(x => x.FormId == item.Id)[0];
        setState('selectedActionForm',selectedActionForm);
        setState('selectedActionFormConfig',selectedActionForm.Config?JSON.parse(selectedActionForm.Config):null);
        setState('showActionForm',true);
      }
    }
    const CloseActionForm = (type?:any) => {
      setState('showActionForm',false);
      if (type == "Submit") {
        let needRefresh: boolean = true;
        if (stateObject?.selectedActionForm && stateObject.selectedActionForm?.Config) {
          let data = JSON.parse(stateObject.selectedActionForm.Config);
          if (data?.IsNoActionRefresh)
            needRefresh = false;
        }
        if (needRefresh) {
          getDynamicDetailsData();
        }
      }
      
    }
    const getDynamicDetailsData = () => {
      if(formData && formData.OnSaveDSType){
        getDatabyDatasource();
      }else{
        getDynamicDetails();
      }
    }

    useEffect(() => {
      getDynamicDetailsData();
      setState('PageGroup',formData? JSON.parse(formData.ObjectData).PageGroup:[]);
    },[]);

    useEffect(() => {
      if(data){
        setState('DetailsData',data);
        setDynamicDetailsData(data);
      }
      GetDynamicSchema(true);
    },[data]);

    useEffect(() => {
      loadActionForm();
    },[stateObject?.ActionForm])

    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Dialog open={openDialog} onOpenChange={CloseDialog}>
          <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            className={`max-w-full p-8 max-h-full overflow-y-auto rounded-lg shadow-lg ${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            }`}
          >
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center">Details</div>
              </DialogTitle>

              <DialogDescription>{/*  */}</DialogDescription>
            </DialogHeader>
            <div className="groupView">
              <div className="actions-header">
                <div className="actions">
                  <div className="actionlist">
                    {stateObject?.gridActionList &&
                      stateObject.gridActionList.map(
                        (item: any, index: number) => (
                          <a
                            key={item.Name + index}
                            onClick={(e) => (
                              openActionClickEvent(item), e.preventDefault()
                            )}
                            className="actions-item"
                          >
                            {item.IconName && (
                              <i className={`${item.IconName} mx-1`}></i>
                            )}
                            {item.Name}
                          </a>
                        )
                      )}

                    {stateObject?.EntityDetails &&
                      stateObject?.EntityDetails?.Attachments != null && (
                        <a
                          className="actions-item inline-flex"
                          onClick={(e) => (attachMethod(), e.preventDefault())}
                        >
                          <i className="fas fa-paperclip mx-1 my-1 pointer"></i>
                          Attach
                        </a>
                      )}
                  </div>
                  {stateObject?.ActivityList &&
                    stateObject.ActivityList.length > 0 && (
                      <div className="activitylist">
                        <DropdownMenu>
                          <DropdownMenuTrigger>Action</DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {stateObject?.ActivityList.map(
                              (item: any, index: number) => (
                                <DropdownMenuItem
                                  key={item.Name + index}
                                  onClick={(e) => (
                                    openActionClickEvent(item),
                                    e.preventDefault()
                                  )}
                                >
                                  {item.Name}
                                </DropdownMenuItem>
                              )
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                </div>
              </div>
              <div className="groupView-content">
                <GroupView
                  PageGroup={stateObject?.PageGroup}
                  data={stateObject?.DetailsData}
                  formData={formData}
                  type="Details"
                ></GroupView>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {stateObject?.selectedActionForm &&
          stateObject?.selectedActionForm.FormId &&
          stateObject?.selectedActionFormConfig.DirectAction !== true && (
            <Dialog
              open={stateObject?.showActionForm}
              onOpenChange={CloseActionForm}
            >
              <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            className={`p-8 overflow-y-auto max-h-full rounded-lg shadow-lg ${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            }`}
          >
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center">
                  {(stateObject.selectedActionFormConfig?.Title)?
                  (stateObject.selectedActionFormConfig.Title):
                  stateObject.selectedActionForm?.Name}</div>
              </DialogTitle>

              <DialogDescription>{/*  */}</DialogDescription>
            </DialogHeader>

            {<GroupView 
            PageGroup={JSON.parse(stateObject.selectedActionForm.ObjectData).PageGroup}
            data={stateObject?.DetailsData}
            formData={stateObject.selectedActionForm}
            type="Create"></GroupView>}
            
          </DialogContent>
            </Dialog>
          )}
      </div>
    );
}


import Handlebars from "handlebars";
import GroupView from "../_components/Views";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const getCookies = () => {
  let cookies = document.cookie.split("; ");
  let cookieObj: Record<string, string> = {};
  cookies.forEach((cookie) => {
    let [key, value] = cookie.split("=");
    if (key) cookieObj[key] = value;
  });
  return cookieObj;
};

export const handleBarData = (_code: string, data: Record<string, any> = {}) => {
  if (typeof data !== "object") data = {};

  const queryParams = Object.fromEntries(new URLSearchParams(window.location.search));
  if (Object.keys(queryParams).length) data.Query = queryParams;
  data.Current = data;
  data.Local = localStorage;
  if (localStorage.getItem("userInfo")) {
    data.LocalUserInfo = JSON.parse(localStorage.getItem("userInfo") as string);
  }
  if (localStorage.getItem("CommonNavbarSearch")) {
    data.NavbarSearchData = JSON.parse(localStorage.getItem("CommonNavbarSearch") as string);
  }

  data.Cookies = getCookies();

  data.System = (window as any).globalService?.SystemConfigs || {};
  data.Parameter = (window as any).globalService?.SysParameter || {};
  data.Global = (window as any).globalService || {};

  data.PageData = (window as any).pageService?.PageAllData || {};

  if (_code) {
    const template = Handlebars.compile(_code);
    return template(data);
  }

  return _code;
};
export const CheckSingleQuoteReplace = (data:string) => {
  let result = '';
  for (const char of data) {
    if (char === '{') {
      result += '{{';
    } else if (char === '}') {
      result += '}}';
    } else {
      result += char;
    }
  }
  return result;
}
