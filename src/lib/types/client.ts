import { Audit } from "./audit";

export interface Client extends Audit {
    name: string;
    region: string;
    country: string;
    language: string;
    isActive: boolean;
}
