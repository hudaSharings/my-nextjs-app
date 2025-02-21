"use client"
import { AppId, CompanyId } from "@/app/api/baseApiApps4x";
import { useApi } from "@/app/api/useApi";
import { apps4xService, responseModel } from "@/services/apps4xService";
import { useEffect } from "react";

export default  function Apps4x() {
    const { 
        data, 
        loading, 
        error, 
        execute: fetchClients 
      } = useApi<responseModel<any[]>>(() => 
        apps4xService.getApi(`metaobject/${CompanyId}?objectTypes=Collection&objectTypes=Entity&objectTypes=Query&objectTypes=Page&objectTypes=Function&appId=${AppId}`)
      )
      const  FilterDuplicateMetaobject = (res:any[]) =>{
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
      const Condition = (item:any,Type:string) => {
        let _Condition = item.Type === Type && item.ParentId== AppId
        if(Type === 'Collection'){
            return   _Condition && JSON.parse(item.Data).IsWorkFlow !== true
        }else if(Type === 'Workflow'){
            return item.Type === 'Collection' && item.ParentId== AppId && JSON.parse(item.Data).IsWorkFlow
        }
        else{
            return  _Condition
        }
      }
      const loadDatas = (Type:any) => {
        let _entityData = FilterDuplicateMetaobject(data?.Data).filter((item: any) => item.Type === 'Entity')
        return(
            FilterDuplicateMetaobject(data?.Data).map((item: any) => (
                (Condition(item,Type)) &&
              <div key={item.Id} className=" h-28 shadow-md rounded-md shadow-muted">
                <div className="p-2">
                  <span className="flex items-center">
                    <span className="border rounded-sm p-2">
                      <img className="w-6 max-w-full" src={JSON.parse(item.Data).Image ?? 'https://cdn-icons-png.flaticon.com/128/11516/11516912.png'} alt="fts" />
                    </span>
                    <span className="mx-2 text-xs font-normal">{JSON.parse(item.Data).Name}</span>
                  </span>
                  <span className="flex py-2 text-xs">
                    <p>{JSON.parse(item.Data).Description ?? 'Customize surveys and quizzes, get real-time results.'}</p>
                  </span>
                  {Type === 'Collection' && 
                  _entityData.length>0 &&
                  <span >
                  {_entityData.map((entity: any) => (
                    (JSON.parse(entity.Data).CollectionId === item.Id) &&
                    <a className="p-1 ml-2 text-xs border-2 rounded-md bg-primary text-primary-foreground dark:bg-muted">{entity.Name}</a>
                  ))}
                  </span>
                  }
                </div>
              </div>
            ))
        )
      }

    useEffect(() => {
        fetchClients();
    },[]);
    useEffect(() => {
        if (error) {
            console.error('API Error:', error.status|| error.message)
        }
        if(data?.Data){
            console.log(data?.Data)
        }
    },[error,data?.Data]);
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-bold">Apps4x</h1>
          <h3 className="text-lg font-bold mt-3">Collection</h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {data?.Data.length>0 && 
            loadDatas('Collection')
            }
          </div>
          <h3 className="text-lg font-bold mt-3">Page</h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {data?.Data.length>0 && 
            loadDatas('Page')
            }
          </div>
          <h3 className="text-lg font-bold mt-3">Query</h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {data?.Data.length>0 && 
            loadDatas('Query')
            }
          </div>
          <h3 className="text-lg font-bold mt-3">Function</h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {data?.Data.length>0 && 
            loadDatas('Function')
            }
          </div>
          <h3 className="text-lg font-bold mt-3">Workflow</h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {data?.Data.length>0 && 
            loadDatas('Workflow')
            }
          </div>
      </div>
    );
}