import { useEffect, useState } from "react";
import DetailsPage from "../../_Details/page";
import DynamicList from "../List";
import { useTheme } from "next-themes";

interface PageEntity {
  EntityId: string;
  FormId?: string;
  Formtype?: string;
  FormViewType?: string;
  EntityName?: string;
  Collection?: string;
  FormDetailsData?: any;
  TypeId?: string;
  ObjectType?: string;
  FormDataGetType?: string;
  FormDataId?: string;
  FormDataPrimaryId?: string;
  SelectedGroupId?: string;
  LoadControllers?: string;
  HideAction?: boolean;
  HidePagination?: boolean;
  HideHeader?: boolean;
}

interface PageContentGroup {
  PageEntity: PageEntity;
}

interface Props {
  group: PageContentGroup;
  ViewType?: string;
  PageData?: any;
  PageLoadData?: any[];
  entityForm?: any;
  onSelectedGridData?: (data: any) => void;
  onGetWorkflowStageList?: (data: any) => void;
}

const PageComponent: React.FC<Props> = ({ group, ViewType, PageData, PageLoadData, entityForm, onSelectedGridData, onGetWorkflowStageList }) => {
  const [showConfigPopup, setShowConfigPopup] = useState(false);
  const [formDataId, setFormDataId] = useState<any>();
  const [formDataPrimaryId, setFormDataPrimaryId] = useState<any>();

  useEffect(() => {
    if (group.PageEntity.EntityId || group.PageEntity.FormId) {
      setShowConfigPopup(false);
    }

    if (group.PageEntity.EntityId && !group.PageEntity.TypeId) {
      group.PageEntity.TypeId = group.PageEntity.EntityId;
      group.PageEntity.ObjectType = "Entity";
    }

    if (ViewType === "viewer" && group.PageEntity.FormDataGetType === "DataSource") {
      group.PageEntity.FormDetailsData = PageData;
    } else {
      if (group.PageEntity.FormDataId) {
        setFormDataId(group.PageEntity.FormDataId);
      }
      if (group.PageEntity.FormDataPrimaryId) {
        setFormDataPrimaryId(group.PageEntity.FormDataPrimaryId);
      }
    }
  }, [group, ViewType, PageData]);
  const {theme} = useTheme();
  return (
    <div
      className={`card m-0 ${
        ViewType === "viewer" ? "shadow-none" : "shadow-md"
      }`}
    >
      <div className="card-body">
        {group.PageEntity.EntityId || group.PageEntity.FormId ? (
          <>
            {group.PageEntity.Formtype === "Details" ? (
              group.PageEntity.FormViewType === "Create" ? (
                // <DynamicCreate
                //   Title={group.PageEntity.EntityName}
                //   ViewType="Page"
                //   PageViewType={ViewType}
                //   FormViewType={group.PageEntity.FormViewType}
                //   EntityId={group.PageEntity.EntityId}
                //   group={group}
                // />
                "Dynamic Create"
              ) : (
                <div className={`max-w-sm rounded-lg shadow-lg shadow-muted border ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                  <div className="p-4">
                    <DetailsPage
                  ViewFrom="Page"
                  PageData={PageData}
                  PageLoadData={PageLoadData}
                  RecId={formDataId}
                  PrimaryId={formDataPrimaryId}
                  group={group}
                  EntityId={group.PageEntity.EntityId}
                  entityForm={entityForm}
                  DetailsData={group.PageEntity.FormDetailsData}
                  CollectionId={group.PageEntity.Collection}
                  getWorkflowStageList={(data:any) => onGetWorkflowStageList?.(data)}
                />
                  </div>
                </div>
              )
            ) : (
                <DynamicList
                  QueryId={group.PageEntity.FormId}
                  PageType={group.PageEntity.Formtype}
                  group={group}
                  EntityObjectsId={group.PageEntity.FormId}
                  ConnectorId={group.PageEntity.TypeId}
                  Entity={group.PageEntity.EntityId}
                />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PageComponent;
