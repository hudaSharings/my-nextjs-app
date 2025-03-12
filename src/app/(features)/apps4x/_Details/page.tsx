import { useTheme } from "next-themes";
import { apps4xService, checkConditionValidate, FilterDuplicateMetaobject, handleBarData } from "@/services/apps4xService";
import { useApi } from "@/app/api/useApi";
import { useEffect, useState } from "react";
import { useGroupedState } from "../customState";
import GroupView from "../_components/Views";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ActionForm from "../_ActionForm/page";
import { useParams, useSearchParams } from "next/navigation";
import { pageService } from "@/services/pageService";
type Props = {
    CollectionId?:string
    EntityId:string;
    RecId:number,
    Fields?:any[],
    ViewFrom?:'Popup'| 'root' |'Page',
    DetailsData?:any,
    group?:any,
    entityForm?:any,
    HideAction?:boolean,
    HideHeader?:boolean,
    PageData?:any,
    PageLoadData?:any,
    PrimaryId?:any,
    getWorkflowStageList?:(data:any) => void
}

export default function DetailsPage({CollectionId,EntityId,RecId,Fields,ViewFrom,DetailsData,group,entityForm,HideAction,HideHeader,PageData,PageLoadData,PrimaryId,getWorkflowStageList}:Props) {
    const params = useParams();
    const searchParams = useSearchParams();
    const {stateObject,setState}= useGroupedState();
    const [formData ,setformData] = useState<any>({});
    const [formDataConfig ,setformDataConfig] = useState<any>(null);

    const GetDynamicSchema = async (init?:boolean) => {
      let _EntityId = stateObject?.EntityId?stateObject.EntityId:EntityId
      if (_EntityId) {
        await apps4xService.getDynamicSchema(null, _EntityId).then((res: any) => {
          let _data: any = res;
          if (_EntityId) {
            let Entities: any[] = _data.Type.filter((x:any) => x.EntityId == _EntityId);
            let _EntityDetails:any = null;
            if (Entities.length > 1) {
  
              if (Entities.find((x) => x.Status == 'Active')) {
                _EntityDetails = Entities.filter(x => x.Status == 'Active')[0];
              }
              else if (Entities.find((x) => x.Status == 'Draft')) {
                _EntityDetails =  Entities.filter(x => x.Status == 'Draft')[0];
              }
              else {
                _EntityDetails =    Entities[Entities.length - 1];
              }
  
            }
            else {
              _EntityDetails =   Entities[0];
            }
            setState('EntityDetails',_EntityDetails)
            setState('HeaderTitle',_EntityDetails.Name?_EntityDetails.Name + ' Details':'Details - '+_EntityId)
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
  
          
  
          if(_data && _data.Forms?.length>0){
            let _detailsform: any[] = [];
            _data.Forms.forEach((x:any) => {
              let Data: any = JSON.parse(x.Data)
              if (Data.Type == 'Details') {
                Data.FormId = x.Id;
                Data.RecId = x.RecId;
                Data.Status = x.Status;
                Data.Version = x.Version;
                _detailsform.push(Data);
              }
            });
            if (group && group.PageEntity && group.PageEntity.FormId) {
            _detailsform = _detailsform.filter(x => x.FormId == group.PageEntity.FormId);
          }
            if(_detailsform.length>0){
              let _formData:any = {};
            if (_detailsform.find((x) => x.Status == 'Active')) {
              _formData = _detailsform.filter(x => x.Status == 'Active')[0]
              setformData(_formData);
            }
            else if (_detailsform.find((x) => x.Status == 'Draft')) {
              _formData = _detailsform.filter(x => x.Status == 'Draft')[0]
              setformData(_formData);
            }
            else {
              _formData = _detailsform[_detailsform.length - 1]
              setformData(_formData);
            }
            setformDataConfig(_formData? JSON.parse(_formData.Config):null);
            setState('PageGroup',_formData? JSON.parse(_formData.ObjectData).PageGroup:[]);
          }
  
          }

          setState('ActionForm', _form.filter(x => x.Type == "Action"));
          setState('ActivityForm', _form.filter(x => x.Type == "Activity"));
                    
          
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
      //   if (stateObject?.group && stateObject?.group.PageEntity && stateObject?.group.PageEntity.FormId) {
      //     this.EntityObjectsId = stateObject?.group.PageEntity.FormId;
      //     this.getEntityFormbyId(null,init);
      //   }
      //   else if(this.ConnectorId && this.EntityObjectsId)
      //     this.getEntityFormbyId(null,init);
      // }
    };
    
    const loadActionForm = () => {
      if(formDataConfig && formData)
      if (stateObject?.ActionForm && stateObject?.ActionForm.length > 0 && stateObject?.DetailsData) {
        setState('gridActionList',[]);
        setState('ActivityList',[]);
        let Forms:any[] = [...stateObject?.ActionForm,...stateObject?.ActivityForm];
        let _ActivityList:any[]=[];
        let _gridActionList:any[]=[];
        Forms.forEach((form: any) => {
          let _action: any = { Id: form.FormId, Name: form.Name, MethodType: "Action", NoRefresh: false,IconName:null, }
          if (form.Config) {
            let _data: any = JSON.parse(form.Config);
            setState('showSwal',_data.showSwal);
            if (_data?.IsNoActionRefresh)
            _action.NoRefresh = _data?.IsNoActionRefresh;
            _action.IconName = _data.IconName;
            _action.Order = _data.Order;
            _action.IconName = _data.IconName;
            _action.Name = _data.Title?_data.Title:_action.Name;
  
            if (_data?.ActionVisible && _data.ActionCondition && _data.ActionCondition.Condition && _data.ActionCondition.Condition.length > 0) {
              let isConditionPassed: boolean = onRulesConditionCheck(_data.ActionCondition, stateObject?.DetailsData);
              if (isConditionPassed) {
                if (_data.ActionType == "Activity") {
                  _ActivityList.push(_action);
                }
                else
                _gridActionList.push(_action);
              }
            } else {
              if (_data.ActionType == "Activity" || form.Type == "Activity") {
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
    
    const {data ,loading ,error , execute:getDynamicDetails} = useApi<any>(() => apps4xService.getDynamicDetails(stateObject?.EntityId?stateObject.EntityId:EntityId,stateObject?.RecId?stateObject.RecId:RecId));

    const setDynamicDetailsData = (_data?:any) => {
      if(stateObject?.DetailsData) {
       setState('RecId',stateObject?.DetailsData.RecId);
      // getcurrentStage();
      // getProcessStageList();
      loadActionForm();
  
      if (group && group.ControlData)
        group.ControlData.FormData = stateObject?.DetailsData;
    
        pageService.getAllPageData();
  
        getWorkflowStageList&&getWorkflowStageList({Data:stateObject?.DetailsData});
      }
  
      if (group && group.PageEntity && group.PageEntity.LoadControllers) {
        pageService.onControllerTrigger.next({ ControllerId: group.PageEntity.LoadControllers, Type: "Enable" });
      }
  
      // if(this.DetailsFormMetaObject?.ParentType=="Connector" && this.DetailsForm?.ParentId) {
      //   this.loadActionForm();
      // }
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
                ...stateObject,
                ..._handleData,
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
            x.Value =handleBarData(x.Value,{...arguments[0],...stateObject,..._handleData});
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
            await apps4xService.getDynamicDetails(formData.OnSaveDSId, stateObject?.RecId?stateObject.RecId:RecId).then((data) => {
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
                  [x.name]:handleBarData(x.Value,{...arguments[0],...stateObject,..._handleData})
                 }
      
              _handleData = {..._handleData,...path}
                })
                RestData.ApiUrl = handleBarData(RestData.ApiUrl,{...arguments[0],...stateObject,..._handleData});
                if(RestData.ApiUrl){
                  RestData.ApiUrl = CheckSingleQuoteReplace(RestData.ApiUrl)
                }
              }
    
          RestData.ApiUrl = handleBarData(RestData.ApiUrl,{...arguments[0],...stateObject,..._handleData});
          if (RestData.Body && RestData.BodyType == 'json' && typeof RestData.Body == "string") {
            RestData.Body = handleBarData(RestData.Body,{...arguments[0],...stateObject,..._handleData});
            RestData.Body = JSON.parse(RestData.Body);
          }
          else if (RestData.Body && RestData.BodyType == 'stringfyjson' && typeof RestData.Body == "string") {
            RestData.Body = JSON.parse(RestData.Body);
            Object.keys(RestData.Body).forEach(x => {
    
              RestData.Body[x] = handleBarData(RestData.Body[x],{...arguments[0],...stateObject,..._handleData});
            });
          }
          else
            RestData.Body = handleBarData(RestData.Body,{...arguments[0],...stateObject,..._handleData});
        if(RestData.QueryStrings){
          RestData.QueryStrings = RestData.QueryStrings.map((x:any) => {
            x.Value = handleBarData(x.Value,{...arguments[0],...stateObject,..._handleData});
            return x
          });
        }
          if(RestData?.Headers){
          RestData.Headers = RestData.Headers.map((x:any) => {
            x.Value = handleBarData(x.Value,{...arguments[0],...stateObject,..._handleData});
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
              _fieldValue = handleBarData(_con.Field, {...arguments[0],...stateObject,..._handleData})
            }
    
          }
    
          let value = CurrentRow[_con.Value];
    
          if(_con.ValueType) {
    
             if( _con.ValueType == "Value"  || _con.ValueType == "Formula") {
              value = handleBarData(_con.Value, {...arguments[0],...stateObject,..._handleData})
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
          let _data = JSON.parse(stateObject.selectedActionForm.Config);
          if (_data?.IsNoActionRefresh)
            needRefresh = false;
        }
        if (needRefresh) {
          getDynamicDetailsData();
        }
      }
      
    }
    const getPageData = () => {

      if (!entityForm) {
        return
      }
  
      entityForm.OnSaveDSType = entityForm?.OnSaveDSType;
      entityForm.OnSaveDSId = entityForm?.OnSaveDSId;
      entityForm.OnSaveDSData = entityForm?.OnSaveDSData;
  
      let _handleData:any = {};
      
      if (entityForm.OnSaveDSType == "Query") {
  
        if(entityForm.OnSaveDSId) {
  
      let Parameter: any[] = [];
      let _handleData: any = {};
  
      if (entityForm) {
  
        let _QueryData = JSON.parse(entityForm.OnSaveDSData);
        let _param = _QueryData.DSQueryParamsList;
  
        Parameter = _param.map((x:any) => {
          x.Value = handleBarData(x.Value, {...arguments[0],...stateObject,..._handleData});
          return x
        });
  
      }
  
          apps4xService.getDyamicQueryData(entityForm.OnSaveDSId,null,Parameter)
          .then((res: any) => {
            
            setState('PageData',res.Data?res.Data:res);
            setState('DetailsData',res.Data?res.Data:res);
          },
            (error) => {
              
              
              
            });
        }
        
      }
      else if (entityForm.OnSaveDSType == "Entity") {
        if (entityForm.OnSaveDSId) {
  
          let EntityData = {
            Condition: {
              Condition: [],
              ConditionOperator:1
            },
            QueryStrings: [],
            ResponseView: null,
            ActionType: "GET"
          }
          EntityData = JSON.parse(stateObject?.selectedActionForm?.OnSaveDSData);
          let _handleData: any = {};
          let data: any = {};
          EntityData.QueryStrings.forEach((x:any) => {
            x.Value = handleBarData(x.Value, {..._handleData, ...arguments[0],...stateObject});
            if (x.Value)
              data[x.name] = x.Value;
          });
  
          if (EntityData.ActionType == "GET") {
  
            apps4xService.getDynamicList(null, entityForm.OnSaveDSId).then(
              (res: any) => {
  
                setState('PageData',res.Data?res.Data:res);
                setState('DetailsData',res.Data?res.Data:res);
              },
              (error) => {
  
              }
            );
  
          } else {
            setState('showActionForm',false);
            apps4xService.getDynamicDetails(data.EntityId, data.RecId, data.PrimaryId).then(
              (res) => {
                setState('PageData',res.Data?res.Data:res);
                setState('DetailsData',res.Data?res.Data:res);
              }, (error) => {
  
              });
          }
        }
        
      }
      else if(entityForm.OnSaveDSType == "SQLConnector") {
  
        if(entityForm.OnSaveDSId){
  
          let _objectType = JSON.parse(entityForm.OnSaveDSData);
  
          let condition = null;
          if (_objectType.Condition && _objectType.Condition.length > 0) {
            let _condition:any = {
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
            setState('DetailsData',_data);  
          },
            (error) => {
             
            });
  
        }
  
      }
      else {
  
        if (entityForm.OnSaveDSData) {
          let RestData = JSON.parse(entityForm.OnSaveDSData)
            if(RestData.Path && RestData.Path.length>0){
              RestData.Path.forEach((x:any) => {
               let path = {
                [x.name]:handleBarData(x.Value,{..._handleData,...arguments[0],...stateObject})
               }
    
            _handleData = {..._handleData,...path}
              })
              RestData.ApiUrl = handleBarData(RestData.ApiUrl, {..._handleData,...arguments[0],...stateObject});
              if(RestData.ApiUrl){
                RestData.ApiUrl = CheckSingleQuoteReplace(RestData.ApiUrl)
              }
            }
  
          RestData.ApiUrl = handleBarData(RestData.ApiUrl,{..._handleData,...arguments[0],...stateObject});
          if (RestData.Body && RestData.BodyType == 'json' && typeof RestData.Body == "string") {
            RestData.Body = handleBarData(RestData.Body, {..._handleData,...arguments[0],...stateObject});
            RestData.Body = JSON.parse(RestData.Body);
          }
          else if (RestData.Body && RestData.BodyType == 'stringfyjson' && typeof RestData.Body == "string") {
            RestData.Body = JSON.parse(RestData.Body);
            Object.keys(RestData.Body).forEach(x => {
  
              RestData.Body[x] = handleBarData(RestData.Body[x], {..._handleData,...arguments[0],...stateObject});
            });
          }
          else
            RestData.Body = handleBarData(RestData.Body, {..._handleData,...arguments[0],...stateObject});
        if(RestData.QueryStrings){
          RestData.QueryStrings = RestData.QueryStrings.map((x:any) => {
            x.Value = handleBarData(x.Value,{..._handleData,...arguments[0],...stateObject});
            return x
          });
        }
          if(RestData?.Headers){
          RestData.Headers = RestData.Headers.map((x:any) => {
            x.Value = handleBarData(x.Value,{..._handleData,...arguments[0],...stateObject});
            return x
          });
        }
         
          apps4xService.dynamicAPi(RestData)
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
              setState('DetailsData',_data);
  
            },
              (error) => {
                
              });
        }
       
      }
  
    }
    const getDynamicDetailsData = (init?: boolean,start?:boolean) => {
      if (stateObject?.group && stateObject?.group.PageEntity) {
        return
      }
  
      let _isFullLoad = false;
  
      if (stateObject?.group && stateObject?.group.PageEntity.IsDependentController) {
        if (!stateObject?.group.PageEntity.SelectedGroupId  && !init) {
          _isFullLoad = true;
        }
      }
      if (stateObject?.group && stateObject?.group.PageEntity.IsDependentController && !init) {
        pageService.onPageLoad.next({ isLoad: true, GroupIds: stateObject?.group.PageEntity.SelectedGroupId });
      }
  
      
      if(stateObject?.group && stateObject?.group.PageEntity.PreventInitLoad && start ){
        return
      }
  
  
      
      if (stateObject?.group && stateObject?.group.ID) {
        pageService.getAllPageData();
        if (pageService.PageAllData.find(x => x.ID == stateObject?.group.ID)) {
          setState('PageGroupParams', pageService.PageAllData.filter(x => x.ID == stateObject?.group.ID)[0].ParamsData);
        }
  
      }
      if (!_isFullLoad) {
        if (stateObject?.dataLoadType == "Page") {
          pageService.onPageLoad.next({ isLoad: true });
          getPageData();
        } else if (formData && formData.OnSaveDSType) {
          getDatabyDatasource();
        } else {
          getDynamicDetails();
        }
      }
    }

    useEffect(() => {
      if(CollectionId){
        setState('CollectionId',CollectionId);
      }
      if(EntityId){
        setState('EntityId',EntityId);
      }
      if(RecId){
        setState('RecId',RecId);
      }
      if(PrimaryId){
        setState('PrimaryId',PrimaryId);
      }
      if(DetailsData){
        setState('DetailsData',DetailsData);
      }
      if(group){
        setState('group',group);
      }
      if(PageData){
        setState('PageData',PageData);
      }
      if(PageLoadData){
        setState('PageLoadData',PageLoadData);
      }
      setState('HideHeader',HideHeader);
      setState('HideAction',HideAction);

      if (!HideHeader) {
        if (group && group.PageEntity.HideHeader)
         setState('HideHeader', group.PageEntity.HideHeader)
      }
  
      if (!HideAction) {
        if (group && group.PageEntity.HideAction)
         setState('HideAction' ,group.PageEntity.HideAction);
      }

    },[EntityId,RecId,DetailsData,group,HideAction,HideHeader,PageData,PageLoadData,PrimaryId,CollectionId]);

    useEffect(() => {
      if(ViewFrom === 'root' || !ViewFrom){
        if(params.EntityId){
          setState('EntityId',params.EntityId);
        }
        if(params.RecId){
          setState('RecId',Number(params.RecId));
        }
        if(params.CollectionId){
          setState('CollectionId',params.CollectionId);
        }
        if(params.PrimaryId){
          setState('PrimaryId',params.PrimaryId);
        }
        if(params.Version){
          setState('Version',params.Version);
        }
      }
      setState('loads',true)
    },[params]);

    useEffect(() => {
      const paramsObj: Record<string, string | null> = {};
      searchParams.forEach((value, key) => {
        paramsObj[key] = value;
      });
      setState('queryParams',searchParams);
  
      if (paramsObj.recid) {
        setState('RecId',Number(paramsObj.recid));
      }
    },[searchParams])

    useEffect(() => {
      if(stateObject && stateObject.loads === true){
        GetDynamicSchema(true);

        if (stateObject?.DetailsData && ViewFrom === "Page" && !(stateObject?.group?.PageEntity?.FormId)) {
          setState('dataLoadType', "Page");
          setDynamicDetailsData()
        }
        else if (!stateObject?.group?.PageEntity?.FormId)
          getDynamicDetailsData(true);
      }
    },[stateObject?.loads]);

    useEffect(() => {
      if(data){
        setState('DetailsData',data);
      }
    },[data]);

    useEffect(() => {
      loadActionForm();
    },[stateObject?.ActionForm]);

    useEffect(() => {
      setDynamicDetailsData()
    },[stateObject?.DetailsData]);

    useEffect(() => {
        const pageLoadSub = pageService.onPageLoad.subscribe((x) => {
          if(x.isLoad && x.GroupIds){
            if (group && x.GroupIds.includes(group.ID)) {
          setTimeout(() => {
            if(!group?.PageEntity?.FormId)
          getDynamicDetailsData(true);
          }, 1);
          }
        }
        });
    
    
        const controllerSub = pageService.onControllerTrigger.subscribe((x) => {
          if (group && group.ID == x.ControllerId) {
            if(x.Type=="Load"){
                getDynamicDetailsData(true);
            }
          }
        });
    
        return () => {
          pageLoadSub.unsubscribe();
          controllerSub.unsubscribe();
        };
      }, [])

    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        
            <>
              <div className="details_header">
                <h5 className="m-0 font-bold">{stateObject?.HeaderTitle}</h5>
              </div>
              <div className="groupView shadow-md shadow-muted rounded-lg">
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
                              className="actions-item shadow-md shadow-muted"
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
                            className="actions-item inline-flex shadow-md shadow-muted"
                            onClick={(e) => (
                              attachMethod(), e.preventDefault()
                            )}
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
                  <div className="refresh">
                    <a
                      onClick={(e) => (
                        e.preventDefault(), getDynamicDetailsData()
                      )}
                    >
                      <i className="fas fa-sync mx-2 pointer"></i>
                    </a>
                  </div>
                </div>
                <div className="groupView-content">
                  <GroupView
                    key={
                      formData?.FormId ?? stateObject?.RecId
                        ? stateObject.RecId
                        : RecId
                    }
                    PageGroup={stateObject?.PageGroup ?? []}
                    data={stateObject?.DetailsData}
                    formData={formData}
                    type="Details"
                    Fields={Fields}
                    submitFormValue={() => console.log("submitFormValue")}
                  ></GroupView>
                </div>
              </div>
            </>
        {stateObject?.selectedActionForm &&
          stateObject?.selectedActionForm.FormId &&
          stateObject?.selectedActionFormConfig.DirectAction !== true && (
            <ActionForm
              CloseActionForm={(type) => CloseActionForm(type)}
              showActionForm={stateObject?.showActionForm}
              ActionForm={stateObject?.selectedActionForm}
              ActionFormConfig={stateObject?.selectedActionFormConfig}
              Data={stateObject?.DetailsData}
              Fields={stateObject?.EntityDetails?.Fields}
              EntityId={stateObject?.EntityId ? stateObject.EntityId : EntityId}
            ></ActionForm>
          )}
      </div>
    );
}
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
