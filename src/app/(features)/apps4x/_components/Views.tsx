"use clients";
import { checkConditionValidate } from "@/services/apps4xService";
import { handleBarData } from "../_Details/page";
import { useGroupedState } from "../customState";
import GroupField from "./Fields";
import { useEffect } from "react";
import { toast } from "react-toastify";

type props = {
  PageGroup: any[];
  data: any;
  formData: any;
  type: 'Details' | 'Create' ;
};
function GroupView({ PageGroup, data, formData ,type }: props) {
  const { stateObject, setState } = useGroupedState();

  const getFractionalWidth = (width: any) => {
    const fractions: any = { 100: "full", 75: "3/4", 50: "1/2", 25: "1/4" };
    return fractions[width] || `${width}%`;
  };
  const getAllFields = (pageGroups:any[]) => {

    let fields:any[] =[];
 
     for (let index = 0; index < pageGroups.length; index++) {
       let Groups = pageGroups[index].Groups;
       for (let i = 0; i < Groups.length; i++) {
         fields.push(...Groups[i].Fields)
       }
     }
     return fields;
 
   }
  const onFormInit = (FormData: any, RestData?: any, data?: any) => {
    if (FormData.Rules) {
      let _formInitRule: any[] = JSON.parse(FormData.Rules);

      let onInitRules = _formInitRule.filter((x) => x.Type == "OnInit");

      for (let index = 0; index < onInitRules.length; index++) {
        let rulesData = onInitRules[index];

        if (!rulesData) {
          return;
        }

        let _condition = onRulesConditionCheckForRules(rulesData, RestData);

        if (_condition) {
          OnRulesApply(rulesData, RestData, null, "OnInit", data);
        } else {
          if (rulesData.child && rulesData.child.length > 0) {
            let _elseIfRulescondition = false;
            let _elseIfRules = rulesData.child.filter(
              (x: any) => x.Type == "OnElseIf"
            );

            for (let index = 0; index < _elseIfRules.length; index++) {
              _elseIfRulescondition = onRulesConditionCheckForRules(
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
  const OnRulesApply = (
    rulesData: any,
    RestData: any,
    FieldData?: any,
    RulesType?: any,
    data?: any
  ) => {
    let rulesList = rulesData;
    if (rulesData.action) rulesList = rulesData.action;

    let _handleData: any = { ...arguments[0] };
    _handleData.data = RestData;

    let _data = stateObject?.Data?stateObject.Data:data;
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
          _data[rules.Field] = ""; // Directly updating the property
        }
      }

      if (rules.Condition == "SetFieldValue") {
        let _rulesValue = rules.Value;
        try {
          let _rulesValueArr: any[] = rules.Value.split("<br>");

          _rulesValue = handleBarData(_rulesValueArr[0], {
            ...arguments,
            ...stateObject,
            _handleData,
          });

          let SelectedValues = _data[rules.Field];

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
            _data[rules.Field] = _rulesValue;
          }

          if (_rulesValueArr.length > 1) {
            let _rulesValueDes = handleBarData(_rulesValueArr[1], {
              ...arguments,
              ...stateObject,
              _handleData,
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
            _data[rules.Value] = _data[rules.Field];
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
          _handleData,
        });
        let Message = handleBarData(rules.Message, {
          ...arguments,
          ...stateObject,
          _handleData,
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
    setState("Data", _data);
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
  const onRulesConditionCheckForRules = (
    rulesData: any,
    RestData?: any,
    FieldData?: any
  ) => {
    let _condition = true;

    for (let index = 0; index < rulesData.Condition.length; index++) {
      let _con: any = rulesData.Condition[index].ConditionElement;

      let _Icondition = false;

      let _fieldValue = data[_con.Field];
      if (FieldData && FieldData.DataType == "Boolean")
        _fieldValue = _fieldValue.toString();

      let _handleData = data;
      _handleData.data = RestData;

      if (
        _con.FieldType &&
        (_con.FieldType == "Value" || _con.FieldType == "Formula")
      ) {
        _fieldValue = handleBarData(_con.Field, {
          ...arguments[0],
          stateObject,
          _handleData,
        });
      }

      let value =
        _con.ValueType == "FieldValue" ? data[_con.Value] : _con.Value;
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
          stateObject,
          _handleData,
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
  useEffect(() => {
    if(data){
    setState("Data", data);
    setState("PageGroup", PageGroup);
    onFormInit(formData, null, data);
    }
  }, [data]);
  return (
    <>
      {stateObject?.PageGroup &&
        stateObject?.PageGroup.map((row: any, Index: number) => (
          <div className="flex" key={"group" + row.ID}>
            {row.Groups.map((group: any, groupIndex: number) => (
              <div
                key={"inner" + group.ID}
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
                  <GroupField
                    fields={group.Fields}
                    data={stateObject?.Data}
                    type={type}
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
