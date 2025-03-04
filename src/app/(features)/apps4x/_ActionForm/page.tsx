import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import GroupView from "../_components/Views";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useGroupedState } from "../customState";
import { toast } from "react-toastify";
import { apps4xService, checkConditionValidate, DateTimeFormater, downloadFile, handleBarData } from "@/services/apps4xService";
import { CheckSingleQuoteReplace } from "../_Details/page";
import { AlertDialog ,AlertDialogContent,AlertDialogHeader,AlertDialogTitle,AlertDialogCancel,AlertDialogAction, AlertDialogFooter } from "@/components/ui/alert-dialog";

type Props = {
    showActionForm:boolean,
    CloseActionForm:(type?:any) => void,
    ActionForm:any,
    ActionFormConfig:any,
    Data:any,
    Fields:any[],
    EntityId:string;
}
export default function ActionForm({Data,showActionForm,CloseActionForm,ActionForm,ActionFormConfig,Fields,EntityId}:Props) {
    const {theme} = useTheme();
    
    const {stateObject, setState} = useGroupedState();
    const submitActionFormValue = (CreateData:any, pageForm:UseFormReturn, forms?:any,CurrentFormPageGroupObjects?:any) => {
    
  
        Object.keys(CurrentFormPageGroupObjects).forEach(key => {
          CurrentFormPageGroupObjects[key] = CreateData[key];
        });
        setState('ActionReactForm',pageForm);
        setState('CurrentFormPageGroupObjects',CurrentFormPageGroupObjects);
        setState('ActionFormData',CreateData);
      
        if(forms && forms.OnBeforeSubmitRules){
            setState('OnBeforeSubmitRules',forms.OnBeforeSubmitRules);
        }
      
        if(forms && forms.OnAfterSubmitRules){
            setState('OnAfterSubmitRules',forms.OnAfterSubmitRules)
        }
      
       
      }
      const OnBeforeSubmitRulesImplementation = () => {

      }
      const clearObjData = () => {
        let ActionFormData = stateObject.ActionFormData;
    
        if ('data' in ActionFormData)
          delete ActionFormData.data;
        if ('params' in ActionFormData)
          delete ActionFormData.params;
        if ('Cookies' in ActionFormData)
          delete ActionFormData.Cookies;
        if ('Local' in ActionFormData)
          delete ActionFormData.Local;
        if ('System' in ActionFormData)
          delete ActionFormData.System;
        if ('Global' in ActionFormData)
          delete ActionFormData.Global;
    
        if ('Current' in ActionFormData)
          delete ActionFormData.Current;
        if ('LocalUserInfo' in ActionFormData)
          delete ActionFormData.LocalUserInfo;
        if ('PageData' in ActionFormData)
          delete ActionFormData.PageData;
        if ('currentLang' in ActionFormData)
          delete ActionFormData.currentLang;
        

        setState('ActionFormData',ActionFormData);

        return ActionFormData;
    
      }
      const ExceuteEntityAction = (handlebarData:any) =>{  
        let ActionFormData = stateObject.ActionFormData;

        let EntityDataSource = {
          Condition: {
            Condition: [],
            ConditionOperator: 1
          },
          QueryStrings: [],
          ResponseView:null,
          ActionType:"GET"
        }
        EntityDataSource = JSON.parse(ActionForm.OnSaveDSData);
        let fileObj:any[] =[];
      
        fileObj =fileObj.filter(x=>(x && x.DoctypeIds));
      
        let FormFieldFile=[];
        for (let key in ActionFormData) {
          
            let _data = ActionFormData[key];
            if(_data && _data.File){
            let _fileList: FileList = ActionFormData[key]?.File;
            for (let index = 0; index < _fileList.length; index++) {
              let _file: File = _fileList[index];
              if (_file.size && _file.name) {
                let formFile ={Field:key,File:_file}
                FormFieldFile.push(formFile);
                ActionFormData[key] =  _file.name;
              }
            }
          }
          
        }
        let data:any = {};
        if (EntityDataSource.QueryStrings.length > 0) {
          EntityDataSource.QueryStrings.forEach((x:any) => {
            x.Value = handleBarData(x.Value,{...arguments[0],...stateObject,...handlebarData});
            if (x.Value)
              data[x.name] = x.Value;
          });
          
        }
        data.EntityId = ActionForm.OnSaveDSId
      
        let _data = JSON.stringify(data);
      if (EntityDataSource.ActionType == "CREATE") {
      apps4xService.DynamicInsert(_data, fileObj, FormFieldFile).then(
        (response) => {
          ActionResponse(response, JSON.parse(ActionForm.OnSaveDSData));
        },
        (error) => {
          setState("isactionsubmit", false);
          if (ActionFormConfig && ActionFormConfig.DirectAction)
            CloseActionForm();
          console.error(error);
        }
      );
      } else if (EntityDataSource.ActionType == "UPDATE") {
      
        if (!data.RecId) {
          toast.warning(ActionForm.Name + " RecId Not found")
          return;
        }
        
        apps4xService.DynamicUpdate(_data,fileObj,FormFieldFile).then(
          (response) => {
            ActionResponse(response,JSON.parse(ActionForm.OnSaveDSData));
        },(error)=>{
          setState("isactionsubmit", false);
          if (ActionFormConfig && ActionFormConfig.DirectAction)
            CloseActionForm();
          console.error(error);
        });
      } else if (EntityDataSource.ActionType == "DELETE"){
        apps4xService.DynamicDelete(data.EntityId,data.RecId).then(
          (response) => {
            ActionResponse(response,JSON.parse(ActionForm.OnSaveDSData));
        },(error)=>{
          setState("isactionsubmit", false);
          if (ActionFormConfig && ActionFormConfig.DirectAction)
            CloseActionForm();
          console.error(error);
        });
      }else if(EntityDataSource.ActionType == "GET"){
        apps4xService.getDynamicList(null,data.EntityId).then(
          (res) => {
            ActionResponse(res, JSON.parse(ActionForm.OnSaveDSData));
        },(error)=>{
          setState("isactionsubmit", false);
          if (ActionFormConfig && ActionFormConfig.DirectAction)
            CloseActionForm();
          console.error(error);
        });
       }else{
        apps4xService.getDynamicDetails(data.EntityId,data.RecId,data.PrimaryId).then(
          (res) => {
            ActionResponse(res,JSON.parse(ActionForm.OnSaveDSData));
        },(error)=>{
          setState("isactionsubmit", false);
          if (ActionFormConfig && ActionFormConfig.DirectAction)
            CloseActionForm();
          console.error(error);
        });
      }
      }
      const submitActionForm = () => {
        let ActionFormData = stateObject?.ActionFormData
        if(ActionFormData){
          ActionFormData = clearObjData();
        }
        setState('isactionsubmit',true);
        let _handleData: any = {};
        if (ActionFormData) {
          for (let key in ActionFormData) {
            if (Object.prototype.toString.call(ActionFormData[key]) === '[object Date]') {
              ActionFormData[key] = DateTimeFormater(ActionFormData[key]);
            }
            if (typeof ActionFormData[key] == "string")
              ActionFormData[key] = ActionFormData[key].trim()
    
          }
          _handleData.FormData = ActionFormData;
          _handleData.Data = Data;
        //   _handleData.ListData = this.ListData;
        //   _handleData.ActionData = this.ActionData;
        }
    
        if(ActionFormConfig.DirectAction == true){
          _handleData.Data = Data;
        }
    
        if (ActionForm.FunctionData && ActionForm.FunctionData.length > 0) {
          let FormData = ActionFormData;
          let rowData = Data;
          apps4xService.PostDyamicLogicData(ActionForm.FormId, FormData, rowData)
            .then((res: any) => {
              ActionResponse(res, JSON.parse(ActionForm.OnSaveDSData));
            }, (error) => {
        setState('isactionsubmit',false);
              if (ActionFormConfig && ActionFormConfig.DirectAction)
                CloseActionForm();
            });
        }
        else {
    
          if (ActionForm.OnSaveDSType == "Query") {
            if (ActionForm.OnSaveDSId) {
              apps4xService.getDyamicQueryData(ActionForm.OnSaveDSId)
                .then((res: any) => {
                  ActionResponse(res, JSON.parse(ActionForm.OnSaveDSData));
                }, (error) => {
        setState('isactionsubmit',false);
                  if (ActionFormConfig && ActionFormConfig.DirectAction)
                    CloseActionForm();
                });
            }
          } else if (ActionForm.OnSaveDSType == "SQLConnector") {
            if (ActionForm.OnSaveDSId) {
    
              let _objectType = JSON.parse(ActionForm.OnSaveDSData);
    
              let condition = null;
              if (_objectType.Condition && _objectType.Condition.length > 0) {
                let _condition: any = {
                  Condition: _objectType.Condition,
                  ConditionOperator: _objectType.ConditionOperator
                }
                condition = JSON.stringify(_condition)
                condition = handleBarData(condition);
              }
    
              apps4xService.getSqlDetails(ActionForm.OnSaveDSId, _objectType.Type, _objectType.Name, condition)
                .then((res: any) => {
                  ActionResponse(res, JSON.parse(ActionForm.OnSaveDSData));
                }, (error) => {
        setState('isactionsubmit',false);
                  if (ActionFormConfig && ActionFormConfig.DirectAction)
                    CloseActionForm();
                });
    
            }
          } else if (ActionForm.OnSaveDSType == "Entity") {
            ExceuteEntityAction(_handleData);
          }
          else {
    
            if (ActionForm.OnSaveDSData) {
              let RestData = JSON.parse(ActionForm.OnSaveDSData)
    
              if(RestData.Path && RestData.Path.length>0){
                RestData.Path.forEach((x:any) => {
                 let path = {
                  [x.name]:handleBarData(x.Value,{...arguments[0],...stateObject,..._handleData})
                 }
      
              _handleData = {..._handleData,...path}
                })
                RestData.ApiUrl = handleBarData(RestData.ApiUrl, {...arguments[0],...stateObject,..._handleData});
                if(RestData.ApiUrl){
                  RestData.ApiUrl = CheckSingleQuoteReplace(RestData.ApiUrl)
                }
              }
    
              RestData.ApiUrl = handleBarData(RestData.ApiUrl, {...arguments[0],...stateObject,..._handleData});
              if (RestData.Body && RestData.BodyType == 'json' && typeof RestData.Body == "string") {
                RestData.Body = handleBarData(RestData.Body, {...arguments[0],...stateObject,..._handleData});
                RestData.Body = JSON.parse(RestData.Body);
              }
              else if (RestData.Body && RestData.BodyType == 'stringfyjson' && typeof RestData.Body == "string") {
                RestData.Body = JSON.parse(RestData.Body);
                Object.keys(RestData.Body).forEach(x => {
    
                  RestData.Body[x] = handleBarData(RestData.Body[x], {...arguments[0],...stateObject,..._handleData});
                });
              }
              else
                RestData.Body = handleBarData(RestData.Body, {...arguments[0],...stateObject,..._handleData});
    
              RestData.QueryStrings = RestData.QueryStrings.map((x:any) => {
                x.Value = handleBarData(x.Value, {...arguments[0],...stateObject,..._handleData});
                return x
              });
    
              RestData.Headers = RestData.Headers.map((x:any) => {
                x.Value = handleBarData(x.Value, {...arguments[0],...stateObject,..._handleData});
                return x
              });
    
              RestData.Headers = RestData.Headers.map((x:any) => {
                x.Value = handleBarData(x.Value, {...arguments[0],...stateObject,..._handleData});
                return x
              });
    
    
              let fieldFormData: FormData = new FormData();
              if (RestData.Files) {
                RestData.Files.forEach((x:any) => {
                  if (x.Value && x.Name) {
    
                    let _data = ActionFormData[x.Value];
                    if (_data && _data.File) {
                      let _fileList: FileList = ActionFormData[x.Value]?.File;
                      for (let index = 0; index < _fileList.length; index++) {
                        let _file: File = _fileList[index];
                        if (_file.size && _file.name) {
                          fieldFormData.append(x.Name, _file, _file.name);
                        }
                      }
    
                    }
    
    
                  }
                });
              }
    
    
              if (RestData.BodySendType == 'Stringfy') {
                let _body = JSON.stringify(RestData.Body);
                RestData.Body = _body;
              }
              else if (RestData.BodySendType == 'FormData') {
                let _body = JSON.stringify(RestData.Body);
                let formData: FormData = new FormData();
                formData.append(RestData.FormData, _body);
    
                if (RestData.Files) {
                  RestData.Files.forEach((x:any) => {
                    if (x.Value && x.Name) {
    
                      let _data = ActionFormData[x.Value];
                      if (_data && _data.File) {
                        let _fileList: FileList = ActionFormData[x.Value]?.File;
                        for (let index = 0; index < _fileList.length; index++) {
                          let _file: File = _fileList[index];
                          if (_file.size && _file.name) {
                            formData.append(x.Name, _file, _file.name);
                          }
                        }
    
                      }
    
    
                    }
                  });
                }
    
                RestData.Body = formData;
              }
    
              if (!RestData.Body && fieldFormData) {
                RestData.Body = fieldFormData;
              }
    
    
              apps4xService.dynamicAPi(RestData)
                .then((res: any) => {
                  ActionResponse(res, RestData);
                },
                  (error) => {
                    setState('isactionsubmit',false);
                    if (ActionFormConfig && ActionFormConfig.DirectAction)
                      CloseActionForm();
                  });
            }
            else {
              // Call dynamic Update;
    
              if (!Data?.RecId) {
                toast.warning(ActionForm.Name + " RecId Not found")
                return
              }
              ActionFormData["RecId"] = Data.RecId;
              ActionFormData["EntityId"] = EntityId;
    
              let data = JSON.stringify(ActionFormData);
              apps4xService.DynamicUpdate(data).then(
                (response) => {
                  ActionResponse(response);
    
                }, (error) => {
                  setState('isactionsubmit',false);
                  if (ActionFormConfig && ActionFormConfig.DirectAction)
                    CloseActionForm();
                  console.error(error);
                }
              );
    
    
            }
          }
        }
    }
    const onSubmit = () => {
        OnBeforeSubmitRulesImplementation();

        stateObject?.ActionReactForm.handleSubmit(submitActionForm, () => {
            if (!(ActionFormConfig && ActionFormConfig.DirectAction)) {
              toast.warning("Fill All Mandatory Fields");
              return;
            }
          })();
    }
    const onRulesConditionCheck = (rulesData:any,ResponceData?:any) => {

      let _condition = true;
      let ActionFormData = stateObject?.ActionFormData
    
      let _handleData :any = ActionFormData?ActionFormData:{};
      _handleData.data = Data;
      // _handleData.ListData = this.ListData;
      // _handleData.ActionData = this.ActionData;
      // _handleData.currentLang = this.globalService.CurrentLanguage;
      if (ResponceData)
        _handleData.ResponceData = ResponceData;
    
      for (let index = 0; index < rulesData.Condition.length; index++) {
    
        let _conView = rulesData.Condition[index];
        let _con = _conView.ConditionElement;
    
        if(_conView.ConditionElement == null && _conView.Group.length>0){
          let groupcondition:boolean =true;
          _conView.Group.forEach((x:any) => {
           let condition =  onRulesConditionCheck(x,ResponceData);
           if(condition == false){
            groupcondition = condition
           }
          });
          _condition = groupcondition;
        }
    
        if(_conView.ConditionElement == null){
          return _condition;
        }
    
        let _Icondition = false;
    
        let _fieldValue = ActionFormData[_con.Field];
    
        if(_con.FieldType) {
    
          if (_con.FieldType == "Value"  || _con.FieldType == "Formula") {
            _fieldValue = handleBarData(_con.Field, {...arguments[0],...stateObject,..._handleData})
          }
    
        }
    
        let value = ActionFormData[_con.Value];
    
        if(_con.ValueType) {
    
          if( _con.ValueType == "Value"  || _con.ValueType == "Formula") {
            value = handleBarData(_con.Value, {...arguments[0],...stateObject,..._handleData})
          }
    
        }
    
    
        _Icondition = checkConditionValidate(_con.Type,_fieldValue,value);
    
    
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
    const getDatasoureData = (EntityFormId:any, Fields:any, Triggr:any,Type?:any,SuccessMsg?:any,ErrorMsg?:any) => {

      if (!EntityFormId) {
        toast.warning("form not found");
        // Swal.fire("form not found", "contact system admin,rules form id missing", "warning");
        return
      }
    
      apps4xService.getSingleMetaObject(EntityFormId).then((res: any) => {
    
        if (res.Data) {
          let _EntityTypeForm: any = JSON.parse(res.Data);
          callRestApiAction(_EntityTypeForm, Fields, Triggr,Type,SuccessMsg,ErrorMsg)
        }
      })
    
    }
    const callRestApiAction = (_EntityTypeForm:any, Fields:any[], Triggr:any,Type:any,SuccessMsg:any,ErrorMsg:any) => {
    
      if (!_EntityTypeForm.OnSaveDSData) {
        return
      }
      let ActionFormData = stateObject.ActionFormData;
    
      let _handleData :any = ActionFormData?ActionFormData:{};
      _handleData.data = Data;
          // _handleData.ListData = this.ListData;
          // _handleData.ActionData = this.ActionData;
          // _handleData.currentLang = this.globalService.CurrentLanguage;
    
      let RestData = JSON.parse(_EntityTypeForm.OnSaveDSData)
      if(RestData.Path && RestData.Path.length>0){
        RestData.Path.forEach((x:any) => {
         let path = {
          [x.name]:handleBarData(x.Value,{...arguments[0],...stateObject,..._handleData})
        }
         _handleData = {..._handleData,...path}
        })
        if(RestData.ApiUrl){
          RestData.ApiUrl = CheckSingleQuoteReplace(RestData.ApiUrl)
        }
      }
      RestData.ApiUrl = handleBarData(RestData.ApiUrl, {...arguments[0],...stateObject,..._handleData});
      if (RestData.Body && RestData.BodyType == 'json' && typeof RestData.Body == "string") {
        RestData.Body = handleBarData(RestData.Body, {...arguments[0],...stateObject,..._handleData});
        RestData.Body = JSON.parse(RestData.Body);
      }
      else if (RestData.Body && RestData.BodyType == 'stringfyjson' && typeof RestData.Body == "string") {
        RestData.Body = JSON.parse(RestData.Body);
        Object.keys(RestData.Body).forEach(x => {
    
          RestData.Body[x] = handleBarData(RestData.Body[x], {...arguments[0],...stateObject,..._handleData});
        });
      }
      else
        RestData.Body = handleBarData(RestData.Body, {...arguments[0],...stateObject,..._handleData});
      if (RestData.QueryStrings) {
        RestData.QueryStrings = RestData.QueryStrings.map((x:any) => {
          x.Value = handleBarData(x.Value, {...arguments[0],...stateObject,..._handleData});
          return x
        });
      }
    
      if (RestData.Headers) {
        RestData.Headers = RestData.Headers.map((x:any) => {
          x.Value = handleBarData(x.Value, {...arguments[0],...stateObject,..._handleData});
          return x
        });
      }
    
    
      apps4xService.dynamicAPi(RestData)
        .then((res: any) => {
          if(Type == 'Event'){
           
            _handleData = {..._handleData,...res};
            if(SuccessMsg){
              SuccessMsg = handleBarData(SuccessMsg,{...arguments[0],...stateObject,..._handleData});
              toast.success(SuccessMsg);
            }
            if(RestData.responseType == "blob"){
              let fileName = ActionFormConfig.Title?ActionFormConfig.Title:ActionForm.Name
              downloadFile(res,res.type,fileName);
            }
          }else{
          let _data: any = res;
          // this.RestApiActionSuccess(_data, RestData, Fields, Triggr)
          }
        },
          (error) => {
            if(Type == 'Event'){
              _handleData = {..._handleData,...error};
              if (ErrorMsg) {
                ErrorMsg = handleBarData(ErrorMsg, {...arguments[0],...stateObject,..._handleData});
                toast.error(ErrorMsg);
              }
            }
          });
    
    }
    const OnFieldClickEventAction = (rulesEvent:any, ResponceData?:any) => {
      if (rulesEvent.ActionType) {
        let ActionFormData = stateObject.ActionFormData;

        let _handleData :any = ActionFormData?ActionFormData:{};
        _handleData.data = Data;
        // _handleData.ListData = this.ListData;
        // _handleData.ActionData = this.ActionData;
        // _handleData.currentLang = this.globalService.CurrentLanguage;
        if (ResponceData)
          _handleData.ResponceData = ResponceData;
  
  
        if (rulesEvent.ActionType == "Navigation") {
          let _url = handleBarData(rulesEvent.NavigationURL, {...arguments[0],...stateObject,..._handleData});
          window.open(_url, rulesEvent.NavigationTarget)
        }
  
        else if (rulesEvent.ActionType == "Form") {
  
          // not yet implements
  
        }
        else if (rulesEvent.ActionType == "LoadController") {
  
          let controllerIds: string[] = rulesEvent.ControllerId.split(";");
          let _ParamsData = null;
          if (rulesEvent.FormParams) {
            rulesEvent.FormParams = handleBarData(rulesEvent.FormParams, {...arguments[0],...stateObject,..._handleData});
            let _params = JSON.parse(JSON.parse(rulesEvent.FormParams))
            _ParamsData = {};
            _params.forEach((x:any) => {
              let _val = x.Value
              if (x.Type == "Field")
                _val = _handleData[x.Value]
              _ParamsData[x.Params] = _val
            });
          }
  
          controllerIds.forEach(controllerId => {
  
            if (_ParamsData) {
              // this.pageService.PageAllData = this.pageService.PageAllData.map(x => {
              //   if (x.ID == controllerId) {
              //     x.ParamsData = _ParamsData
              //   }
              //   return x
              // });
            }
            let _ControllerType = rulesEvent.ControllerType?rulesEvent.ControllerType:"Load";
            // this.pageService.onControllerTrigger.next({ ControllerId: controllerId, Type: _ControllerType });
          });
        }
        else if (rulesEvent.ActionType == 'RestApi') {
          getDatasoureData(rulesEvent.DataSourceRecId,null,null,'Event',rulesEvent.RestSuccessMsg,rulesEvent.RestFailureMsg);
        }
      }
  
    }
    const OnEventApply = (rulesData:any,ResponceData?:any)=>{
      if (!rulesData.event)
        return 
      let rulesEvent = {
        IsNeedConfirm: false,
        ConfirmMsg: "",
        ActionType: null,
        NavigationTarget: null,
        NavigationURL: null,
        DataSourceRecId: null,
        RestSuccessMsg: null,
        RestFailureMsg: null,
        FormRecId: null,
        FormType: null,
        ViewType: null,
        ViewRefRecId:null
      }
      if (rulesData.event) rulesEvent = rulesData.event;
    
     
        if (rulesEvent.IsNeedConfirm) {
          let _opendialog:boolean = true
          return (
            <AlertDialog open={_opendialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{rulesEvent.ConfirmMsg}</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => (_opendialog = false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => (
                      OnFieldClickEventAction(rulesEvent, ResponceData),
                      (_opendialog = false)
                    )}
                  >
                    Yes!
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          );
        }
        else
          OnFieldClickEventAction(rulesEvent,ResponceData);
      
    
    return;
    }
    const OnAfterSubmitRulesImplementation = (ResponceData:any,_OnAfterSubmitRules?:any[]) => {
      let OnAfterSubmitRules = _OnAfterSubmitRules?_OnAfterSubmitRules:stateObject?.OnAfterSubmitRules?stateObject.OnAfterSubmitRules:[];
      if (OnAfterSubmitRules) {
        for (let index = 0; index < OnAfterSubmitRules.length; index++) {
          let rulesData =OnAfterSubmitRules[index];
  
          if (!rulesData) {
            return
          }
  
          let _condition = onRulesConditionCheck(rulesData, ResponceData);
  
          if (_condition) {
            OnEventApply(rulesData, ResponceData)
          }
          else {
            if (rulesData.child && rulesData.child.length > 0) {
              let _elseIfRulescondition = false;
              let _elseIfRules = rulesData.child.filter((x:any) => x.Type == "OnElseIf");
  
              for (let index = 0; index < _elseIfRules.length; index++) {
                _elseIfRulescondition = onRulesConditionCheck(_elseIfRules[index], ResponceData)
                if (_elseIfRulescondition) {
                  OnEventApply(rulesData, ResponceData)
                  break;
                }
              }
              if (!_elseIfRulescondition) {
                let _elseRules = rulesData.child.filter((x:any) => x.Type == "OnElse");
                if (_elseRules && _elseRules.length > 0) {
                  OnEventApply(rulesData, ResponceData)
                }
              }
  
            }
          }
        }
      }
    }
    const ActionResponse = (res:any, RestData?:any) =>{
      let _resdata = res.Data ? res.Data : res;
      let showSwal:boolean = true;
      if (ActionForm.Config) {
        let actionConfig = JSON.parse(ActionForm.Config);
        showSwal = actionConfig.showSwal
        
      }
  
      if(RestData.responseType == "blob"){
        let fileName = ActionFormConfig.Title?ActionFormConfig.Title:ActionForm.Name
        downloadFile(res,res.type,fileName);
        showSwal = false
      }
  
      if (RestData) {
  
        if (RestData.SuccessFormat && RestData.SuccessFormat.Condition.length > 0) {
          let isSuccess: boolean = false;
  
          isSuccess = onRulesConditionCheck(RestData.SuccessFormat, _resdata);
  
          if (isSuccess) {
            if (RestData.SuccessMessage != null && RestData.SuccessMessage != "") {
              let sccMsg = handleBarData(RestData.SuccessMessage, {...arguments[0],...stateObject,..._resdata});
              toast.success(sccMsg);
            }
            else {
              if (showSwal)
              toast.success("Action Completed");
            }
          }
          else {
            if (RestData.ErrorMessage != null && RestData.ErrorMessage != "") {
              let errorMsg = handleBarData(RestData.ErrorMessage, {...arguments[0],...stateObject,..._resdata});
              toast.error(errorMsg);
            }
            else {
              if (showSwal)
                toast.error(JSON.stringify(res));
            }
          }
        }
        else {
          if (RestData.SuccessMessage != null && RestData.SuccessMessage != "") {
            let sccMsg = handleBarData(RestData.SuccessMessage, {...arguments[0],...stateObject,..._resdata});
            toast.success(sccMsg);
          } else {
            if (showSwal)
              toast.success("Action Completed")
          }
  
        }
      }
      else {
        if (showSwal)
          toast.success("Action Completed")
      }
  
      // let needRefresh: boolean = true;
      // if (ActionForm && ActionForm.Config) {
      //   let data = JSON.parse(ActionForm.Config);
      //   // if(data?.ListRefresh){
      //   //   this.globalService.onPageRefresh.next({isLoad:true})
      //   // }
      //   if (data?.IsNoActionRefresh)
      //     needRefresh = false;
      // }
  
      // if (needRefresh) {
      //   this.getRefresh.emit();
      // }
      setState('isactionsubmit',false)
  
      if (ActionForm.Rules) {
        let _formInitRule:any[] = JSON.parse(ActionForm.Rules);
        setState('OnBeforeSubmitRules',_formInitRule.filter(x => x.Type == "OnBeforeSubmit"));
        setState('OnAfterSubmitRules',_formInitRule.filter(x => x.Type == "OnAfterSubmit"));
      OnAfterSubmitRulesImplementation(RestData,_formInitRule.filter(x => x.Type == "OnAfterSubmit"));
      }else{
      OnAfterSubmitRulesImplementation(RestData)
      }
      setState('showSwal',showSwal);
      CloseActionForm("Submit");
    }

    return (
      <Dialog open={showActionForm} onOpenChange={CloseActionForm}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className={`p-8 overflow-y-auto max-h-full rounded-lg shadow-lg ${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } ${
            ActionFormConfig?.PopupSize
              ? ActionFormConfig?.PopupSize
              : "modal-lg"
          }
            ${
              ActionFormConfig?.PopupClassName
                ? ActionFormConfig?.PopupClassName
                : ""
            }`}
        >
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center">
                {ActionFormConfig?.Title
                  ? ActionFormConfig.Title
                  : ActionForm?.Name}
              </div>
            </DialogTitle>

            <DialogDescription>{/*  */}</DialogDescription>
          </DialogHeader>

          {
            <GroupView key={ActionForm.FormId}
              PageGroup={JSON.parse(ActionForm.ObjectData).PageGroup}
              data={Data}
              formData={ActionForm}
              type="Create"
              Fields={Fields}
              submitFormValue={(formdata,pageForm,forms,CurrentFormPageGroupObjects)=>{submitActionFormValue(formdata,pageForm,forms,CurrentFormPageGroupObjects)}}
            ></GroupView>
          }
          <DialogFooter className="mt-4">
          <Button
            type="button"
            className="px-6 py-2 text-white rounded"
            onClick={() =>onSubmit()}
          >
            Submit
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}
