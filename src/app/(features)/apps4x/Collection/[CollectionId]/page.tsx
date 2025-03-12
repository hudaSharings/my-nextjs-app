"use client";

import { useParams } from "next/navigation";
import DynamicList from "../../_components/List";

export default function CollectionPage() {
    const params = useParams();

    return (
        params.CollectionId && <DynamicList Collection={params.CollectionId}></DynamicList>   
    );
}
