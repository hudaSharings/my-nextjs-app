import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useGroupedState } from "../customState";
import { useEffect } from "react";
import DropDownTable from "./drodownTable";
import RelationTable from "./relationTable";
type props= {
    fields:any[],
    data:any,
    type: 'Details' | 'Create' | 'Edit';
    form:UseFormReturn<any>|null;
    FieldChangeEvent:(form:UseFormReturn<any>, FieldData: any,RestData: any) => void
  }

const GroupField = ({ form, fields, data: Data , type , FieldChangeEvent}:props) => {
    const { stateObject, setState } = useGroupedState();
  
    const getdownloadFileUrl = (field: any) => {
        let _url = "";
        if (Data[field.Name + "_Path"])
          _url = 'https://apps4x-framework.azurewebsites.net/' + Data[field.Name + "_Path"];
        else if (Data[field.Name])
          _url = 'https://apps4x-framework.azurewebsites.net/' + Data[field.Name];
        return _url
      }
      const setDropdownFieldOption = () => {
        let _dropdownField:any[] = [];
        let _ddlfield: any[] = fields.filter((x:any) => (x.DataType == "DropDown" || x.DataType == "Chips"));
    
        _ddlfield.forEach(field => {
    
          let _field = { Field: field.Name, Option: [], isDynamic: false };
    
          if (field.FieldData) {
            let _dv = JSON.parse(field.FieldData);
            _field.isDynamic = _dv.isDynamic;
            if (!_dv.isDynamic) {
              _field.Option = _dv.options;
            }
          }
          _dropdownField.push(_field);
        });
        setState('dropdownField',_dropdownField);
      }
      const getDDLItems = (Field: any) => {
        if(stateObject && stateObject?.dropdownField){
        let _ret = [];
        let _field = stateObject.dropdownField.filter((x:any) => x.Field == Field.Name)[0];
        if (_field) {
          _ret = _field.Option
        }
        return _ret?_ret:[];
      }else{
        return [];
      }
    
      }
      const isDynamicDDL = (Field: any) => {
        if(stateObject && stateObject?.dropdownField){
        let _ret: boolean = false;
        let _field = stateObject.dropdownField.filter((x:any) => x.Field == Field.Name)[0];
        if (_field) {
          _ret = _field.isDynamic
        }
        return _ret;
      }else{
        false
      }
      }
      const showtable = (field:any) => {
        let _fields = stateObject?.fields;
        _fields.map((x:any) => {
          if(x.Name == field.Name){
            x.showTable = !x.showTable
          }
          return x;
        });
        setState('fields',_fields);
      }
      const changeFiledValue = (event:any, item:any, SelectedObj?:any) => {
        if(form){
        if (event !== "" && event && event.target) {
          let val: any = (event.target as HTMLInputElement)?.value;
          let el = (document.getElementById(item.Name) as HTMLInputElement);
          el.value = val;
          form.setValue(item.Name, val);
          FieldChangeEvent(form,item,val);
        }else{
          form.setValue(item.Name, SelectedObj);
        FieldChangeEvent(form,item,SelectedObj);

        }
      }
      }

      
      useEffect(() => {
        if(fields && fields.length>0){
        setDropdownFieldOption();
        setState('fields',fields);
        }
      },[]);

    return (
      <>
      {type === 'Details' && 
      <div className="group_field table w-100" id={type}>
        {fields.map((field:any, index:number) => (
          <div
            key={index+type}
            className={`form-group table-row field_view_${field.DataType} ${field.Config?.Class??''} ${field.Hide ? 'hidden' : ''} ${field.Readonly ? 'inactiveLink' : ''}`}
            style={{
              width: field.Config?.Width ? `${field.Config.Width}%` : undefined,
              height: field.Config?.Height ? `${field.Config.Height}px` : undefined,
              top: field.Config?.top,
              left: field.Config?.left,
              right: field.Config?.right,
              bottom: field.Config?.bottom,
              color: field.Config?.textcolor,
              background: field.Config?.bgcolor,
            }}
          >
            {field.DataType !== E_FieldDataType.Button && (
              <label className={`table-cell px-2 field_key font-bold ${field.Config?.hidelabel ? 'hide' : ''}`}>
                {field.Label ? field.Label : field.Name}
              </label>
            )}
            <div className="table-cell px-2 field_value">
              {Data && (
                field.DataType === E_FieldDataType.Image ? (
                  <div className="profile-user-img img-rounded mb-2">
                    {getdownloadFileUrl(field) && (
                      <img
                        className="img-fluid"
                        src={getdownloadFileUrl(field)}
                        alt={field.Name}
                      />
                    )}
                  </div>
                ) : field.Name === "Status" ? (
                  <span className={`grid-field-tag tag_${Data[field.Name]}`}>
                    {Data[field.Name]}
                  </span>
                ) : (
                   Data[field.Name]
                )
              )}
            </div>
          </div>
        ))}
      </div>
      }
      {(type === 'Create' && form) && 
      <>
      <div className="container mx-auto">
        <FormProvider {...form}>
        <Form {...form}>
          <form
            className=""
          >
            {stateObject?.fields && stateObject.fields.map((field:any, index:number) => (
          <div
            key={index}
            className={`my-2 field-row ${field.Hide ? 'hidden' : ''} ${field.Readonly ? 'inactiveLink' : ''}`}
            style={{
              width: field.Config?.Width ? `${field.Config.Width}%` : undefined,
              height: field.Config?.Height ? `${field.Config.Height}px` : undefined,
              top: field.Config?.top,
              left: field.Config?.left,
              right: field.Config?.right,
              bottom: field.Config?.bottom,
              color: field.Config?.textcolor,
              background: field.Config?.bgcolor,
            }}
          >
            <div className="">
            <FormField
              control={form.control}
              name={field.Name}
              render={({ field:_field }) => (
                <FormItem >
                  <FormLabel onClick={() => showtable(field)}>{field.Label}</FormLabel>
                  {field.DataType == "DropDown" ? (
                    <>
                    {isDynamicDDL(field)?(
                      <DropDownTable Field={field} form={form.getValues()} OpenTable={() =>showtable(field)} CloseShowTable={() =>showtable(field)} 
                      ChangeEvent={(_data,field,value) => changeFiledValue(null,field,value,)}></DropDownTable>
                    ):(
                      <>
                      <Select onValueChange={_field.onChange} defaultValue={_field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getDDLItems(field).map((item:any,Index:number)=>(
                          <SelectItem key={item.value+Index} value={item.value} onClick={() => changeFiledValue("",field,item.value)}>{item.text}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    </>
                  )}
                    </>
                    ):(field.DataType === "Relation"?(
                      <RelationTable Field={field} form={form.getValues()} ChangeEvent={(_data,field,value) => changeFiledValue(null,field,value)}></RelationTable>
                    ):<FormControl>
                    <Input className="w-full p-2 border border-gray-300 rounded-md" 
                    placeholder={field.Label} type="text" id={field.Name} {..._field} onChange={(e) => changeFiledValue(e,field,_field.value)}/>                    
                  </FormControl>)
                  }
                  
                </FormItem>
              )}
            />
            </div>
          </div>
        ))}    
			</form>
		</Form>
	</FormProvider>
      </div>
    </>
      }
      </>
    );
  };
  
  export default GroupField;

  export enum E_FieldDataType {
    String = "String",
    Interger = "Interger",
    Date = "Date",
    DateTime = "DateTime",
    Decimal = "Decimal",
    TimeSpan = "TimeSpan",
    Image = "Image",
    DropDown = "DropDown",
    Relation = "Relation",
    Boolean = "Boolean",
    TextArea = "TextArea",
    DBComputed = "DBComputed",
    Formula = "Formula",
    File = "File",
    Time = "Time",
    QRcode = "QRcode",
    List = "List",
    HTMLEditor = "HTMLEditor",
    Button = "Button",
    Icon = "Icon",
    Password = "Password",
    Int64 = "Int64",
    Chips = "Chips",
    ImageSlider = "ImageSlider",
}
