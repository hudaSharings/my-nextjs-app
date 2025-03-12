import React from "react";
import PageEntity from "./pageEntity";

interface Props {
  entityForm?: any;
  group: any;
  contentGroups?: any[];
  ViewType?: string;
  Editable?: boolean;
  menuText?: any;
  tabIndex?: any;
  PageData?: any;
  PageLoadData?: any[];
}

function PageController ({
  entityForm,
  group,
  contentGroups = [],
  ViewType,
  Editable = true,
  menuText,
  tabIndex,
  PageData,
  PageLoadData = []
}:Props)  {
  if (!group.ControlType) return null;

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <div className="space-y-4">
        {(() => {
          switch (group.ControlType) {
            case "Tab":
              return (
            //   <PageTab ViewType={ViewType} menuText={menuText} group={group} Editable={Editable} className="flex" />
            <span>PageTab</span>)
            case "Section":
              return (
            //   <PageSection ViewType={ViewType} group={group} Editable={Editable} className="flex" />
                <span>PageTab</span>)
            case "Entity":
            case "Query":
            case "Chart":
            case "Report":
            case "CustomTemplate":
              return (
                <PageEntity
                  entityForm={entityForm}
                  ViewType={ViewType}
                  PageData={PageData}
                  PageLoadData={PageLoadData}
                  group={group}
                />
              );
            case "WorkFlow":
              return <div className="flex">WorkFlow action</div>;
            case "UIComponent":
              return <span>UI Config</span>;
            case "Iframe":
              return (
                // <PageIframe
                //   tabIndex={tabIndex}
                //   ViewType={ViewType}
                //   Editable={Editable}
                //   contentGroups={contentGroups}
                //   menuText={menuText}
                //   group={group}
                //   PageData={PageData}
                //   PageLoadData={PageLoadData}
                //   className="flex"
                // />
                <span>PageIframe</span>
              );
            case "WorkflowBar":
              return (
                // <PageProgressBar
                //   tabIndex={tabIndex}
                //   ViewType={ViewType}
                //   contentGroups={contentGroups}
                //   Editable={Editable}
                //   menuText={menuText}
                //   group={group}
                //   PageData={PageData}
                //   PageLoadData={PageLoadData}
                //   className="flex"
                // />
                <span>PageProgressBar</span>
              );
            case "Connector":
              return (
            //   <PageConnector tabIndex={tabIndex} Editable={Editable} ViewType={ViewType} group={group} menuText={menuText} className="flex" />
            <span>PageConnector</span>
            );
            case "Page":
              return (
            //   <PageForm tabIndex={tabIndex} Editable={Editable} ViewType={ViewType} group={group} className="flex" />
            <span>PageForm</span>
            );
            default:
              return <span>No action found</span>;
          }
        })()}
      </div>
    </div>
  );
};

export default PageController;
