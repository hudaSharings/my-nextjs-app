"use client";

import { useParams } from "next/navigation";

export default function CollectionPage() {
    const params = useParams();

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <h1>Collection {params.id}</h1>
        </div>
    );
}
