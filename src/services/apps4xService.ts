import { BaseApiService, CompanyId } from "@/app/api/baseApiApps4x"
import { apps4xApiUrls } from "./apps4xApis";

class Apps4xService extends BaseApiService {
  constructor() {
    super('api/v1/')
  }

  async getMetaobjectType(ObjectType:any[],AppId?:string,givePermission?:boolean,filterwithcompany?:boolean){
    let url = apps4xApiUrls.getMetaObjectByType(CompanyId);
    if (Array.isArray(ObjectType) && ObjectType.length > 0) {
      let parameter = "";
      let i = 0;
      let query="objectTypes";
      ObjectType.forEach((id) => {
        if (i == 0) parameter += `?${query}=${id}`;
        else parameter += `&${query}=${id}`;
        i++;
      });
      url = url+ parameter;
    }
  
    if(AppId){
        url = `${url}&appId=${AppId}`
    }

    if (givePermission) {
        url = `${url}&givepermissiondata=true`
    }

    if(filterwithcompany){
        url = `${url}&filterwithcompany=true`
    }
    return await this.getApi(url);
  }

  async getDynamicSchema (CollectionId?:any,EntityId?:any){

    let url = apps4xApiUrls.getDynamicSchema(CompanyId);

    if (CollectionId && EntityId) {
      url = url + "?collectionId=" + CollectionId + "&entityId=" + EntityId;
    }
    else if (CollectionId) {
      url = url + "?collectionId=" + CollectionId;
    }
    else if (EntityId) {
      url = url + "?entityId=" + EntityId;
    }

    return await this.getApi(url);
  }

  async getDynamicList (CollectionId?:any,EntityId?:any,Criteria?:any,Condition?:any) {
    let url = apps4xApiUrls.getDynamicList(CompanyId);
    if (CollectionId && EntityId) {
      url = url + "?collectionId=" + CollectionId + "&entityid=" + EntityId;
    }
    else if (CollectionId) {
      url = url + "?collectionId=" + CollectionId;
    }
    else if (EntityId) {
      url = url + "?entityId=" + EntityId;
    }
    if(Criteria){
      url = url + `&$page=${Criteria.pageNo}&$size=${Criteria.pageSize}`
    }
    if (Condition) {
      url = url + "&Q_whereCondition=" + Condition
    }

    return await this.getApi(url);
  }

  async getDynamicDetails(EntityId:string, RecId:number) {
    let url = apps4xApiUrls.getDynamicDetails(CompanyId,EntityId,RecId);
    return await this.getApi(url);
  }
  async getDyamicQueryData(EntityObjectsId:string,Parameter?:any, Condition?:any,
    multiSearchfield?:any,multiSearchValue?:any) {
 
    let url = apps4xApiUrls.getDynamicQuery(CompanyId,EntityObjectsId);
  
    if(Condition) {
      url =url+"?Q_whereCondition="+Condition
    }
    if(multiSearchfield && multiSearchValue){
      if(Condition){
        url = url+'&'+multiSearchfield+multiSearchValue;
      }else{
        url = url+'?'+multiSearchfield+multiSearchValue;
      }
    }

    return await this.getApi(url,{...QueryParameterBuilder(Parameter)});  
  }
  async getSqlDetails(ConnectorId:any , ObjType:string , ObjName:string , condition?:any) {
    let url = apps4xApiUrls.getSqlDetails(CompanyId,ConnectorId,ObjType,ObjName);
    if (condition) {
      url = url + "&whereCondition=" + condition
    }
    return await this.getApi(url);
  }
  dynamicAPi(
    restData: any,
    FormValues?: any,
    searchCriteria?: any,
    SearchText?: any,
    isHavecriteria?: boolean,
    formData?:any
  ) {
    let params = setparameter(
      restData.QueryStrings,
      FormValues,
      SearchText,
      isHavecriteria
    );
    let parameter = getArraycolumn(params);
    let headers = setHeaders(restData.Headers, FormValues);

    let _url = restData.ApiUrl + parameter;

    switch (restData.Method) {
      case 'GET': {

        return this.get<any>(_url, {
          params: CriteriaBuilder(searchCriteria),
          responseType: restData.responseType?restData.responseType:'json',
          headers:headers
        });
      }
      case 'POST': {
        let _body = formData?formData: restData.Body;
        return this.post<any>(_url, _body,{
          responseType: restData.responseType?restData.responseType:'json',
          headers:headers
        });
      }
      case 'PUT': {
        let _body = formData?formData: restData.Body;
        return this.put<any>(_url,_body,{
          responseType: restData.responseType?restData.responseType:'json',
          headers:headers
        });
      }
      case 'DELETE': {
        return this.delete<any>(_url,{
          responseType: restData.responseType?restData.responseType:'json',
          headers:headers
        });
      }
      default: {
        return this.get<any>(_url,{
          responseType: restData.responseType?restData.responseType:'json',
          headers:headers
        });
      }
    }
  }

