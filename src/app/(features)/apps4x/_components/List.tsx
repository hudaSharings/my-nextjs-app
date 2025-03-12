"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { SortingButton } from "@/app/(features)/(masters)/users/UsersTable";
import { useApi } from "@/app/api/useApi";
import { apps4xService, handleBarData } from "@/services/apps4xService";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { useGroupedState } from "../customState";
import DetailsPage from "../_Details/page";
import { useTheme } from "next-themes";
import { pageService } from "@/services/pageService";

type Props = {
  Collection?: any,
  Entity?:any,
  ConnectorId?:any,
  EntityObjectsId?:any,
  QueryId?:any,
  PageType?:any,
  group?:any
}

export default  function DynamicList({Collection,Entity,ConnectorId,EntityObjectsId,QueryId,PageType,group}:Props) {
    const searchParams = useSearchParams();
    const {stateObject , setState} = useGroupedState();
    const params = useParams();
    const [columns,setcolumns] = useState<any[]>([]);
    const [DynamicData,setDynamicData] = useState<any[]>([]);
    const [openDetailsModal,setDetailsModal] = useState<boolean>(false);
    const [selectedData,setselectedData] = useState<any>(null);
    const [pageNo,setpageNo] = useState<number>(1);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [DetailsForm,setDetailsForm] = useState<any>(null);
    const {theme} = useTheme();
    const {data ,error , execute:getSchema} = useApi<any>(
        () => apps4xService.getDynamicSchema(stateObject.CollectionId,stateObject.EntityId));

    const {data:tabledata ,loading ,error:DataError , execute:getData} = useApi<any>(
        () => apps4xService.getDynamicList(stateObject.CollectionId,stateObject.EntityId,{pageNo:pageNo,pageSize:pagination.pageSize}));

        const actionsColumn = (
            handleAction: (id: number, action: string) => void
          ): ColumnDef<any>[] => [
            {
              id: "actions",
              cell: ({ row }) => {
                const payment = row.original;
        
                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleAction(payment.id, "edit")}
                      >
                        {" "}
                        <Pencil />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction(payment.id, "view")}
                      >
                        <SquareArrowOutUpRight />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction(payment.id, "delete")}
                      >
                        <Trash2 />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              },
            },
          ];
          const handleAction = (id: number, action: string) => {
            // const client = data?.Data.find((client) => client.id === id);
            // if (client) {
            //   if (action === "edit") {      
            //     onEdit(client);
            //   } else if (action === "view") {       
            //     onView(client);
            //   } else if (action === "delete") {
            //     onDelete(client);        
            //   }
            // }
            console.log(id, action);
          };

          const CloseModal = () => {
            setDetailsModal(false);
          }
          const openDetails = (rowData:any) => {
            setselectedData(rowData);
            setDetailsModal(true)
          }
          const changePagination = (_pagination:PaginationState) =>{
            if(_pagination.pageIndex !== pagination.pageIndex && pageNo > pagination.pageIndex){
              setpageNo(_pagination.pageIndex+1);
            }
            setPagination(_pagination);
          }
          const getDefaultListData = (searchCriteria?:any,condition?:any, FormEntityId?: string,dataSource?:any,type?:any) => {

            let _entityId: any = null;
            if (FormEntityId) {
              _entityId = FormEntityId
            }
            else {
              if (PageType == "Collection") {
                _entityId = null;
              }
              else {
                _entityId = stateObject.EntityId;
              }
            }
        
        
            if(dataSource) {
        
              let _handleData: any = {};
              _handleData.Params = stateObject?.PageGroupParams;
        
              
              let restData: any = JSON.parse(dataSource);
        
              let _QueryString:any = [];
              if (restData.QueryStrings.length > 0) {
        
                restData.QueryStrings.map((x:any) => {
                  let filterobj = {
                    Field: '',
                    Operator: 'eq',
                    TableAlias: '',
                    Value: '',
                  };
                  filterobj.Field = x.name;
                  let _Value = handleBarData(x.Value, {...arguments[0],...stateObject,..._handleData});
                  filterobj.Value = _Value;
                  _QueryString.push(filterobj);
                });
                searchCriteria.Where.push(..._QueryString);
              }
            }
        
        
            if (stateObject.ActiveEntityForm?.Type == "Board") {
              searchCriteria.pageNo = 0 ,searchCriteria.pageSize = 0
            }
            let CollectionId =stateObject?.Collection;
        
            if (type == "Collection") {
              CollectionId = FormEntityId
              _entityId = null
            }
            if(!CollectionId && !_entityId){
              return;
            }
            apps4xService.getDynamicList(CollectionId, _entityId, searchCriteria,
               condition).then((res:any) => {
        
                setDynamicData(res.Data ? res.Data : res);
              let _res = res.Data ? res.Data : res;
        
              if (columns.length == 0) {
                for (let key in _res[0]) {
                  let _columns:any = [];
                    _columns.push({
                      accessorKey: key,
                      header: (column: any) => {
                        return <SortingButton column={column} title={key} />;
                      },
                      footer: (props: any) => props.column.id,
                    });
                    setcolumns(_columns);
                }
              }
        
              setState('TotalCount',res.TotalCount ? res.TotalCount : _res.length);
        
            },
              (error) => {
                // this.loader=false;
           
              });
        
          }
          const getDynamicData = () => {
            let searchCriteria:any={pageNo:pageNo,pageSize:pagination.pageSize};
            if (group && group.PageEntity?.PreventInitLoad && stateObject?.isPageInit) {
              setState('isPageInit',false);
              return;
            }
          
            if (group?.ID) {
              pageService.getAllPageData();
              const pageData = pageService.PageAllData.find((x: any) => x.ID === group.ID);
              if (pageData) {
                setState('PageGroupParams',pageData.ParamsData);
                if (searchCriteria?.Where?.length > 0) {
                  searchCriteria.Where = searchCriteria.Where.filter(
                    (x: any) => x.SerachType !== "Params"
                  );
                }
          
                if (pageData.ParamsData) {
                  for (let key in pageData.ParamsData) {
                    if (pageData.ParamsData[key]) {
                      if (searchCriteria.Where?.length > 0) {
                        let index = searchCriteria.Where.findIndex(
                          (x: any) => x.Field === key
                        );
                        if (index > -1) {
                          searchCriteria.Where.splice(index, 1);
                        }
                      }
          
                      searchCriteria.Where.push({
                        Field: key,
                        Operator: "eq",
                        TableAlias: "",
                        SerachType: "Params",
                        Value: pageData.ParamsData[key],
                      });
                    }
                  }
                }
              }
            }
          
            let condition = stateObject?.Condition?.Condition?.length > 0 ? handleBarData(JSON.stringify(stateObject?.Condition)) : null;
          
            if (EntityObjectsId) {
              // if (ActiveMetaObject?.Type === "Query") {
              //   getDyamicQueryData(condition);
              // } else 
              if (
                stateObject?.ActiveEntityForm?.OnSaveDSType &&
                (stateObject?.ActiveEntityForm?.OnSaveDSId || stateObject?.ActiveEntityForm?.OnSaveDSData)
              ) {
                switch (stateObject?.ActiveEntityForm.OnSaveDSType) {
                  // case "SQLConnector":
                  //   if (stateObject?.ActiveEntityForm.OnSaveDSId) {
                  //     getDatabaseConnectorData(searchCriteria, condition);
                  //   }
                  //   break;
                  // case "RestApi":
                  // case "RestAPIConnector":
                  // case "SwaggerConnector":
                  //   if (stateObject?.ActiveEntityForm.OnSaveDSId) {
                  //     getdynamicRestAPI(stateObject?.ActiveEntityForm.OnSaveDSData);
                  //   }
                  //   break;
                  // case "Query":
                  //   getDyamicQueryData(condition);
                  //   break;
                  case "Entity":
                  case "Collection":
                    getDefaultListData(
                      searchCriteria,
                      condition,
                      stateObject?.ActiveEntityForm.OnSaveDSId,
                      stateObject?.ActiveEntityForm.OnSaveDSData,
                      stateObject?.ActiveEntityForm.OnSaveDSType,
                    );
                    break;
                  default:
                    getDefaultListData(searchCriteria,
                      condition,
                      stateObject?.ActiveEntityForm?.EntityId
                    );
                }
              } else {
                getDefaultListData(searchCriteria,
                  condition,
                  stateObject?.ActiveEntityForm?.EntityId
                );
              }
            } else {
              getDefaultListData(searchCriteria,condition);
            }
          };
          
      useEffect(() => {
        if(stateObject.CollectionId || stateObject.EntityId){
        getSchema();
        getDynamicData();
        }
    },[stateObject?.CollectionId , stateObject?.EntityId]);

    useEffect(() => {
      if(params.CollectionId){
        setState('CollectionId',params.CollectionId)
      }
      if(Collection){
        setState('CollectionId',Collection)
      }
    },[params.CollectionId,Collection]);

    useEffect(() => {
      if(params.EntityId && !Collection){
        setState('EntityId',params.EntityId)
      }
      if(Entity){
        setState('EntityId',Entity)
      }
    },[params.EntityId,Entity]);

    useEffect(() => {
        let _columns = [];
        let EntityDetails = null;
        let CollectionDetails = null;

        if(data && data.Collection?.length>0){
          CollectionDetails = data.Collection.filter((x: any) => x.CollectionId == stateObject.CollectionId)[0];
        }
        
        if(data && data.Type?.length>0){
            if(data.Type.length>1){
                if (data.Type.find((x:any) => x.Status == 'Active')) {
                    EntityDetails = data.Type.filter((x:any)=> x.Status == 'Active')[0];
                  }
                  else if (data.Type.find((x:any) => x.Status == 'Draft')) {
                    EntityDetails = data.Type.filter((x:any) => x.Status == 'Draft')[0];
                  }
                  else {
                    EntityDetails = data.Type[data.Type.length - 1];
                  }
            }else{
                EntityDetails = data.Type[0];
            }
            
        }
        if (stateObject.EntityId && EntityDetails) {
          _columns = [];
          let _fields: any[] = EntityDetails.Fields;
          if (_fields.find((x: any) => x.Name !== "RecId")) {
            _columns.push({
              accessorKey: "RecId",
              header: (column: any) => {
                return <SortingButton column={column} title="RecId" />;
              },
              footer: ({ props }: any) => props.column.id,
              cell: ({ row }: any) => {
                const rowData = row.original;
                return (
                  <div
                    className="text-blue-700 cursor-pointer p-2 align-middle"
                    onClick={() => openDetails(rowData)}
                  >
                    {rowData?.RecId}
                  </div>
                );
              },
            });
          }
          _fields.forEach((field: any) => {
            _columns.push({
              accessorKey: field.Name,
              header: (column: any) => {
                return <SortingButton column={column} title={field.Label} />;
              },
              footer: (props: any) => props.column.id,
            });
          });
          setState('Fields',_fields)

          _columns.push(...actionsColumn(handleAction));
          setcolumns(_columns);
        } else if (stateObject.CollectionId && CollectionDetails) {
          let CollectionFields: any[] = CollectionDetails.Fields;
          CollectionFields.map((x) => {
            if (!x.CollectionId) {
              x.CollectionId = stateObject.CollectionId;
            }
            return x;
          });
          _columns = [];
          if (CollectionFields.find((x: any) => x.Name !== "RecId")) {
            _columns.push({
              accessorKey: "RecId",
              header: (column: any) => {
                return <SortingButton column={column} title="RecId" />;
              },
              footer: ({ props }: any) => props.column.id,
              cell: ({ row }: any) => {
                const rowData = row.original;
                return (
                  <div
                    className="text-blue-700 cursor-pointer p-2 align-middle"
                    onClick={() => openDetails(rowData)}
                  >
                    {rowData?.RecId}
                  </div>
                );
              },
            });
          }
          CollectionFields.forEach((field: any) => {
            _columns.push({
              accessorKey: field.Name,
              header: (column: any) => {
                return <SortingButton column={column} title={field.Label} />;
              },
              footer: (props: any) => props.column.id,
            });
          });
        setState('Fields',CollectionFields)


          _columns.push(...actionsColumn(handleAction));
          setcolumns(_columns);
        }
        if(data && data.Forms?.length>0){
          let _detailsform: any[] = [];
          data.Forms.forEach((x:any) => {
            let Data: any = JSON.parse(x.Data)
            if (Data.Type == 'Details') {
              Data.FormId = x.Id;
              Data.RecId = x.RecId;
              Data.Status = x.Status;
              Data.Version = x.Version;
              _detailsform.push(Data);
            }
          });
          if(_detailsform.length>0){
          if (_detailsform.find((x) => x.Status == 'Active')) {
            setDetailsForm(_detailsform.filter(x => x.Status == 'Active')[0]);
          }
          else if (_detailsform.find((x) => x.Status == 'Draft')) {
            setDetailsForm(_detailsform.filter(x => x.Status == 'Draft')[0]);
          }
          else {
            setDetailsForm(_detailsform[_detailsform.length - 1]);
          }
        }
        if(EntityObjectsId){
          let _ActiveEntityForm = data.Forms.filter((x:any) => x.FormId == EntityObjectsId);
        setState('ActiveEntityForm',_ActiveEntityForm);
        let _objectData: any = JSON.parse(_ActiveEntityForm.ObjectData);
            if (_objectData.Columns.length > 0) {
              
              let columnDef:any[] = [];
              _objectData.Columns.forEach((field: any) => {
                columnDef.push({
                  accessorKey: field.Field,
                  header: (column: any) => {
                    return <SortingButton column={column} title={field.Name} />;
                  },
                  footer: (props: any) => props.column.id,
                });
              });
              columnDef.push(...actionsColumn(handleAction));
              setcolumns(columnDef);
            }
            if (_objectData.Condition && !Array.isArray(_objectData.Condition)){
              setState('Condition',_objectData.Condition);
            }
        }

        }
    },[data]);

    useEffect(() => {
        if (error) {
            console.error('API Error:', error.status|| error.message)
        }
        if (DataError) {
            console.error('API Error:', DataError.status|| DataError.message)
        }
    },[error,DataError]);

    useEffect(() => {
      if(stateObject.CollectionId || stateObject.EntityId){
        getDynamicData();  
      }
    },[pagination]);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {stateObject.CollectionId && stateObject.EntityId ? 
                <h1>├── Collection - {stateObject.CollectionId} <br></br>&nbsp;&nbsp;└── Entity {stateObject.EntityId}</h1>
                : stateObject.CollectionId ? 
                <h1>Collection - {stateObject.CollectionId}</h1> 
                : params.EntityId && <h1>Entity - {stateObject.EntityId}</h1>
                }
                {columns.length>0 &&
                <DataTable 
                columns={columns} 
                data={DynamicData} 
                isLoading={loading}
                totalCount={(stateObject?.TotalCount)?? 0}
                onPaginationChange={changePagination} 
                addnew={() => {}} 
                referesh={getDynamicData} />}

                {openDetailsModal && 
                <Dialog open={openDetailsModal} onOpenChange={CloseModal}>
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
                <DetailsPage 
                 EntityId={String(stateObject.EntityId??selectedData?.EntityId)} RecId={selectedData?.RecId} Fields={stateObject.Fields} />
                 </DialogContent>
                 </Dialog>
                }
        </div>
        
    );
}