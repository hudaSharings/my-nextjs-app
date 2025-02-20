"use server";

import DbConnection from "@/db";
import { and, eq, ilike, inArray, SQL } from "drizzle-orm";
import { env } from "../../env.mjs";
import { ShiftFilter, ShiftSearchParams } from "@/lib/types";
import { Shift, ShiftSplit, ShiftSplitCreate } from "@/lib/types/shift";
import tables from "@/db/tables";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { NeonQueryFunction } from "@neondatabase/serverless";

export async function getShifts(
  searchParams?: ShiftSearchParams
): Promise<{ data: Shift[]; totalCount: number }> {
  console.log(searchParams);
  const filters = searchParams as ShiftFilter;
  const filtersArray: SQL[] = [];
  if (filters) {
    if (filters.name) {
      filtersArray.push(ilike(tables.shifts.name, "%" + filters.name + "%"));
    }
    if (filters.isSplit === true || filters.isSplit === false) {
      filtersArray.push(eq(tables.shifts.isSplit, filters.isSplit));
    }
    if (filters.fromTime) {
      filtersArray.push(
        ilike(tables.shifts.fromTime, "%" + filters.fromTime + "%")
      );
    }
    if (filters.toTime) {
      filtersArray.push(
        ilike(tables.shifts.toTime, "%" + filters.toTime + "%")
      );
    }
    if (filters.expectedHours) {
      filtersArray.push(
        ilike(tables.shifts.expectedHours, "%" + filters.expectedHours + "%")
      );
    }
    if (filters.clientId) {
      filtersArray.push(eq(tables.shifts.clientId, filters.clientId));
    }
  }
  const limit = searchParams?.pageSize ?? 10;
  const offset =
    (filtersArray.length > 0 ? 0 : searchParams?.pageIndex ?? 0) * limit;

  const { db, sql } = await DbConnection(env.DATABASE_URL!);
  const shifts = (await db
    .select()
    .from(tables.shifts)
    .where(and(...filtersArray))
    .offset(offset)
    .limit(limit)
    .orderBy(tables.shifts.id)) as Shift[];

  const shiftSplits = (await db
    .select()
    .from(tables.shiftSplits)
    .orderBy(tables.shiftSplits.id)) as ShiftSplit[];

  const shiftCount = (await db.execute(sql.raw("SELECT COUNT(1) FROM shifts")))
    .rows[0].count as number;
  console.log(shifts.length, shiftCount);

  for (const shift of shifts) {
    if (shift.isSplit === true) {
      shift.splits = shiftSplits.filter((x) => x.shiftId === shift.id);
    }
  }
  return { data: shifts as Shift[], totalCount: shiftCount ?? 0 };
}
export async function createShiftwithSplit(orgId:string,shift: Shift) {
  const { db } = await DbConnection(env.DATABASE_URL!);
  try {
    const CreatedShift = await db
      .insert(tables.shifts)
      .values({
        clientId: Number(shift.clientId),
        name: shift.name,
        fromTime: shift.fromTime,
        toTime: shift.toTime,
        tolerance: shift.tolerance,
        expectedHours: shift.expectedHours,
        isSplit: shift.isSplit,
        isActive: shift.isActive,
        orgId: orgId,
      })
      .returning();
    console.log("Created Shift:", CreatedShift);

    if (shift.isSplit === true && shift.splits?.length > 0) {
      await ByPassCreateAndUpdate(db, shift, CreatedShift[0].id, orgId);
    }
    return await CreatedShift[0];
  } catch (error) {
    throw Error;
  }
}
export async function ByPassCreateAndUpdate(
  db: NeonHttpDatabase<Record<string, never>> & {
    $client: NeonQueryFunction<false, false>;
  },
  shift: Shift,
  id: number,
  orgId: string
) {
  let _splitsCreate: ShiftSplitCreate[] = [];
  let _splitsUpdate: ShiftSplit[] = [];

  shift.splits.forEach((x) => {
    if (x?.id != null) {
      _splitsUpdate.push(x);
    } else {
      let _split: ShiftSplitCreate = {
        shiftId: id,
        fromTime: x.fromTime,
        toTime: x.toTime,
        expectedHours: x.expectedHours,
        isActive: x.isActive,
        orgId: orgId,
      };
      _splitsCreate.push(_split);
    }
  });

  if (_splitsCreate.length > 0) {
    await createShiftSplit(db, _splitsCreate);
  }
  if (_splitsUpdate.length > 0) {
    await updateSplitMethod(db, _splitsUpdate);
  }
}
export async function updateSplitMethod(
  db: NeonHttpDatabase<Record<string, never>> & {
    $client: NeonQueryFunction<false, false>;
  },
  splits: ShiftSplit[]
) {
  if (splits.length === 0) return;

  const ids = splits.map((s) => s.id);
  const fromTimes = splits.map((s) => s.fromTime);
  const toTimes = splits.map((s) => s.toTime);
  const expectedHours = splits.map((s) => s.expectedHours);
  const isActive = splits.map((s) => s.isActive);
  const orgIds = splits.map((s) => s.orgId);
  const shiftIds = splits.map((s) => s.shiftId);

  const query = `
          UPDATE "shiftSplits" AS s
          SET 
              "fromTime" = u."fromTime",
              "toTime" = u."toTime",
              "expectedHours" = u."expectedHours",
              "isActive" = u."isActive",
              "orgId" = u."orgId",
              "shiftId" = u."shiftId"
          FROM (
              SELECT UNNEST($1::int[]) AS id,
                     UNNEST($2::text[]) AS "fromTime",
                     UNNEST($3::text[]) AS "toTime",
                     UNNEST($4::text[]) AS "expectedHours",
                     UNNEST($5::boolean[]) AS "isActive",
                     UNNEST($6::text[]) AS "orgId",
                     UNNEST($7::int[]) AS "shiftId"
          ) AS u
          WHERE s.id = u.id;
      `;

  await db.$client(query, [
    ids,
    fromTimes,
    toTimes,
    expectedHours,
    isActive,
    orgIds,
    shiftIds,
  ]);
}
export async function createShiftSplit(
  db: NeonHttpDatabase<Record<string, never>> & {
    $client: NeonQueryFunction<false, false>;
  },
  _splits: ShiftSplitCreate[]
) {
  const createdShiftSplit = await db
    .insert(tables.shiftSplits)
    .values(_splits)
    .returning();
  console.log(createdShiftSplit);
}
export async function putShifts(shift:Shift,id:number){
    const { db } = await DbConnection(env.DATABASE_URL!);
    const UpdatedShifts = await db
        .update(tables.shifts)
        .set({
            expectedHours:shift.expectedHours,
            fromTime:shift.fromTime,
            toTime:shift.toTime,
            isActive:shift.isActive,
            isSplit:shift.isSplit,
            name:shift.name,
            tolerance:shift.tolerance,
        })
        .where(eq(tables.shifts.id, id))
        .returning();
        
        if(shift.splits.length>0){
        await ByPassCreateAndUpdate(db,shift,id,"");
        }

        if(shift.deletedSplits.length>0){
        await deleteMultiSplits(db,shift.deletedSplits)
        }

        return UpdatedShifts[0];
}
export async function deleteShifts(id:number){
    const { db } = await DbConnection(env.DATABASE_URL!);
    const deletedShift = await db
        .delete(tables.shifts)
        .where(eq(tables.shifts.id, id))
        .returning();
    return deletedShift;
}
export async function deleteShiftSplit(id:number){
    const { db } = await DbConnection(env.DATABASE_URL!);
    const deletedShiftSplit = await db
        .delete(tables.shiftSplits)
        .where(eq(tables.shiftSplits.id, id))
        .returning();
    return deletedShiftSplit;
}
export async function deleteMultiSplits(db: NeonHttpDatabase<Record<string, never>> & {
    $client: NeonQueryFunction<false, false>;
}, Splits: ShiftSplit[]) {
    const ids = Splits.map(s => s.id);
    const deletedSplits = await db
        .delete(tables.shiftSplits).where(inArray(tables.shiftSplits.id, ids))
        .returning();
    return deletedSplits;
}