  async getDyamicUrl(url:any) {
    return await this.getApi(url);
  }
  async getSingleMetaObject(Id:string) {
    let url = apps4xApiUrls.getSingleMetaObject(CompanyId,Id);
    return await this.getApi(url);
  }
  async getSingleMetaObjectByRecId(RecId:number) {
    let url = apps4xApiUrls.getSingleMetaObjectByRecId(CompanyId,RecId);
    return await this.getApi(url);
  }

  async getApi(url:string,params: {
    page?: number
    size?: number,
  } = {},customParams?:any) {
    return this.get<responseModel<any[]>>(url,  {...params,...customParams})
  }

  async createApi(url:string,data: any) {
    return this.post<any>(url, data)
  }

  async updateApi(url:string,id: string, data: any) {
    return this.put<any>(url+id, data)
  }

  async deleteApi(url:string,id: string) {
   return this.delete<void>(url+id)
  }
}

export const apps4xService = new Apps4xService();


export interface responseModel<T> {
    isSuccess: boolean,
    message:string,
    Data:T|any,	
    page:number,
	size:number,
	totalCount:number	
}
export const  FilterDuplicateMetaobject = (res:any[]) =>{
        let filteredRes:any[]=[];
        filteredRes = res.filter(
          (obj, index, self) =>
             index === self.findIndex((t) => (t.Id === obj.Id && t.Type === obj.Type && t.ParentId === obj.ParentId && 
              ((t.Status === 'Active') || 
              (t.Status === 'Draft' && !self.some((x) => x.Id === obj.Id && x.Status === 'Active')))
             )
          )
        );
        return filteredRes;
}
export function QueryParameterBuilder(Parameter: any) {
  let params:any = {};
  if (!Parameter) return params;

  for (const iterator of Parameter) {
      if (iterator.Field && iterator.Value)
          params[iterator.Field] = iterator.Value;
  }

  return params;
}

export function setparameter(
  parameters: any[],
  FormValues:any,
  SearchText?:any,
  isHavecriteria?: boolean
) {

  let params: any[] = [];

  if(parameters){
  parameters.forEach((element) => {
    if (element?.schema?.type == 'FieldValue') {
      let temp: any = {
        name: element.name,
        Value: FormValues[element.Value],
        in: 'query',
        description: '',
        schema: {
          type: element?.schema?.type,
          format: '',
          DefaultValue: ''
        }
      };
      // if(!element.IsCriteriaField)
      if(temp.Value != null && temp.Value != '')
      params.push(temp);
    }

    else if (element?.schema?.type == 'SearchValue') {
      if (SearchText && !isHavecriteria) {
        let temp: any = {
          name: element.name,
          Value: SearchText,
          in: 'query',
          description: '',
          schema: {
            type: element?.schema?.type,
            format: '',
            DefaultValue: ''
          }
        };
      if(temp.Value != null && temp.Value != '')
        params.push(temp);
      }
    }
    else {
      let temp: any = {
        name: element.name, Value: element.Value,
        in: 'query',
        description: '',
        schema: {
          type: element?.schema?.type,
          format: '',
          DefaultValue: ''
        }
      };
      if(temp.Value != null && temp.Value != '')
      params.push(temp);
    }

  });
}


  return params;
}

export function setHeaders(header: any[], FormValues:any) {
let headers: any = {};
if(header && header.length> 0){
header.forEach((element) => {
  if (element.name) {
    if (element?.schema?.type == 'FieldValue') {
      if (FormValues[element.Value])
        headers = headers.set(element.name, FormValues[element.Value]);
    }
    else {
      if(element.Value)
      headers = headers.set(element.name, element.Value);
    }
  }
});
}
return headers
}

export function getArraycolumn(column: any[] = []) {
  if (Array.isArray(column) && column.length > 0) {
    let str = '';
    let i = 0;
    column.forEach((x) => {

      if (i == 0) str += `?${x.name}=${x.Value ? x.Value : ''}`;
      else str += `&${x.name}=${x.Value ? x.Value : ''}`;
      i++;
    });
    return str;
  } else return '';
}
export function CriteriaBuilder(criteria?: any) {
  let queries: any = {};
  if (!criteria) return queries;

  if (criteria.pageNo && criteria.pageNo != null) {
      queries["$page"] = criteria.pageNo;
  }
  if (criteria.pageSize && criteria.pageSize != null) {
      queries["$size"] = criteria.pageSize;
  }

  if (criteria.SortOrder && criteria.SortOrder.field != null) {
      queries["$orderby"] = criteria.SortOrder.field;
  }
  if (criteria.SortOrder && criteria.SortOrder.direction != null) {
      queries["$orderbydirection"] = criteria.SortOrder.direction;
  }
  if (
      criteria.Where &&
      Array.isArray(criteria.Where) &&
      criteria.Where.length > 0
  ) {
      for (const iterator of criteria.Where) {
          if (iterator.Field && iterator.Value) {
              iterator.Operator = iterator.Operator ? iterator.Operator : "li";
              let fullFormat = iterator.Operator + ":" + iterator.Value;
              queries["$filter:" + iterator.Field] = fullFormat;
          }
      }
  }
  return queries;


}

