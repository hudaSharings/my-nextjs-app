"use client";

import { use, useState } from "react";
import ClientTable from "./clientTable";
import { Client } from "@/lib/types/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PanelRight, SquareArrowUpRight } from "lucide-react";
import ClientForm from "./clientForm";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { logToServer } from "@/lib/apiClient";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteClient } from "@/services/clientService";
import { useTheme } from "next-themes";

export default function Page() {
    const [useSheet, setUseSheet] = useState(true); // Toggle between Sheet and Dialog
    const [selectedClient, setselectedClient] = useState<Client | null>(null);
    const [openSheet, setOpenSheet] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);

    const queryClient = useQueryClient();
    const { toast } = useToast();

    const handleAddNewClient = () => {
      setselectedClient(null);
      if (useSheet) {
        setOpenSheet(true);
      } else {
        setOpenDialog(true);
      }
    };
      const handleEditClient = (client: Client) => {
        setselectedClient(client);
        if (useSheet) {
          setOpenSheet(true);
        } else {
          setOpenDialog(true);
        }
        queryClient.invalidateQueries({ queryKey: ["clients"] });
      };
      const handleDeleteClient = (client: Client) => {
        setselectedClient(client);
        setOpenAlertDialog(true);
      };
        const handleDelete = async () => {
          await deleteClient(selectedClient!.id);
          toast({
            title: "client deleted successfully!",
          });
          setOpenAlertDialog(false);
          logToServer("info", "Delete client invoked" , selectedClient);   
          queryClient.invalidateQueries({ queryKey: ["clients"] });
        };
      const handleOnViewClient = (client: Client) => {
        redirect(`/clients/${client.id}`);
      };

    const handleClientFormSubmit = () => {
      // Handle form submission logic here
      setOpenSheet(false);
      setOpenDialog(false);
      toast({
        title: "Client details saved successfully!",
      });
      logToServer("info", selectedClient?"Edit client invoked":"Add new client invoked");   
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    };
    const {theme}  = useTheme();

    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1>Clients</h1>
        <ClientTable
          onAddnew={handleAddNewClient}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
          onView={handleOnViewClient}
        />

        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetContent className={`overflow-y-auto scroll-m-1 max-w-4xl sm:max-w-md md:max-w-2xl lg:max-w-2xl p-8 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center">
                  {selectedClient ? "Edit" : "Add"} Client
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
                {selectedClient ? "Edit" : "Add"} the details of client.
              </SheetDescription>
            </SheetHeader>
            <ClientForm
              client={selectedClient}
              onSuccess={handleClientFormSubmit}
            />
          </SheetContent>
        </Sheet>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className={`overflow-y max-w-4xl p-8  rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center">
                {selectedClient ? "Edit" : "Add"} User
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
              {selectedClient ? "Edit" : "Add"} the details of user.
            </DialogDescription>
          </DialogHeader>
          <ClientForm
              client={selectedClient}
              onSuccess={handleClientFormSubmit}
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