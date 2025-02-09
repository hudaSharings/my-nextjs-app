"use client"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { MoreHorizontal, Pencil, SquareArrowOutUpRight, Trash2, StretchHorizontal, ArrowUpRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const data = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User", status: "Inactive" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Admin", status: "Active" },
  { id: 4, name: "David Wilson", email: "david@example.com", role: "User", status: "Inactive" },
  { id: 5, name: "Emma Davis", email: "emma@example.com", role: "User", status: "Active" },
  { id: 6, name: "Frank White", email: "frank@example.com", role: "Admin", status: "Inactive" },
  { id: 7, name: "Grace Lee", email: "grace@example.com", role: "User", status: "Active" },
  { id: 8, name: "Henry Green", email: "henry@example.com", role: "User", status: "Inactive" },
  { id: 9, name: "Isla Martinez", email: "isla@example.com", role: "Admin", status: "Active" },
  { id: 10, name: "Jack Taylor", email: "jack@example.com", role: "User", status: "Active" },
  { id: 11, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 12, name: "Bob Smith", email: "bob@example.com", role: "User", status: "Inactive" },
  { id: 13, name: "Charlie Brown", email: "charlie@example.com", role: "Admin", status: "Active" },
  { id: 14, name: "David Wilson", email: "david@example.com", role: "User", status: "Inactive" },
  { id: 15, name: "Emma Davis", email: "emma@example.com", role: "User", status: "Active" },
  { id: 16, name: "Frank White", email: "frank@example.com", role: "Admin", status: "Inactive" },
  { id: 17, name: "Grace Lee", email: "grace@example.com", role: "User", status: "Active" },
  { id: 18, name: "Henry Green", email: "henry@example.com", role: "User", status: "Inactive" },
  { id: 19, name: "Isla Martinez", email: "isla@example.com", role: "Admin", status: "Active" },
];

export default function UserTable() {
  const [openSheet, setOpenSheet] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [useSheet, setUseSheet] = useState(true); // Toggle between Sheet and Dialog
  const [selectedUser, setSelectedUser] = useState<{ id: number, name: string, email: string } | null>(null);
  const { toast } = useToast();

  const handleAction = (id: number, action: string) => {
    const user = data.find(user => user.id === id);
    if (user) {
      setSelectedUser(user);
      if (action === "edit") {
        if (useSheet) {
          setOpenSheet(true);
        } else {
          setOpenDialog(true);
        }
      } else if (action === "view") {
        if (useSheet) {
          setOpenSheet(true);
        } else {
          setOpenDialog(true);
        }
      } else if (action === "delete") {
        setOpenAlertDialog(true);
      }
    }
  }

  const handleDelete = () => {
    // Handle delete logic here
    setOpenAlertDialog(false);
    toast({
      title: "User deleted successfully!",
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        [e.target.name]: e.target.value
      });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    setOpenSheet(false);
    setOpenDialog(false);
    toast({
      title: "User details saved successfully!",
    });
  }

  const createMandateColumns = (handleAction: (id: number, action: string) => void): ColumnDef<typeof data[0]>[] => [
    {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">            
              <DropdownMenuItem
                onClick={() => handleAction(payment.id, "edit")}
              > <Pencil />
               Edit 
              </DropdownMenuItem>            
              <DropdownMenuItem onClick={() => handleAction(payment.id, "view")}>
              <SquareArrowOutUpRight />
                View 
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction(payment.id, "delete")}>
              <Trash2 />
                Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  // Define Columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    ...createMandateColumns(handleAction)
  ]

  return (
    <div className="container ">
      <DataTable columns={columns} data={data} />

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <div className="flex items-center">            
              Edit User 
              <ArrowUpRight className="ml-2 h-4 w-4" onClick={() => { setUseSheet(false); setOpenSheet(false); setOpenDialog(true); }} ></ArrowUpRight>
              </div>
              
            </SheetTitle>
            <SheetDescription>
              Edit the details of the user.
            </SheetDescription>           
          </SheetHeader>
          {selectedUser && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={selectedUser.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleInputChange}
                />
              </div>
              <Button type="submit">Save</Button>
            </form>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
            <div className="flex items-center">   
              Edit User
              <StretchHorizontal className="ml-2 h-4 w-4" onClick={() => { setUseSheet(true); setOpenDialog(false); setOpenSheet(true); }} />
            </div>
            </DialogTitle>
            
            <DialogDescription>
              Edit the details of the user.
            </DialogDescription>
           
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={selectedUser.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleInputChange}
                />
              </div>
              <Button type="submit">Save</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlertDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

