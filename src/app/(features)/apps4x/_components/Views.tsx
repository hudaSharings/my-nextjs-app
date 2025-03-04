"use clients";
import { apps4xService, checkConditionValidate, DateTimeFormater, handleBarData } from "@/services/apps4xService";
import { CheckSingleQuoteReplace } from "../_Details/page";
import { useGroupedState } from "../customState";
import GroupField from "./Fields";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AlertDialog ,AlertDialogContent,AlertDialogHeader,AlertDialogTitle,AlertDialogCancel,AlertDialogAction, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { useForm, UseFormReturn } from "react-hook-form";
type props = {
  PageGroup: any[];
  data: any;
  formData: any;
  type: 'Details' | 'Create' | 'Edit' ;
  Fields?:any[];
  submitFormValue:(formdata: any,pageForm:any,forms?:any,CurrentFormPageGroupObjects?:any)=>void
};
function GroupView({ PageGroup, data, formData ,type ,Fields , submitFormValue}: props) {
  const { stateObject, setState } = useGroupedState();
  const getAllFields = (pageGroups:any[]) => {

    let fields:any[] =[];
    if(pageGroups.length>0){
 
     for (let index = 0; index < pageGroups.length; index++) {
       let Groups = pageGroups[index].Groups;
       for (let i = 0; i < Groups.length; i++) {
         fields.push(...Groups[i].Fields)
       }
     }
    }
    if(Fields && Fields?.length>0){
      for (let index = 0; index < Fields.length; index++) {
        fields.push(Fields[index]);
      }
    }
     return fields;
 
   }
  const initformMethod = () => {
    let _PagegroupValues = formData?.PageGroupValues??{};
    if(type === 'Details' || type === 'Edit'){
      if (data) {
        let _fields = getAllFields(PageGroup);
        for (let index = 0; index < _fields.length; index++) {
          let field = _fields[index];
          if (data[field.Name]) {
            _PagegroupValues[field.Name] = data[field.Name];
          }
        }
        return _PagegroupValues;
      }
      else{
        return _PagegroupValues;
      }
    }
    else if(type !== 'Create'){
      return _PagegroupValues;
    }else{
      let _form:any = {};
      let _fields = getAllFields(PageGroup);
      for (let index = 0; index < _fields.length; index++) {
        let field = _fields[index];
        if(data){
          _form[field.Name] = data[field.Name];
        }else
        _form[field.Name] = '';
      }
      return _form;
    }
    
  }
  const [form ,setform] = useState<UseFormReturn>(useForm({defaultValues:initformMethod()}));
  const getFractionalWidth = (width: any) => {
    const fractions: any = { 100: "full", 75: "3/4", 50: "1/2", 25: "1/4" };
    return fractions[width] || `${width}%`;
  };
  
  const onFormInit = (FormData: any, RestData?: any, data?: any) => {
    if (FormData.Rules) {
      let _formInitRule: any[] = JSON.parse(FormData.Rules);

      let onInitRules = _formInitRule.filter((x) => x.Type == "OnInit");

      for (let index = 0; index < onInitRules.length; index++) {
        let rulesData = onInitRules[index];

        if (!rulesData) {
          return;
        }
        let _form = initformMethod();
        let _condition = onRulesConditionCheck(rulesData, RestData,null,_form);

        if (_condition) {
          OnRulesApply(rulesData, RestData, null, "OnInit", data);
        } else {
          if (rulesData.child && rulesData.child.length > 0) {
            let _elseIfRulescondition = false;
            let _elseIfRules = rulesData.child.filter(
              (x: any) => x.Type == "OnElseIf"
            );

            for (let index = 0; index < _elseIfRules.length; index++) {
              _elseIfRulescondition = onRulesConditionCheck(
                _elseIfRules[index],
                RestData
              );
              if (_elseIfRulescondition) {
                OnRulesApply(
                  _elseIfRules[index],
                  RestData,
                  null,
                  "OnInit",
                  data
                );
                break;
              }
            }
            if (!_elseIfRulescondition) {
              let _elseRules = rulesData.child.filter(
                (x: any) => x.Type == "OnElse"
              );
              if (_elseRules && _elseRules.length > 0) {
                OnRulesApply(_elseRules[0], RestData, null, "OnInit", data);
              }
            }
          }
        }
      }
    }
  };
  const getDatasoureData = (EntityFormId:any, Fields:any, Triggr:any,Type?:any,SuccessMsg?:any,ErrorMsg?:any) =>{

    if (!EntityFormId) {
      toast.warning("form not found", { autoClose: 3000 });
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

  const callRestApiAction = (_EntityTypeForm:any, Fields:any, Triggr:any,Type:any,SuccessMsg:any,ErrorMsg:any) =>{

    if (!_EntityTypeForm.OnSaveDSData) {
      return
    }
    let _data = stateObject?.Data?stateObject.Data:data;

    let _handleData = form?.getValues();
    _handleData.data = _data ;
    // _handleData.currentLang = this.globalService.CurrentLanguage;
    _handleData.FormData = form?.getValues();
    if (_data)
      _handleData.params = _data;

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
            SuccessMsg = handleBarData(SuccessMsg,{...arguments[0],...stateObject,_handleData});
            toast.success(SuccessMsg,{autoClose:3000})
            // this.toaster.success(SuccessMsg);
          }
        }else{
        let _data: any = res;
        RestApiActionSuccess(_data, RestData, Fields, Triggr)
        }
      },
        (error) => {
          if(Type == 'Event'){
            _handleData = {..._handleData,...error};
            if (ErrorMsg) {
              ErrorMsg = handleBarData(ErrorMsg, {...arguments[0],...stateObject,..._handleData});
            toast.error(ErrorMsg,{autoClose:3000})
              // this.toaster.error(ErrorMsg);
            }
          }
        });

  }

  const RestApiActionSuccess = (_data:any, RestData:any, Fields:any, Triggr:any) =>{
    if (RestData && RestData.ResponseView) {
      let _rview = RestData.ResponseView.split(".");
      _rview.forEach((x:any) => {
        _data = _data[x];
      });
    }

    try {
      if (Fields) {
        let _Fields = JSON.parse(JSON.parse(Fields));
        _Fields.forEach((x:any) => {
          
          if (_data[x.Value]!=null || x.Value.includes("{{")) {
            let _value = _data[x.Value];
            if (x.Value.includes("{{")) {
              let _hanbleBardata: any = {};
              _hanbleBardata.FormData = form?.getValues();
              _hanbleBardata.RestData = _data;
              if (_data)
              _hanbleBardata.params = _data;
              _value = handleBarData(x.Value, {...arguments[0],...stateObject,..._hanbleBardata});
            }
            else{
            let currentfield = Fields.filter((y:any) => y.Name == x.Field)[0];

            if (currentfield.DataType == "Date" || currentfield.DataType == "DateTime") {
              _value = new Date(_data[x.Value]);
            }
          }
          form.setValue(x.Field, _value);
          }
        });
      }
      if (Triggr) {
        let _TriggrFields = JSON.parse(JSON.parse(Triggr));
        _TriggrFields.forEach((x:any) => {

          let _Triggrfield = Fields.filter((y:any) => y.Name == x.Field)[0]
          if (_Triggrfield)
            FieldChangeEvent(_Triggrfield, null)

        });
      }
      _submitFormValue();
    }
    catch (err) {
      
      alert(err)
    }

  }
  const OnEventApply = (rulesData:any,RestData:any,_form?:any) => {
    let Form = _form ? _form : form;
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

    if (rulesEvent.ActionType) {
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
                    OnFieldClickEventAction(rulesEvent, RestData),
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
        OnFieldClickEventAction(rulesEvent,RestData);
    }


  }

  const OnFieldClickEventAction = (rulesEvent:any,RestData:any,_form?:any) => {
    let Form = _form ? _form : form;
    let _data = stateObject?.Data?stateObject.Data:data;
    
    let _handleData = form.getValues();
  
    // if (this.Type == 'Details' && this.Data){
    //   try {
    //   _handleData = JSON.parse(JSON.stringify(this.Data));
    //   }
    //   catch (e) {
    //     _handleData = this.Data;
    //   }
    // }

    _handleData.data = RestData;
    // _handleData.currentLang = this.globalService.CurrentLanguage;
    if (_data)
          _handleData.params = _data;

    if (rulesEvent.ActionType == "Navigation") {
      let _url = handleBarData(rulesEvent.NavigationURL, {...arguments[0],...stateObject,..._handleData});
      window.open(_url, rulesEvent.NavigationTarget)
    }
    
    else if (rulesEvent.ActionType == "Form") {
      setState("FieldActionEventData",{});
     
      setState("FieldActionEventData",_data);

      setState('FieldActionEventFormType',rulesEvent.FormType); 
      setState('FieldActionEventViewType',rulesEvent.ViewType);
      setState('FieldActionEventRefRecId',handleBarData(rulesEvent.ViewRefRecId,{...arguments[0],...stateObject,..._handleData}));
      setState('FieldActionEventRefPrimaryId',handleBarData(rulesEvent.ViewRefPrimaryId,{...arguments[0],...stateObject,..._handleData}));

      if (rulesEvent.FormType) {
        setState('FieldActionEventFormId',rulesEvent.FormRecId);
        setState('showFieldActionEventForm',true);
      }
    }
    else if (rulesEvent.ActionType == "LoadController") {
      
      let controllerIds:string[] = rulesEvent.ControllerId.split(";");
      let _ParamsData = null;
      if (rulesEvent.FormParams) {
        rulesEvent.FormParams = handleBarData(rulesEvent.FormParams, {...arguments[0],...stateObject,..._handleData});
        let _params =  JSON.parse(JSON.parse(rulesEvent.FormParams))
         _ParamsData = {};
        _params.forEach((x:any) => {
          let _val = x.Value
          if (x.Type == "Field")
            _val = _handleData[x.Value]
          _ParamsData[x.Params] = _val
        });
      }
      // controllerIds.forEach(controllerId => {
        
      //   if (_ParamsData) {
      //     this.pageService.PageAllData = this.pageService.PageAllData.map(x => {
      //       if (x.ID == controllerId) {
      //         x.ParamsData = _ParamsData
      //       }
      //       return x
      //     });
      //   }  
      //   let _ControllerType = rulesEvent.ControllerType?rulesEvent.ControllerType:"Load";
      //   this.pageService.onControllerTrigger.next({ControllerId:controllerId,Type:_ControllerType});      
      // });
    }
    else if (rulesEvent.ActionType == 'Datasource') {
      getDatasoureData(rulesEvent.DataSourceRecId,null,null,'Event',rulesEvent.RestSuccessMsg,rulesEvent.RestFailureMsg);
    }

  }
  const OnRulesApply = (
    rulesData: any,
    RestData: any,
    FieldData?: any,
    RulesType?: any,
    data?: any,
    _form?:any
  ) => {
    let rulesList = rulesData;
    let Form = _form ? _form : form;
    if (rulesData.action) rulesList = rulesData.action;

    let _handleData: any = Form?.getValues();
    _handleData.data = RestData;

    let _PageGroup = stateObject?.PageGroup?stateObject.PageGroup:PageGroup;
    let _fields = getAllFields(_PageGroup);
    for (let index = 0; index < rulesList.length; index++) {
      let rules = rulesList[index];

      if (rules.Condition == "AllowAction") {
        if (RulesType == "OnInit") {
          let _allowAction = rules.Value == "true" ? true : false;
          if (rules.ValidationMessage) {
            toast.warning(rules.ValidationMessage, { autoClose: 3000 });
          }
          if (!_allowAction) {
            // this.closePopup('Rules')
            console.log("closepopup");
          }
        }
      }

      if (rules.Condition == "ClearFieldValue") {
        if (_fields.length>0 && _fields.find((x:any) => x.Name == rules.Field)) {
          Form.setValue(rules.Field, "");
          _PageGroup = setDDLFieldDesc(rules.Field,"");
        }
      }

      if (rules.Condition == "SetFieldValue") {
        let _rulesValue = rules.Value;
        try {
          let _rulesValueArr: any[] = rules.Value.split("<br>");

          _rulesValue = handleBarData(_rulesValueArr[0], {
            ...arguments[0],
            ...stateObject,
            ..._handleData,
          });

          let SelectedValues = form.getValues()[rules.Field];
          let JsonItem = null;
          if (FieldData && FieldData.FieldData)
            JsonItem = JSON.parse(FieldData.FieldData);

          if (
            SelectedValues != null &&
            SelectedValues != "" &&
            JsonItem &&
            JsonItem.rest &&
            JsonItem.rest.IsMultipleSelect
          ) {
            let duplicatedata = SelectedValues.includes(_rulesValue + ",");
            let hascomma = true;
            if (!duplicatedata) {
              hascomma = false;
              duplicatedata = SelectedValues.includes(_rulesValue);
            }

            if (duplicatedata) {
              if (hascomma) {
                SelectedValues = SelectedValues.replace(_rulesValue + ",", "");
              } else {
                SelectedValues = SelectedValues.replace(_rulesValue, "");
              }
              _rulesValue = SelectedValues;

              let removecomma = _rulesValue.slice(-1);
              if (removecomma == ",") {
                _rulesValue = _rulesValue.substring(0, _rulesValue.length - 1);
              }
            }
            if (!duplicatedata) {
              _rulesValue = SelectedValues.concat("," + _rulesValue);
            }
          }

          if (_fields.length>0 && _fields.find((x:any) => x.Name == rules.Field)) {
            Form.setValue(rules.Field, _rulesValue);
          }

          if (_rulesValueArr.length > 1) {
            let _rulesValueDes = handleBarData(_rulesValueArr[1], {
              ...arguments,
              ...stateObject,
              ..._handleData,
            });

            _PageGroup = setDDLFieldDesc(rules.Field,_rulesValueDes);
          }
        } catch (err) {
          alert("SetFieldValueerr -" + err);
          console.log(err);
        }
      }

      if (rules.Condition == "CopyFieldValue") {
        if (rules.Value)
          if (_fields.length>0 && _fields.find((x:any) => x.Name == rules.Field)) {
            Form.setValue(rules.Value, Form.getValues()[rules.Field]);
          }
      }

      if (rules.Condition == "IsEditable") {
        if (rules.Value == "true") {
          _PageGroup = setReadOnlyOnField(_PageGroup, rules.Field, true);
        } else if (rules.Value == "false") {
          _PageGroup = setReadOnlyOnField(_PageGroup, rules.Field, false);
        }
      }
      if (rules.Condition == "IsVisible") {
        if (rules.Value == "true") {
          _PageGroup = setIsHideOnField(_PageGroup, rules.Field, false);
        } else if (rules.Value == "false") {
          _PageGroup = setIsHideOnField(_PageGroup, rules.Field, true);
        }
      }

      if (rules.Condition == "Alert") {
        let Title = handleBarData(rules.Title, {
          ...arguments,
          ...stateObject,
          ..._handleData,
        });
        let Message = handleBarData(rules.Message, {
          ...arguments,
          ...stateObject,
          ..._handleData,
        });
        toast.warning(
          <div>
            <strong>{Title}</strong>
            <div>{Message}</div>
          </div>,
          { autoClose: 3000 }
        );
      }

      if (rules.Condition == "Method") {
        if (rules.Field) {
          // onMethodRules(rules.Field, RestData)
        }
      }
    }
    setState("PageGroup", _PageGroup);
  };
  const setReadOnlyOnField = (
    PageGroup: any[],
    Field: any,
    Readonly: boolean
  ) => {
    PageGroup = PageGroup.map((PG: any) => {
      PG.Groups = setReadOnlyOnFieldInnerGroup(PG.Groups, Field, Readonly);
      return PG;
    });
    return PageGroup;
  };
  const setReadOnlyOnFieldInnerGroup = (
    groups: any[],
    Field: any,
    Readonly: boolean
  ) => {
    groups.map((group) => {
      group.Fields.map((PGF: any) => {
        if (PGF.Name == Field) {
          PGF.Readonly = Readonly;
        }
        return PGF;
      });
      group.Groups = setReadOnlyOnFieldInnerGroup(
        group.Groups,
        Field,
        Readonly
      );
      return group;
    });
    return groups;
  };
  const setIsHideOnField = (PageGroup: any[], Field: any, Hide: boolean) => {
    PageGroup = PageGroup.map((PG: any) => {
      PG.Groups = setIsHideOnFieldInnerGroup(PG.Groups, Field, Hide);
      return PG;
    });
    return PageGroup;
  };
  const setIsHideOnFieldInnerGroup = (
    groups: any[],
    Field: any,
    Hide: boolean
  ) => {
    groups.map((group) => {
      group.Fields.map((PGF: any) => {
        if (PGF.Name == Field) {
          PGF.Hide = Hide;
        }
        return PGF;
      });
      group.Groups = setIsHideOnFieldInnerGroup(group.Groups, Field, Hide);
      return group;
    });
    return groups;
  };
  const setDDLValueOnEditMode = () => {
    let _PageGroupValues = formData?.PageGroupValues??{};
    if (_PageGroupValues && _PageGroupValues.RecId) {

    PageGroup = PageGroup.map((PG: any) => {
      PG.Groups = setDDLValueOnEditModeInnerGroup(PG.Groups);
      return PG;
    });
    return PageGroup;
  }
  }
  const setDDLValueOnEditModeInnerGroup = (groups:any[]) => {
    let _PageGroupValues = formData?.PageGroupValues??{};

    groups.map((group) => {
      group.Fields.map((x:any) => {
        if (x.DataType == "DropDown") {
          
          let _field = x.Name + "_Desc"
          if (_field in _PageGroupValues) {
            
            x.showSelectedValues = _PageGroupValues[_field];
          }
          else {
            x.showSelectedValues = _PageGroupValues[x.Name];
          }
        }
        if (x.DataType == "Date" || x.DataType == "DateTime") {
          if (_PageGroupValues[x.Name]) {
            let _value = _PageGroupValues[x.Name]
            let _Fdata = new Date(_value)
            form.setValue(x.Name, _Fdata);
          }
        }
      });

      group.Groups = setDDLValueOnEditModeInnerGroup(group.Groups);

    })
    return groups;
  }
  const onRulesConditionCheck = (
    rulesData: any,
    RestData?: any,
    FieldData?: any,
    _form?:any
  ) => {
    let Form = _form ? _form : form;
    let _condition = true;

    for (let index = 0; index < rulesData.Condition.length; index++) {
      let _con: any = rulesData.Condition[index].ConditionElement;

      let _Icondition = false;
      let _fieldValue = Form[_con.Field];
      if (FieldData && FieldData.DataType == "Boolean")
        _fieldValue = _fieldValue.toString();

      let _handleData = Form;
      _handleData.data = RestData;

      if (
        _con.FieldType &&
        (_con.FieldType == "Value" || _con.FieldType == "Formula")
      ) {
        _fieldValue = handleBarData(_con.Field, {
          ...arguments[0],
          ...stateObject,
          ..._handleData,
        });
      }

      let value =
        _con.ValueType == "FieldValue" ? Form[_con.Value] : _con.Value;
      if (
        value &&
        _con.ValueType &&
        (_con.ValueType == "Value" || _con.ValueType == "Formula")
      ) {
        if (value == true || value == false) {
          value = value.toString();
        }
        value = handleBarData(value, {
          ...arguments[0],
          ...stateObject,
          ..._handleData,
        });
      }

      _Icondition = checkConditionValidate(_con.Type, _fieldValue, value);

      if (index > 0) {
        if (rulesData.ConditionOperator == 1) {
          _condition = _condition && _Icondition ? true : false;
        } else {
          _condition = _condition || _Icondition ? true : false;
        }
      } else {
        _condition = _Icondition;
      }
    }

    return _condition;
  };
  const setDDLFieldDesc = (Field:any, value:any) =>  {
    PageGroup = PageGroup.map((PG) => {
      PG.Groups = setDDLFieldDescInnerGroup(PG.Groups,Field,value);
      return PG;
    });
    return PageGroup;
  }
  const setDDLFieldDescInnerGroup = (groups:any[],Field:any,value:any) =>  {
    groups.map((group) => {
      group.Fields.map((PGF:any) => {
        if (PGF.Name == Field) {
          PGF.showSelectedValues = value
        }
        return PGF;
      })
      group.Groups = setDDLFieldDescInnerGroup(group.Groups,Field, value);
      return group;
    })
    return groups;
  }
  const _fieldrulesImplement = (rulesData:any,RestData:any,FieldData:any,EventType?:any,_form?:any) => {
    if (!rulesData || !rulesData.Condition) {
      return false
    }

    let _condition = onRulesConditionCheck(rulesData,RestData,FieldData,_form.getValues());
    
    if (_condition) {
      OnRulesApply(rulesData, RestData,FieldData,null,null,_form)
      if (EventType == "Click" || EventType == 'Change')
        OnEventApply(rulesData, RestData,_form)
    }
    else {
      if (rulesData.child && rulesData.child.length > 0) {
        let _elseIfRulescondition = false;
        let _elseIfRules = rulesData.child.filter((x:any) => x.Type == "OnElseIf");

        for (let index = 0; index < _elseIfRules.length; index++) {
          _elseIfRulescondition = onRulesConditionCheck(_elseIfRules[index], RestData, FieldData,_form.getValues())
          if (_elseIfRulescondition) {
            OnRulesApply(_elseIfRules[index], RestData,null,null,null,_form)
            if (EventType == "Click" || EventType == 'Change')
              OnEventApply(_elseIfRules[index], RestData,_form)
            break;
          }
        }
        if (!_elseIfRulescondition) {
          let _elseRules = rulesData.child.filter((x:any) => x.Type == "OnElse");
          if (_elseRules && _elseRules.length > 0) {
            OnRulesApply(_elseRules[0], RestData,null,null,null,_form)
            if (EventType == "Click" || EventType == 'Change'){
              OnEventApply(_elseRules[0], RestData,_form)
            }
          }
        }
        
      }
    }

    return _condition
  }
  const _submitFormValue = (OnBeforeSubmitRules?:any[],OnAfterSubmitRules?:any[],_form?:any) => {
    let Form = _form ? _form : form;

    let formvalue = Form.getValues();
    for (let key in formvalue) {
      if (Object.prototype.toString.call(formvalue[key]) === '[object Date]') {
        formvalue[key] = DateTimeFormater(formvalue[key]);
      }
    }
    let _OnBeforeSubmitRules = stateObject?.OnBeforeSubmitRules?stateObject.OnBeforeSubmitRules:[];
    let _OnAfterSubmitRules = stateObject?.OnAfterSubmitRules?stateObject.OnAfterSubmitRules:[];

    if(OnBeforeSubmitRules&&OnBeforeSubmitRules.length>0){
      _OnBeforeSubmitRules = OnBeforeSubmitRules;
    }
    if(OnAfterSubmitRules && OnAfterSubmitRules.length>0){
      _OnAfterSubmitRules = OnAfterSubmitRules;
    }
    let _forms = {
      PageGroup: PageGroup,
      defaultPageGroups: [],
      PageGroupValues: formvalue,
      EntityObjectsId:formData.Id,
      OnBeforeSubmitRules: _OnBeforeSubmitRules,
      OnAfterSubmitRules: _OnAfterSubmitRules,
      EntityTypeForm:formData,
      fieldFiles:stateObject?.fieldFiles
    }
    submitFormValue(formvalue,Form,_forms,formData.PageGroupValues?formData.PageGroupValues:{});
  }
  const FieldChangeEvent = (FieldData:any,RestData:any,fieldFiles?:any,form?:any) => {
    setState('FieldFiles',fieldFiles);
    let _rulesField:any[] = [];
    if (formData.Rules) {
      let _fieldRules: any[] = JSON.parse(formData.Rules);
      _rulesField = _fieldRules.filter(x => x.Type == "OnFieldChange" || x.Type == "OnFieldClick");
    }
    else {
      return
    }
    let _currentFieldRule = _rulesField.filter(x=>x.Type== "OnFieldChange" && x.field==FieldData.Name)

    for (let rI = 0; rI < _currentFieldRule.length; rI++) {
      _fieldrulesImplement(_currentFieldRule[rI],RestData,FieldData,'Change',form)
    }

   
    _submitFormValue([],[],form)
  }
  const onFormSave = (FormData:any) => {
    if(!FormData){
      return
    }
    if (FormData.Rules) {
      let _formInitRule:any[] = JSON.parse(FormData.Rules);
      let _OnBeforeSubmitRules:any[]=_formInitRule.filter(x => x.Type == "OnBeforeSubmit");
      let _OnAfterSubmitRules:any[]=_formInitRule.filter(x => x.Type == "OnAfterSubmit");
      setState('OnBeforeSubmitRules',_OnBeforeSubmitRules);
      setState('OnAfterSubmitRules',_OnAfterSubmitRules);
      _submitFormValue(_OnBeforeSubmitRules,_OnAfterSubmitRules);

    }else{
      _submitFormValue();
    }
    
  }
  useEffect(() => {
    onFormSave(formData);
    setDDLValueOnEditMode();
  },[])
  useEffect(() => {
    if(data){
      if(type === 'Details'){
        setState("DetailsData", data);
      }else{
        setState("Data", data);
      }
    setState("PageGroup", PageGroup);
    onFormInit(formData, null, data);
    }
  }, [data]);

  useEffect(() => {
    _submitFormValue();
  },[form])
  return (
    <>
      {stateObject?.PageGroup &&
        stateObject?.PageGroup.map((row: any, Index: number) => (
          <div className="flex" key={"group" + row.ID+ " "+formData.FormId}>
            {row.Groups.map((group: any, groupIndex: number) => (
              <div
                key={"inner" +row.ID + "" + groupIndex + " "+formData.FormId}
                className={`detail-group col clearfix ${
                  group.Class
                } w-${getFractionalWidth(group.Width)} ${group.Direction} ${
                  group.Alignment
                } ${group.Position} ${row.Groups.length > 1 ? "dd-size" : ""} ${
                  groupIndex > 0 ? "dd-right" : ""
                }`}
                style={{
                  flexBasis: `${group.Width}%`,
                  maxWidth: `${group.Width}%`,
                }}
              >
                {
                  <GroupField key={formData.FormId+" "+row.ID + "" + groupIndex}
                    fields={group.Fields}
                    data={type==='Details'?stateObject?.DetailsData:stateObject?.Data}
                    type={type}
                    form={type==='Details'?null:form}
                    FieldChangeEvent={(form,FieldData,RestData) => (type !== 'Details'?(FieldChangeEvent(FieldData,RestData,null,form),setform(form)):{})}
                  ></GroupField>
                }
              </div>
            ))}
          </div>
        ))}
    </>
  );
}
export default GroupView;