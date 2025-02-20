"use client";

import { useTheme } from "next-themes";
import ShiftTable from "./shiftTable";
import { useState } from "react";
import { Shift } from "@/lib/types/shift";
import { useQueryClient } from "@tanstack/react-query";
import { deleteShifts } from "@/services/shiftService";
import { logToServer } from "@/lib/apiClient";
import { redirect } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PanelRight, SquareArrowUpRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ShiftForm from "./shiftForm";
export default function Page() {
  const {theme} = useTheme();
  const {toast} = useToast();
  const [useSheet, setUseSheet] = useState(true); // Toggle between Sheet and Dialog
  const [selectedShift, setselectedShift] = useState<Shift | null>(null);
  const [openSheet, setOpenSheet] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  const queryShift = useQueryClient();
      const handleAddNewShift = () => {
        setselectedShift(null);
        if (useSheet) {
          setOpenSheet(true);
        } else {
          setOpenDialog(true);
        }
      };
        const handleEditShift = (shift: Shift) => {
          setselectedShift(shift);
          if (useSheet) {
            setOpenSheet(true);
          } else {
            setOpenDialog(true);
          }
          queryShift.invalidateQueries({ queryKey: ["shifts"] });
        };
        const handleDeleteShift = (shift: Shift) => {
          setselectedShift(shift);
          setOpenAlertDialog(true);
        };
          const handleDelete = async () => {
            await deleteShifts(selectedShift!.id);
            toast({
              title: "shift deleted successfully!",
            });
            setOpenAlertDialog(false);
            logToServer("info", "Delete shift invoked" , selectedShift);   
            queryShift.invalidateQueries({ queryKey: ["shifts"] });
          };
        const handleOnViewShift = (shift: Shift) => {
          redirect(`/shift/${shift.id}`);
        };
        const handleShiftFormSubmit = () => {
          setOpenSheet(false);
          setOpenDialog(false);
          toast({
            title: "Shift details saved successfully!",
          });
          logToServer("info", selectedShift?"Edit shift invoked":"Add new shift invoked");   
          queryShift.invalidateQueries({ queryKey: ["shifts"] });
        };
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1>Shifts</h1>
      <ShiftTable 
      onAddnew={handleAddNewShift}
      onEdit={handleEditShift}
      onDelete={handleDeleteShift}
      onView={handleOnViewShift}
       />

<Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetContent className={`overflow-y-auto scroll-m-1 max-w-4xl sm:max-w-md md:max-w-2xl lg:max-w-2xl p-8 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center">
                  {selectedShift ? "Edit" : "Add"} Shift
                  <SquareArrowUpRight
                    className="ml-2 h-4 w-4 cursor-pointer"
                    onClick={() => {
                      setUseSheet(false);
                      setOpenSheet(false);
                      setOpenDialog(true);
                    }}
                  ></SquareArrowUpRight>
                </div>
              </SheetTitle>
              <SheetDescription>
                {selectedShift ? "Edit" : "Add"} the details of shift.
              </SheetDescription>
            </SheetHeader>
            <ShiftForm
              shift={selectedShift}
              onSuccess={handleShiftFormSubmit}
            />
          </SheetContent>
        </Sheet>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className={`overflow-y max-w-4xl p-8  rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center">
                {selectedShift ? "Edit" : "Add"} User
                <PanelRight
                  className="ml-2 h-4 w-4 cursor-pointer"
                  onClick={() => {
                    setUseSheet(true);
                    setOpenDialog(false);
                    setOpenSheet(true);
                  }}
                />
              </div>
            </DialogTitle>

            <DialogDescription>
              {selectedShift ? "Edit" : "Add"} the details of user.
            </DialogDescription>
          </DialogHeader>
          <ShiftForm
              shift={selectedShift}
              onSuccess={handleShiftFormSubmit}
            />      
            </DialogContent>
      </Dialog>


        <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this client? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlertDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}