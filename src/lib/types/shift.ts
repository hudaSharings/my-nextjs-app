import { Audit } from "./audit";

export interface Shift extends Audit {
    clientId: number;
    name: string;
    fromTime: string;
    toTime: string;
    tolerance: string;
    expectedHours: string;
    isSplit: boolean;
    isActive: boolean;
    splits:ShiftSplit[]
    deletedSplits:ShiftSplit[]
  }
  
 export interface ShiftSplit extends Audit {
    shiftId?: number;
    fromTime: string;
    toTime: string;
    expectedHours: string;
    isActive: boolean;
  }
  export interface ShiftSplitCreate {
    shiftId: number;
    fromTime: string;
    toTime: string;
    expectedHours: string;
    isActive: boolean;
    orgId:string
  }
