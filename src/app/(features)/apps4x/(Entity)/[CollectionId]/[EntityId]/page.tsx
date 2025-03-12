"use client";

import { useParams } from "next/navigation";
import DynamicList from "../../../_components/List";

export default  function EntityPage() {
    const params = useParams();

    return (
        params.EntityId && <DynamicList Entity={params.EntityId} Collection={params.CollectionId}></DynamicList>   
    );
}
