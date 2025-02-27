import { useState, useRef, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useGroupedState } from "../customState";
import { apps4xService } from "@/services/apps4xService";
import { toast } from "react-toastify";
import { handleBarData } from "../_Details/page";

type props = {
  Field: any;
  form : any;
}

export default function RelationTable({
  Field,
  form
}: props) {
    const { stateObject, setState } = useGroupedState();
  const [showTable, setShowTable] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const loadRelationTable = () => {
    let _showTable:boolean = showTable?false:true
    setShowTable(_showTable);
    if(_showTable){
    getRelationEntityData();
    }
  }
  const clearSelectedData = () => {
    setSelectedValue(null);
    setState('selectedRow',null);
    setState('selectdRelationEntityField', null);
    setState('selectdRelationDisplayField', null);
    if (form)
        form[Field.Name]  = null;
    // this.ChangeEvent.emit({ data: null, Field: this.Field, value: this.selectdRelationEntityField });
  }
  const getRelationEntityData = (load?:boolean,selectdRelationEntityField?:string,selectdRelationDisplayField?:string) => {

    let isDepandancyvalue = true;
    let _selectdRelationEntityField = stateObject?.selectdRelationEntityField;
    let _selectdRelationDisplayField = stateObject?.selectdRelationDisplayField;
    let _selectedRow = stateObject?.selectedRow;
    if(load){
        _selectdRelationDisplayField = selectdRelationDisplayField;
        _selectdRelationEntityField = selectdRelationEntityField;
    }
    let _Searchcriteria: any = {
          pageNo: 1,
          pageSize: 10,
        Where: [],
        SortOrder: null,
      };

       if(Field.DependentLookupField && true) {
      let _formvalue:any = {};
      if(form){
       _formvalue = form;
      }
      let _DependentLookupField:any[] = JSON.parse(Field.DependentLookupField);

      _DependentLookupField.forEach(DLF => {

        if (_formvalue[DLF.Field]) {
          let filterobj = {
            Field: DLF.RelatedField,
            Operator: 'eq',
            Value: _formvalue[DLF.Field],
          };
          
          if (_Searchcriteria.Where.find((x:any) => x.Field == DLF.RelatedField)) {
            let _index = _Searchcriteria.Where.findIndex((x:any) => x.Field == DLF.RelatedField);
            if (_index >= 0)
            _Searchcriteria.Where.splice(_index, 1)
          }
          _Searchcriteria.Where.push(filterobj)
        }
        if (DLF.Mandatory) {
          if (_formvalue[DLF.Field] == null || _formvalue[DLF.Field] == "") {
            toast.warning('please fill ' + DLF.Field);
            isDepandancyvalue = false;
            return;
          }
        }
      });
    }


    let condition = null;
    if (Field.RelationEntityCondition && true) {
      let _handleData: any = {};
    //   if (this.ParameterData) {
    //     _handleData.params = this.ParameterData;
    //   }
      _handleData.FormData = {};
      if (form)
        _handleData.FormData = form;


      let EnityData = JSON.parse(Field.RelationEntityCondition);
      if (EnityData) {
        if (!Array.isArray(EnityData)) {
          if (EnityData.Condition && EnityData.Condition.length > 0) {

            EnityData.Condition = EnityData.Condition.map((x: any) => {
              x.Value = handleBarData(x.Value, {...arguments[0],...stateObject,_handleData});
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
    }

    if (!isDepandancyvalue) {
      setShowTable(false);
      return;
    }

    if(!form[Field.Name] && !_selectdRelationEntityField) {
        _selectdRelationEntityField = null;
        _selectdRelationDisplayField = null;
    }

    apps4xService.getDynamicList(null,Field.RelationEntity,_Searchcriteria,condition).then((res:any) => {
      
      let _RelationDataLength = res.TotalCount;
      let _RelationData = res.Data; 
      if(load && _selectdRelationEntityField && _RelationData.length>0){
        _selectedRow =_RelationData.find((x:any) => x[Field.RelationEntityField] == _selectdRelationEntityField);
        if(_selectedRow)
        _selectdRelationDisplayField = _selectedRow[Field.RelationEntityDisplayField]
      }
      setState('RelationData', _RelationData);
      setState('RelationDataLength', _RelationDataLength);
      setState('selectedRow', _selectedRow);
      setState('selectdRelationEntityField', _selectdRelationEntityField);
      setState('selectdRelationDisplayField', _selectdRelationDisplayField);
      setSelectedValue(_selectdRelationEntityField);
    },
      (error) => {

      });
  }
  const getRelationEntityLookupField = () => {
    setState('RelationColumnDefs', []);
    let _RDcol:any={Field: Field.RelationEntityDisplayField,Name:Field.RelationEntityDisplayField};
    if (!Field.RelationEntityLookupFieldGroup){
        setState('RelationColumnDefs',[_RDcol]);
        return
    }
        
    let _RelationColumnDefs:any[] =[];
    _RelationColumnDefs.push(_RDcol);
    setState('RelationColumnDefs', _RelationColumnDefs);
  
      apps4xService.getSingleMetaObject(Field.RelationEntity)
        .then((res: any) => {

          let _Entity: any = JSON.parse(res.Data ? res.Data : res);
          _Entity.EntityId = res.Id;
  
          if (_Entity && _Entity.FieldGroup) {
            _Entity.FieldGroup.forEach((fg:any) =>{
              if(fg.Name == Field.RelationEntityLookupFieldGroup){
                fg.Field.forEach((field:any) => {
                  let _col:any={Field: field.Name,Name:field.Label?field.Label:field.Name};
                  if(!(_RelationColumnDefs.find(f => f.Name == field.Name)))
                    _RelationColumnDefs.push(_col);
                 });
              }
            });
            setState('RelationColumnDefs',[..._RDcol,..._RelationColumnDefs]);
          }
  
        });
  }
  const getSingleGridCheckedData = (data: any) => {
    setSelectedValue(data[Field.RelationEntityField]??data[Field.RelationEntityDisplayField]);
    if(data.isGridSelect){
    setState('selectedRow',data);
    setState('selectdRelationEntityField', data[Field.RelationEntityField]);
    setState('selectdRelationDisplayField', data[Field.RelationEntityDisplayField]);
    }
    else {    
        setState('selectedRow',null);
        setState('selectdRelationEntityField', null);
        setState('selectdRelationDisplayField', null);
    }
    if(form)
        form[Field.Name] = data?[Field.RelationEntityField]:null;
      
    //   this.ChangeEvent.emit({data:data , Field:this.Field,value:this.selectdRelationEntityField});
    setShowTable(false);
   }

  useEffect(() => {
    getRelationEntityLookupField();

    
    if(Field.showSelectedValues){
        setState('selectdRelationDisplayField',Field.showSelectedValues);
    }
    if(form && form[Field.Name]){
        setState('selectdRelationEntityField',form[Field.Name]);
        getRelationEntityData(true,form[Field.Name],Field.showSelectedValues);
    }

    setSelectedValue(Field.showSelectedValuesd? Field.showSelectedValues: (form[Field.Name]?form[Field.Name]: null))


    // function handleClickOutside(event: MouseEvent) {
    //   if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && (dropdownRef.current.id != "label" && dropdownRef.current.localName != "label") ) {
    //     setShowTable(false);
    //   }
    // }
    // document.addEventListener("mousedown", handleClickOutside);
    // return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div id={`relation_autoComplete_dropdown_${Field.Name}`} className={cn("relative", { "show-table": showTable })}>
      <div className="relative" id='label'>
        <label
          className={cn(
            "block w-48 h-8 cursor-pointer rounded border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200", 
            { "border-red-500": Field.Mandatory && !selectedValue }
          )}
          onClick={loadRelationTable}
        >
            {selectedValue}
          {selectedValue && (
            <span className="absolute right-2 top-2 cursor-pointer text-gray-500 hover:text-gray-700" onClick={clearSelectedData}>
              <X size={16} />
            </span>
          )}
        </label>
      </div>
      {showTable && (
        <div ref={dropdownRef} className="absolute left-0 top-full mt-2 rounded-lg border border-gray-300 bg-white shadow-lg">
          <Table>
            <TableHeader>
              <TableRow>
              {stateObject?.RelationColumnDefs && stateObject.RelationColumnDefs.map((col:any,index:number) => (
                      <TableHead key={'head'+index}>{col.Field}</TableHead>
                    ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {stateObject?.RelationData && stateObject.RelationData.map((row:any,index:number) => (
                <TableRow key={'relation'+index} onClick={() => getSingleGridCheckedData(row)} className="cursor-pointer hover:bg-gray-100">
                    {stateObject?.RelationColumnDefs && stateObject.RelationColumnDefs.map((col:any,index:number) => (
                      <TableCell key={'data'+index}>{row[col.Field]}</TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
