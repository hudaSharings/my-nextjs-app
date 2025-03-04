import React, { useEffect } from "react";
import { useGroupedState } from "../customState";
import { CheckSingleQuoteReplace } from "../_Details/page";
import { apps4xService, handleBarData } from "@/services/apps4xService";
import { toast } from "react-toastify";

interface DropdownProps {
  Field: any;
  form:any;
  CloseShowTable:() => void
  OpenTable:() => void
  ChangeEvent:(data:any,Field:any,value:any) => void
}

function AutoCompleteDropdown({
  Field,
  form,
  CloseShowTable,
  OpenTable,
  ChangeEvent
}:DropdownProps) {
  const { stateObject, setState } = useGroupedState();

  const filterRemianingList = (col:any,value:any) => {
    let _TempGridData = stateObject?.TempGridData;
    let _dropDownData:any[] = [];
    let _filter:any = {};
    _filter[col.Field] = value;
    for (let key in _filter) {
      
      _dropDownData = _TempGridData.filter((x:any) => {
        
        if (x[key] && (x[key]).toLowerCase().indexOf((_filter[key].trim()).toLowerCase()) > -1) {
          return x;
        }
      });
    }
    setState('dropDownData',_dropDownData);
  }
  const expandAllRow = (data:any) => {
    data = data.map((item:any) => {    
        item = expandrecursiveloop(item,true);
        return item;
    });
    setState('dropDownData',data);
  }

  const collapseAllRow = (data:any) => {
    data = data.map((item:any) => {
      item = expandrecursiveloop(item,false);
      return item;
    });
    setState('dropDownData',data);
  }

  const expandrecursiveloop = (item:any,expand:any) => {
    item.IsExpanded = expand;
    if (item.child && item.child.length > 0) {
      item.child.map((child:any) => {
        child = expandrecursiveloop(child,expand);
        return child;
      });
    }
    return item;
  }
  const expandRow = (item:any, i:number) => {
    item.IsExpanded = true;
  }
  const collapseRow = (item:any, i:number) => {
    item.IsExpanded = false;
  }

  const getRowFieldValue = (row:any, field: any) => {
    let _fieldVal = "empty";
    if (field.FieldData) {
      var jsonItem = JSON.parse(field.FieldData);
      if (jsonItem.isDynamic && jsonItem.rest)
        _fieldVal = row[jsonItem.rest.valueField];
    }
    return _fieldVal
  }
  const getSingleRowFieldValue = (row:any, field:any) => {
    let _fieldVal = "empty";
    if (field.FieldData) {
      var jsonItem = JSON.parse(field.FieldData);
      if (!jsonItem.isDynamic)
        _fieldVal = row['value'];
    }
    return _fieldVal
  }

  const getDataInResponseView = (item:any, col:any) => {
    let _ret = null;
    if (col.ResponseView) {
      let _rview = col.ResponseView.split(".");
      _rview.forEach((x:any) => {
        if (item) {
          item = item[x];
          _ret = item;
        }
        else
        _ret = "";
      });
    }
    else {
      _ret =item[col?.Field];
    }
    return _ret
  }
  const loadTreeView = (restData:any, field:any ,data:any[]) => {
    if (restData.TreeView) {
      if (restData.TreeView.ExpandedKey && restData.TreeView.ParentKey && restData.TreeView.ChildKey) {

        let _DyanamicTreeList = data.map((item) => {
          if (!item.child) {
            item.child = data.filter(x => x[restData.TreeView.ParentKey] == item[restData.TreeView.ChildKey]);
          }
          return item
        });
        data = _DyanamicTreeList.filter(x => (!x[restData.TreeView.ParentKey] || x[restData.TreeView.ParentKey] == 0));
        expandAllRow(data);
        setState('dropDownData',data);
      }
    }
  }
  const ClearAllValues = () => {
    Field.AutoSearchText = null;
    setState('dropDownData',[]);
    setState('TempGridData',[]);
    setState('dropDownGridFilter',{});
    Field.isSearch = false;
    CloseShowTable();
  }
  const loadDropdown = (field: any, SearchText?: any) => {
    if (!Field.showTable) {
      return
    }

    if (field.FieldData) {
      var jsonItem = JSON.parse(field.FieldData);
      if (jsonItem.isDynamic && jsonItem.rest
        && (((jsonItem.rest.DataSourceType == "RestApi" || jsonItem.rest.DataSourceType == "RestAPIConnector" || jsonItem.rest.DataSourceType == "SwaggerConnector" || !jsonItem.rest.DataSourceType)
          && jsonItem.rest.ApiUrl)
          || (jsonItem.rest.DataSourceType == "Query" && jsonItem.rest.DataSourceId)
          || (jsonItem.rest.DataSourceType == "Entity" && jsonItem.rest.DataSourceId)
          || (jsonItem.rest.DataSourceType == "SQLConnector" && jsonItem.rest.DataSourceId))) {
        let isDepandancyvalue = true;
        let _formvalue = null;

        if(form)
         _formvalue = form;

        let restData: any = jsonItem.rest;

        let _handleData: any = {};
        // if (this.ParameterData) {
        //   _handleData.params = this.ParameterData;
        // }
        _handleData.FormData = _formvalue;


        if (restData.DataSourceType == "RestApi" || restData.DataSourceType == "RestAPIConnector" || restData.DataSourceType == "SwaggerConnector" 
          || !restData.DataSourceType || restData.DataSourceType == "Entity"          
          ) {

          restData.QueryStrings.forEach((query:any) => {
            if (query.schema.type == 'FieldValue') {
              if (!_formvalue[query.Value] && query.required == true) {
                isDepandancyvalue = false;
                return;
              }
            }

          });
        }


        if (restData.DataSourceType == "RestApi" || restData.DataSourceType == "RestAPIConnector" || restData.DataSourceType == "SwaggerConnector" || !restData.DataSourceType) {

          restData.QueryStrings = restData.QueryStrings.map((x:any) => {
            x.Value = handleBarData(x.Value, {...arguments[0],...stateObject,..._handleData});
            return x
          });

          restData.Headers = restData.Headers.map((x:any) => {
            x.Value = handleBarData(x.Value, {...arguments[0],...stateObject,..._handleData});
            return x
          });
          if(restData.Path && restData.Path.length>0){
            restData.Path.forEach((x:any) => {
             let path = {
              [x.name]:handleBarData(x.Value, {...arguments[0],...stateObject,..._handleData})
             }
             _handleData = {..._handleData,...path}
            })
            if(restData.ApiUrl){
              restData.ApiUrl = CheckSingleQuoteReplace(restData.ApiUrl)
            }
          }

          restData.ApiUrl = handleBarData(restData.ApiUrl, {...arguments[0],...stateObject,..._handleData});
          restData.Body = handleBarData(restData.Body, {...arguments[0],...stateObject,..._handleData});
          if (restData.Body && restData.BodyType == 'json' && typeof restData.Body == "string") {
            restData.Body = JSON.parse(restData.Body);
          }
          if (!isDepandancyvalue) {
            return;
          }
        }
        if (restData.DataSourceType == "RestApi" || restData.DataSourceType == "RestAPIConnector" || restData.DataSourceType == "SwaggerConnector") {
          setState('isLoader' ,true);

          apps4xService.dynamicAPi(restData, _formvalue,null, SearchText, restData.Havecriteria)
            .then((ress: any) => {
              setState('isLoader' ,false);
              
              if (!ress)
                ress = {};

              let res = ress;
              if (restData.ResponseView) {
                let _rview = restData.ResponseView.split(".");
                _rview.forEach((x:any) => {
                  if (ress) {
                    ress = ress[x];
                    res = ress;
                  }
                  else
                    res = "";
                });
              }
              else {
                if (ress.Data) {
                  res = ress.Data;
                  if (res.Data)
                    res = res.Data
                }
                if (ress.content) res = ress.content;

                if (ress.entities) res = ress.entities;
                if (ress.templates) res = ress.templates;

              }
              if(restData.TotalCount){
                let _rview = restData.TotalCount.split(".");
                _rview.forEach((x:any) => {
                  res.TotalCount = res[x];
                }); 
              }

              if (res && Array.isArray(res) && res.length > 0) {
                setState('dropDownData', res);
                setState('TempGridData', res);
              loadTreeView(restData, field , res);

              } else if (
                Object.keys(res).length > 0 &&
                Object.keys(res).includes('List')
              ) {
                setState('dropDownData', res['List']);
                setState('TempGridData', res['List']);
               loadTreeView(restData, field , res['List']);

              } else {
                setState('dropDownData', []);
                setState('TempGridData', []);
                loadTreeView(restData, field , []);

              }


            });
        } else if (restData.DataSourceType == "Query") {
          restData.QueryParameter = restData.QueryParameter.map((x:any) => {
            x.Value = handleBarData(x.Value, {...arguments[0],...stateObject,..._handleData});
            return x
          });
          let condition = null;
          let _queryData:any = restData.DataSource;
          if (_queryData) {
            if (!Array.isArray(_queryData)) {
              if (_queryData.Condition && _queryData.Condition.length > 0) {
                _queryData.Condition = _queryData.Condition.map((x: any) => {
                  x.Value = handleBarData(x.Value, {...arguments[0],...stateObject,..._handleData});
                  return x;
                });
                let _condition = {
                  Condition: _queryData.Condition,
                  ConditionOperator: _queryData.ConditionOperator
                }
                condition = JSON.stringify(_condition)
              }
            }
          }
          setState('isLoader' ,true);

          apps4xService.getDyamicQueryData(restData.DataSourceId, null, restData.QueryParameter, condition)
            .then((ress: any) => {
              
              setState('isLoader' ,false);

              let res = ress;
              if (ress.Data) {
                res = ress.Data;
                if (res.Data)
                  res = res.Data
              }


              if (res && Array.isArray(res) && res.length > 0) {
                setState('dropDownData', res);
                setState('TempGridData', res);
                loadTreeView(restData, field,res);

              } else if (
                Object.keys(res).length > 0 &&
                Object.keys(res).includes('List')
              ) {
                setState('dropDownData', res['List']);
                setState('TempGridData', res['List']);
                loadTreeView(restData, field,res['List']);

              } else {
                setState('dropDownData', []);
                setState('TempGridData', []);
                loadTreeView(restData, field,[]);

              }
            },
              (error) => {
                setState('isLoader' ,false);           
              });
        } else if (restData.DataSourceType == "Entity") {

          restData.QueryStrings.forEach((query:any) => {
            if (query.schema.type == 'FieldValue') {

              if (!_formvalue[query.Value] && query.required == true) {
                toast.warning('please fill' + query.Value);
                isDepandancyvalue = false;
                return;
              }
              query.Value = _formvalue[query.Value];  //FieldValue  = 
            }
            else {
              query.Value = handleBarData(query.Value, {...arguments[0],...stateObject,..._handleData});
            }
          });

          let _Searchcriteria: any = {
              pageNo: 1,
              pageSize: 10,
            Where: [],
            SortOrder: {direction:1,field:null},
          }


          let _QueryString:any[] = [];
          if (restData.QueryStrings.length > 0) {

            restData.QueryStrings.map((x:any) => {
              let filterobj = {
                Field: '',
                Operator: 'eq',
                TableAlias: '',
                Value: '',
              };
              filterobj.Field = x.name;
              let _Value = handleBarData(x.Value, {...arguments[0],...stateObject,..._handleData});;
              filterobj.Value = _Value;
              _QueryString.push(filterobj);
            });
            _Searchcriteria.Where.push(..._QueryString);
          }
          if (!isDepandancyvalue) {
            return;
          }
          let condition = null;
          let EnityData:any = restData.DataSource;
          if (EnityData) {
            if (!Array.isArray(EnityData)) {
              if (EnityData.Condition && EnityData.Condition.length > 0) {

                EnityData.Condition = EnityData.Condition.map((x: any) => {
                  x.Value = handleBarData(x.Value, {...arguments[0],...stateObject,..._handleData});
                  return x;
                });
                let _condition = {
                  Condition: EnityData.Condition,
                  ConditionOperator: EnityData.ConditionOperator
                }
                condition = JSON.stringify(_condition)
              }
            }
          }
          setState('isLoader' ,true);
          apps4xService.getDynamicList(null,restData.DataSourceId,_Searchcriteria)
            .then((ress: any) => {
              
              let res = ress;
              setState('isLoader' ,false);

              if (ress.Data) {
                res = ress.Data;
                if (res.Data)
                  res = res.Data
              }


              if (res && Array.isArray(res) && res.length > 0) {
                setState('dropDownData', res);
                setState('TempGridData', res);
                loadTreeView(restData, field,res);

              } else if (
                Object.keys(res).length > 0 &&
                Object.keys(res).includes('List')
              ) {
                setState('dropDownData', res['List']);
                setState('TempGridData', res['List']);
                loadTreeView(restData, field,res['List']);

              } else {
                setState('dropDownData', []);
                setState('TempGridData', []);
              loadTreeView(restData, field,[]);

              }
            },
              (error) => {
                setState('isLoader' ,false);                
              }
            );
        } else if (restData.DataSourceType == "SQLConnector") {
          if (restData.DataSourceId) {
            let _Searchcriteria: any = {
              pageNo: 1,
              pageSize: 10,
              Where: [],
              SortOrder: {direction:1},
            }

            let _objectType: any;
            if (restData.DataSource) {
              _objectType = restData.DataSource;
            }
            let condition = null;
            if (_objectType && _objectType.Condition && _objectType.Condition.length > 0) {
              _objectType.Condition = _objectType.Condition.map((x: any) => {
                if (x.Value) {
                  if (x.Value == "FieldValue") {
                    if (_formvalue[x.Value])
                      x.Value = _formvalue[x.Value];
                  }
                  else
                    x.Value = handleBarData(x.Value, {...arguments[0],...stateObject,..._handleData});
                }
                return x;
              });
              let _condition = {
                Condition: _objectType.Condition,
                ConditionOperator: _objectType.ConditionOperator
              }
              condition = JSON.stringify(_condition)
            }
            if (!isDepandancyvalue) {
              return;
            }
            setState('isLoader' ,true);

            apps4xService.getSqlDetails(restData.DataSourceId, _objectType.Type, _objectType.Name, _Searchcriteria).then(
              (Res: any) => {
                
                setState('isLoader' ,false);

                let _data: any = Res.Data ? Res.Data : Res;

                if (_data && Array.isArray(_data) && _data.length > 0) {
                setState('dropDownData', _data);
                setState('TempGridData', _data);
                }
                else {
                  setState('dropDownData', []);
                setState('TempGridData', []);
                }

              }, (error: any) => {
                setState('isLoader' ,false);

              });
          }
        } else {          
          setState('isLoader' ,true);

          apps4xService.dynamicAPi(restData, _formvalue, null, SearchText, restData.Havecriteria)
            .then((ress: any) => {
              

              let res = ress;
              setState('isLoader' ,false);


              if (restData.ResponseView) {
                let _rview = restData.ResponseView.split(".");
                _rview.forEach((x:any) => {
                  if (ress) {
                    ress = ress[x];
                    res = ress;
                  }
                  else
                    res = "";
                });
              }
              else {
                if (ress.Data) {
                  res = ress.Data;
                  if (res.Data)
                    res = res.Data
                }
                if (ress.content) res = ress.content;

                if (ress.entities) res = ress.entities;
                if (ress.templates) res = ress.templates;

              }
              if(restData.TotalCount){
                let _rview = restData.TotalCount.split(".");
                _rview.forEach((x:any) => {
                  res.TotalCount = res[x].totalCount;
                }); 
              }

              if (res && Array.isArray(res) && res.length > 0) {
                setState('dropDownData', res);
                setState('TempGridData', res);
              loadTreeView(restData, field,res);

              } else if (
                Object.keys(res).length > 0 &&
                Object.keys(res).includes('List')
              ) {
                setState('dropDownData', res['List']);
                setState('TempGridData', res['List']);
              loadTreeView(restData, field,res['List']);

              } else {
                setState('dropDownData', []);
                setState('TempGridData', []);
              loadTreeView(restData, field,[]);

              }
            });
        }

      } else if (jsonItem.isDynamic && jsonItem.api && jsonItem.api.url) {
        const url = jsonItem.api.url;
        setState('isLoader' ,true);
        apps4xService.getDyamicUrl(url)
          .then((ress: any) => {
            setState('isLoader' ,false);
            let res = ress;
            if (ress && ress?.entities) res = ress.entities;
            if (ress && ress?.Data) res = ress.Data;
            if (ress && ress?.templates) res = ress.templates;
            if (ress && ress?.Data && ress?.Data?.Data) res = ress.Data.Data;

            if (res && Array.isArray(res) && res.length > 0) {
              let _dropDownData = res.map((x) =>
                Object.assign({
                  Id: x[jsonItem.api.valueField],
                  Description: x[jsonItem.api.textField],
                })
              );
              setState('dropDownData', _dropDownData);
              setState('TempGridData', _dropDownData);
            } else if (
              Object.keys(res).length > 0 &&
              Object.keys(res).includes('List')
            ) {
              let _dropDownData = res['List'].map((x:any) =>
                Object.assign({
                  Id: x[jsonItem.api.valueField],
                  Description: x[jsonItem.api.textField],
                })
              );
              setState('dropDownData', _dropDownData);
              setState('TempGridData', _dropDownData);
            } else {
              setState('dropDownData', []);
              setState('TempGridData', []);
            }
          });
      } else {
        if (
          jsonItem.options &&
          Array.isArray(jsonItem.options) &&
          jsonItem.options.length > 0
        ) {
          setState('dropDownData', jsonItem.options);
          setState('TempGridData', jsonItem.options);

        } else {
          setState('dropDownData', []);
          setState('TempGridData', []);
        }

      }
    }

  }
 const showAutoSearchTextBox = (field: any) => {
    
  let _ret = false;
  let jsonItem:any = {}
  if(field.FieldData != ''){
    jsonItem = JSON.parse(field.FieldData);
  }

  if (jsonItem && jsonItem.isDynamic && jsonItem.rest && jsonItem.rest.HasServerSideSearch) {
    _ret = true;
  }
  return _ret
}
const clearSelectedData = (field: any) => {
  setState('selectedValue',null);
  form[field.Name] = null;

  if(field)
    field.showSelectedValues = null;

  ChangeEvent(null, field, null);

}
const selectDropDownRow = (row:any, field: any) => { 

  let showValue = '';
  let _fieldVal = null;

    let jsonItem:any = {}
    if(field.FieldData != ''){
      jsonItem = JSON.parse(field.FieldData);
    }
  if (!jsonItem.rest || !jsonItem.rest.IsMultipleSelect) {
    ClearAllValues()
  }

  if ((jsonItem && jsonItem.rest && jsonItem.rest.IsMultipleSelect)) {
    if (form) {
      if (form["MultipleIdField"])
        form["MultipleIdField"] = field.Name;
    }
  }

 
  if (jsonItem.isDynamic) _fieldVal = row[jsonItem.rest.valueField];
  else {
    _fieldVal = row['value']
    setState('isSingleSelect', true);
  };


  if (_fieldVal)
    _fieldVal = _fieldVal.toString();
  let SelectedValues = null;
  if (form)
    SelectedValues = form[field.Name];


  if ((SelectedValues != null && SelectedValues != '' && jsonItem.rest && jsonItem.rest.IsMultipleSelect)) {
    SelectedValues = SelectedValues.toString();
    let duplicatedata = SelectedValues.includes( _fieldVal + ',');
    let hascomma = true;
    if (!duplicatedata) {
      hascomma = false;
      duplicatedata = SelectedValues.includes(_fieldVal);
    }

    if (duplicatedata) {
      if (hascomma) {
        SelectedValues = SelectedValues.replace(_fieldVal + ',', '');
      } else {
        SelectedValues = SelectedValues.replace(_fieldVal, '');
      }
      _fieldVal = SelectedValues;

      let removecomma = _fieldVal.slice(-1);
      if (removecomma == ',') {
        _fieldVal = _fieldVal.substring(0, _fieldVal.length - 1);
      }
    }
    if (!duplicatedata) {
      _fieldVal = SelectedValues.concat(',' + _fieldVal);
    }

  }
  if (jsonItem && jsonItem.rest) {
    let _filedDropdown: any = jsonItem.rest
    if (_filedDropdown.TextboxShowData && _filedDropdown.TextboxShowData.length > 0) {

      showValue = ''
      _filedDropdown.TextboxShowData.forEach((element:any) => {
        
        if (element.Type == "All" || true)
          showValue = showValue + row[element.Column] + "-";
      });
      if (showValue) {
        let value = showValue.charAt(showValue.length - 1)
        if (value == "-") {
          showValue = showValue.substring(0, showValue.length - 1)
        }

      }
    }
    else {

      let num = _fieldVal.split(',')[0];
      if (!Number.isNaN(num)) {
        showValue = _fieldVal;
      }
      else
        showValue = row[stateObject?.dropDownColumn[1]];
    }
  }
  else
    showValue = row[stateObject?.dropDownColumn[1]]
setState('selectedValue',_fieldVal);
Field.AutoSearchText = _fieldVal;

  if (form)
    form[field.Name] = _fieldVal;     

  if(Field)
  Field.showSelectedValues = showValue;

  ChangeEvent(row, Field,_fieldVal);
}
const loadDropdownColumn = (field: any,isFieldType?:boolean) => {
    
  let columns: any[] = [
    { Field: 'value', Name: 'value' },
    { Field: 'text', Name: 'text' }
  ];
  let _dropDownColumn:any[]=[];
  
  let jsonItem:any = {}
  if(field.FieldData != ''){
    jsonItem = JSON.parse(field.FieldData);
  }

  if (jsonItem && jsonItem.isDynamic && jsonItem.rest) {
    let restData: any = jsonItem.rest;
    if (restData.Column && restData.Column.length > 0) {

      setState('dropDownColumn',[]);
      let _data = restData.Column;
      let _valcol: any = { Field: restData.valueField, Name: restData.valueField }
      if (!(_dropDownColumn.find((x:any) => x.Name == _valcol.Name))){
        _dropDownColumn.push(_valcol);
      }
      _dropDownColumn.forEach((f) => {
        if(_data.find((x:any) => x.Name == _valcol.Name || f.Name == x.Name)){
          _data = _data.filter((x:any) => x.Name != _valcol.Name && f.Name != x.Name);
        }
      });

      _dropDownColumn.push(..._data);

    } else {
      columns = [];
      let _valcol: any = { Field: restData.valueField, Name: restData.valueField }
      columns.push(_valcol);
      let _col = restData.textField.split(',');
      _col.map((x: any) => {
        let _col: any = { Field: x, Name: x };
        if(!(columns.find(y => y.Name == _col.Name)))
        columns.push(_col);
      });
      _dropDownColumn = columns;
    }

    if (jsonItem.rest.Havecriteria) {
      Field.showSearchBox = true;
    } else {
      let showSearchBox: boolean = false;
      let SearchValue = jsonItem.rest.QueryStrings.filter((x:any) => x.Type == "SearchValue");
      if (SearchValue.length > 0) {
        showSearchBox = true;
      }
      if (showSearchBox) {
        Field.showSearchBox = true;
      }
    }

    if (restData.TreeView) {
      if (restData.TreeView.ExpandedKey && restData.TreeView.ParentKey && restData.TreeView.ChildKey) {
        _dropDownColumn.find(v => v.Field === restData.TreeView.ExpandedKey).IsExpanded = true;
      }
    }

  } else {
    _dropDownColumn = columns;
   
  }

    if (jsonItem && jsonItem.isDynamic && jsonItem.rest && jsonItem.rest.HasServerSideSearch) {
      return
    }
    setState ('dropDownColumn',_dropDownColumn)
    loadDropdown(field,null);
}
const LoadBody = (val:any, i:number,level:number) => {
  return (
    <React.Fragment key={i}>
      <tr
        className={`cursor-pointer border border-gray-300 border-l-0 ${
          stateObject?.selectedValue?.includes(getRowFieldValue(val, Field))
            ? "bg-blue-100"
            : ""
        }`}
        onClick={() => selectDropDownRow(val, Field)}
      >
        <td className="w-10">
          <span>
            <i className="tabler-ti ti-check text-theme"></i>
          </span>
          <span
            className="hidden"
            onClick={() => selectDropDownRow(val, Field)}
          >
            <i className="tabler-ti ti-check text-theme"></i>
            <input
              type="checkbox"
              defaultChecked={false}
              checked={stateObject?.selectedValue?.includes(
                getSingleRowFieldValue(val, Field)
              )}
              name={Field.Name}
              className="themecolor"
              readOnly
            />
          </span>
        </td>
        {stateObject?.dropDownColumn &&
          stateObject.dropDownColumn.map((col: any, ci: number) => (
            <td className="border border-gray-300 border-l-0"
              key={ci}
              style={{
                paddingLeft:
                  col.IsExpanded && level ? 25 * level + "px" : "8px",
              }}
            >
              {col.IsExpanded && val.child && val.child.length > 0 && (
                <span
                  className="cursor-pointer"
                  onClick={() =>
                    val.IsExpanded ? collapseRow(val, i) : expandRow(val, i)
                  }
                >
                  {val.IsExpanded ? "-" : "+"}
                </span>
              )}
              {getDataInResponseView(val, col)}
            </td>
          ))}
      </tr>
      {val.child &&
        val.IsExpanded &&
        val.child.map((child: any, ci: number) =>
          LoadBody(child, ci, level + 1)
        )}
    </React.Fragment>
  );
}
const loadTable = () => {
  let _showTable:boolean = stateObject?.showTable;
  if(_showTable) {
    OpenTable() 
  }else {
      CloseShowTable()
    }
}
useEffect(() => {
  if(Field.showTable === true){
  setState('showTable',true);
  loadDropdown(Field);
  }else{
    setState('showTable',false)
  }
},[Field.showTable])

  useEffect(() => {
    setState('selectedValue',Field.showSelectedValues?Field.showSelectedValues:form[Field.Name]);
  }, [Field.showSelectedValues]);
  useEffect(() => {
    loadDropdownColumn(Field);
  },[])

  return (
    <div id={`autoComplete_dropdown_${Field.Name}`} className="relative">
      <div className="control-input">

        <label onClick={loadTable}
          className={`form-control m-0 relative field_data autoComplete_dropdown_label block w-full h-8 p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 
          ${Field.Mandatory && !stateObject?.selectedValue ? "border-red is-invalid" : ""} 
          ${stateObject?.showTable || stateObject?.selectedValue ? "isfloatingfocus" : ""} 
          ${showAutoSearchTextBox(Field) && !stateObject?.selectedValue ? "p-0" : ""}`}
          
        > 
          {Field.showSelectedValues || stateObject?.selectedValue && stateObject.selectedValue}
          
        </label>
        {stateObject?.selectedValue && (
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => clearSelectedData(Field)}>
              x
            </span>
          )}
      </div>

      {stateObject?.showTable && (
        <div className="absolute bg-white">
          <table className="table-auto w-full text-left border-collapse shadow-lg border border-gray-300  rounded-md mt-2 p-2 ">
            <thead>
              <tr className="border-b border-gray-300">
                <td className="w-1"></td>
                {stateObject?.dropDownColumn && stateObject.dropDownColumn.map((col:any, i:number) => (
                  <td key={i} className="border border-gray-300 px-2 border-l-0">
                    <div className="font-bold">
                    {col.Name}
                    </div>
                    <div className="my-1">
                    <input className="shadow-lg border border-gray-300 rounded-sm" type="search" onChange={(e) => filterRemianingList(col,e.target.value)} placeholder="Search" />
                    </div>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {stateObject?.dropDownData && stateObject.dropDownData.map((val:any, i:number) => (
                LoadBody(val,i,0)
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AutoCompleteDropdown;