export function checkConditionValidate(Type:any, LHS:any, RHS:any) {
  let _Icondition: boolean = true;
  switch (Type) {
    case "Equals": {
      _Icondition = (LHS == RHS ? true : false)
      break
    }
    case "NotEquals": {
      _Icondition = (LHS != RHS ? true : false)
      break
    }
    case "LessThan": {
      LHS = (!isNaN(LHS)) ? parseFloat(LHS) : LHS
      RHS = (!isNaN(RHS)) ? parseFloat(RHS) : RHS
      _Icondition = (LHS < RHS ? true : false)
      break
    }
    case "LessThanOrEqual": {
      LHS = (!isNaN(LHS)) ? parseFloat(LHS) : LHS
      RHS = (!isNaN(RHS)) ? parseFloat(RHS) : RHS
      _Icondition = (LHS <= RHS ? true : false)
      break
    }
    case "GreaterThan": {
      LHS = (!isNaN(LHS)) ? parseFloat(LHS) : LHS
      RHS = (!isNaN(RHS)) ? parseFloat(RHS) : RHS
      _Icondition = (LHS > RHS ? true : false)
      break
    }
    case "GreaterThanOrEqual": {
      LHS = (!isNaN(LHS)) ? parseFloat(LHS) : LHS
      RHS = (!isNaN(RHS)) ? parseFloat(RHS) : RHS
      _Icondition = (LHS >= RHS ? true : false)
      break
    }
    case "IsNull": {
      _Icondition = (LHS == null ? true : false)
      break
    }
    case "IsNotNull": {
      _Icondition = (LHS != null ? true : false)
      break
    }
    case "IsEmpty": {
      _Icondition = (LHS == '' ? true : false)
      break
    }
    case "IsNotEmpty": {
      _Icondition = (LHS != '' ? true : false)
      break
    }

    // String Data
    case "Length": {
      _Icondition = (LHS?.length == RHS ? true : false)
      break
    }
    case "Contains": { //Contains
      _Icondition = (LHS?.includes(RHS) ? true : false)
      break
    }
    case "NotContains": { //Contains
      _Icondition = (!(LHS?.includes(RHS)) ? true : false)
      break
    }
    case "StartsWith": {
      _Icondition = (LHS?.startsWith(RHS) ? true : false)
      break
    }
    case "EndsWith": {
      _Icondition = (LHS?.endsWith(RHS) ? true : false)
      break
    }
    case "Equal": {
      _Icondition = (LHS == RHS ? true : false)
      break
    }
  case "NotEqual": {
      _Icondition = (LHS != RHS ? true : false)
      break
    }
  case "LessThen": {
      LHS = (!isNaN(LHS)) ? parseFloat(LHS) : LHS
      RHS = (!isNaN(RHS)) ? parseFloat(RHS) : RHS
      _Icondition = (LHS < RHS ? true : false)
      break
    }
  case "LessThenEqual": {
      LHS = (!isNaN(LHS)) ? parseFloat(LHS) : LHS
      RHS = (!isNaN(RHS)) ? parseFloat(RHS) : RHS
      _Icondition = (LHS <= RHS ? true : false)
      break
    }
    case "GreaterThen": {
      LHS = (!isNaN(LHS)) ? parseFloat(LHS) : LHS
      RHS = (!isNaN(RHS)) ? parseFloat(RHS) : RHS
      _Icondition = (LHS > RHS ? true : false)
      break
    }
    case "GreaterThenEqual": {
      LHS = (!isNaN(LHS)) ? parseFloat(LHS) : LHS
      RHS = (!isNaN(RHS)) ? parseFloat(RHS) : RHS
      _Icondition = (LHS >= RHS ? true : false)
      break
    }
    case "1":{
      if(typeof RHS == 'string'){
        RHS = RHS==='true'?true:false
      }
      _Icondition = (LHS == RHS ? true :false)
      break
    }
    case "0":{
      if(typeof RHS == 'string'){
        RHS = RHS==='true'?true:false
      }
      _Icondition = (LHS != RHS ? true :false)
      break
    }
    default:
      _Icondition = false
      break
  }
  return _Icondition
}