"use client";
import { deleteUser } from "@/services/userService";
import UsersTable from "./UsersTable";
import { User } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PanelRight, SquareArrowUpRight } from "lucide-react";
import UserForm from "./userForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { redirect } from "next/navigation";
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
import { logToServer } from "@/lib/apiClient";
import { useTheme } from "next-themes";


export default function Page() {
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [useSheet, setUseSheet] = useState(true); // Toggle between Sheet and Dialog
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleAddNewUser = () => {
    setSelectedUser(null);
    if (useSheet) {
      setOpenSheet(true);
    } else {
      setOpenDialog(true);
    }
   // logToServer("info", "Add new user" , selectedUser);   
  };
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    if (useSheet) {
      setOpenSheet(true);
    } else {
      setOpenDialog(true);
    }
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setOpenAlertDialog(true);
  };
  const handleDelete = async () => {
    await deleteUser(selectedUser!.id);
    toast({
      title: "User deleted successfully!",
    });
    setOpenAlertDialog(false);
    logToServer("info", "Delete user invoked" , selectedUser);   
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };
  const handleOnViewUser = (user: User) => {
    redirect(`/users/${user.id}`);
  };

  const handleUserFormSubmit = () => {
    // Handle form submission logic here
    setOpenSheet(false);
    setOpenDialog(false);
    toast({
      title: "User details saved successfully!",
    });
    logToServer("info", selectedUser?"Edit user invoked":"Add new user invoked");   
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const {theme}  = useTheme();


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1>Users</h1>
      <UsersTable
        onAddnew={handleAddNewUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onView={handleOnViewUser}
      />

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetContent className={`overflow-y-auto scroll-m-1 max-w-4xl sm:max-w-md md:max-w-2xl lg:max-w-2xl p-8 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      <SheetHeader>
            <SheetTitle>
              <div className="flex items-center">
                {selectedUser ? "Edit" : "Add"} User
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
              {selectedUser ? "Edit" : "Add"} the details of user.
            </SheetDescription>
          </SheetHeader>
          <UserForm user={selectedUser} onSuccess={handleUserFormSubmit} />
        </SheetContent>
      </Sheet>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className={`overflow-y max-w-4xl p-8  rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      <DialogHeader>
            <DialogTitle>
              <div className="flex items-center">
                {selectedUser ? "Edit" : "Add"} User
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
              {selectedUser ? "Edit" : "Add"} the details of user.
            </DialogDescription>
          </DialogHeader>
          <UserForm user={selectedUser} onSuccess={handleUserFormSubmit} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be
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
