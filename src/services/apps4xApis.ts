export const apps4xApiUrls = {
   getMetaObjectByType:(companyId:string) => `metaobject/${companyId}`,
   getMetaObjectSchema:(companyId:string,objectId:string,objectType:string) => `metaobject/${companyId}/schema?objectId=${objectId}&objectType=${objectType}`,
   getDynamicList: (companyId:string) => `data/${companyId}`,
   getDynamicDetails : (companyId:string,EntityId:string,RecId:number) => `data/${companyId}/${EntityId}?recid=${RecId}`,
   getDynamicDetailsbyPrimaryValue: (companyId:string,EntityId:any,primaryValue:any) => `data/${companyId}/${EntityId}?primaryValue=${primaryValue}`,
   getDynamicSchema: (companyId:string) => `metaobject/${companyId}/schema`,
   DynamicInsert:(companyId:string) =>`data/${companyId}/create`,
   DynamicUpdate:(companyId:string) =>`data/${companyId}/update`,
   DynamicDelete: (companyId:string,EntityId:any,recid:number) =>`data/${companyId}?entityid=${EntityId}&recid=${recid}`,
   getDynamicQuery:(companyId:string,queryrecId:any) =>`${companyId}/query/execute/${queryrecId}`,
   getSqlDetails:(companyId:string,ConnectorId:any,ObjType:string,ObjName:string) => `${companyId}/connector/${ConnectorId}/sql/sysobjectexecute?object_Type=${ObjType}&objectName=${ObjName}`,
   getSingleMetaObject:(companyId:string,Id:string) => `metaobject/${companyId}/byobjectId?objectId=${Id}`,
   getSingleMetaObjectByRecId:(companyId:string,RecId:number) => `metaobject/${companyId}/${RecId}`,
   DynamicLogic:(companyId:string,logicId:any) =>`${companyId}/logic/execute?logicId=${logicId}`,


}