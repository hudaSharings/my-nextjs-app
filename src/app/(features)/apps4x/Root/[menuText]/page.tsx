"use client"

import { useParams } from "next/navigation";
import { useGroupedState } from "../../customState";
import { useEffect } from "react";
import { apps4xService } from "@/services/apps4xService";
import PageForm from "../../_components/_page/pages";

export default function dynamicRoot() {    
    const {menuText} = useParams();
    const { stateObject, setState } = useGroupedState();
    const getCurrentMenu = () => {
        if(!menuText){
          return
        }
        setTimeout(() => {
          setState('menuDetails',apps4xService.currentAppMenuList.filter(x => x.RootUrl == menuText)[0]);
        }, 1);
    
      }
    useEffect(() => {
        console.log(apps4xService.currentAppMenuList,'menu');
        getCurrentMenu();
    },[apps4xService.currentAppMenuList])
    return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        Root Url - {menuText}
        {stateObject.menuDetails && (
            <PageForm ViewType="Popup" EntityObjectsId={stateObject.menuDetails.FormId}></PageForm>
        )}
        </div>)
}