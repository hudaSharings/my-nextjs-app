"use client";

import { SortingButton } from "@/app/(features)/(masters)/users/UsersTable";
import { useApi } from "@/app/api/useApi";
import { apps4xService } from "@/services/apps4xService";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useParams } from "next/navigation";
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
import DetailsPage from "../../../_Details/page";

export default  function EntityPage() {
    const {CollectionId,id} = useParams();
    const [columns,setcolumns] = useState<any[]>([]);
    const [DynamicData,setDynamicData] = useState<any[]>([]);
    const [openDetailsModal,setDetailsModal] = useState<boolean>(false);
    const [selectedData,setselectedData] = useState<any>(null);
    const [pageNo,setpageNo] = useState<number>(1);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [DetailsForm,setDetailsForm] = useState<any>(null);
    
    const {data ,error , execute:getSchema} = useApi<any>(
        () => apps4xService.getDynamicSchema(CollectionId,id));

    const {data:tabledata ,loading ,error:DataError , execute:getData} = useApi<any>(
        () => apps4xService.getDynamicList(CollectionId,id,{pageNo:pageNo,pageSize:pagination.pageSize}));

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

      useEffect(() => {
        getSchema();
        getData();
    },[]);

    useEffect(() => {
        let _columns = [];
        if(data && data.Type?.length>0){
            setcolumns([]);

            let EntityDetails = null;
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
            let _fields:any[] = EntityDetails?.Fields;
            if(_fields.find((x:any) => x.Name !== 'RecId')){
                _columns.push({
                    accessorKey: 'RecId',
                    header: (column:any) => {
                      return <SortingButton column={column} title="RecId" />;
                    },
                    footer: ({props}:any) => props.column.id,
                    cell: ({row}:any) => {
                      const rowData = row.original;
                      return (
                        <div className='text-blue-700 cursor-pointer p-2 align-middle' onClick={()=>openDetails(rowData)}>{rowData?.RecId}</div>
                      )
                    }
                })
            }
            _fields.forEach((field:any) => {
                _columns.push({
                    accessorKey: field.Name,
                    header: (column:any) => {
                      return <SortingButton column={column} title={field.Label} />;
                    },
                    footer: (props:any) => props.column.id,
                }); 
            })
            
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
        if(tabledata?.Data){
            setDynamicData(tabledata?.Data);
        }
    },[tabledata]);

    useEffect(() => {
      getData();  
    },[pagination])

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <h1>├── Collection - {CollectionId} <br></br>&nbsp;&nbsp;└── Entity {id}</h1>
                {columns.length>0 &&
                <DataTable 
                columns={columns} 
                data={DynamicData} 
                isLoading={loading}
                totalCount={(tabledata?.TotalCount)?? 0}
                onPaginationChange={changePagination} 
                addnew={() => {}} 
                referesh={getData} />}

                {openDetailsModal && 
                <DetailsPage CloseDialog={CloseModal} formData={DetailsForm} openDialog={openDetailsModal}
                 EntityId={String(id)} RecId={selectedData?.RecId}/>
                }
        </div>
        
    );
}