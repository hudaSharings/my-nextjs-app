"use client";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { redirect } from 'next/navigation'
import {
  MoreHorizontal,
  Pencil,
  SquareArrowOutUpRight,
  Trash2,
  PanelRight,
  SquareArrowUpRight,
  ArrowUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, UserFilter } from "@/lib/types";
import UserForm from "./userForm";
import UserFilterForm from "./userFilter";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { deleteUser, getUsers } from "@/services/userService";

type UserTableProps = {    
};
export default function UserTable() {
  const [openFilterSheet, setOpenFilterSheet] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [useSheet, setUseSheet] = useState(true); // Toggle between Sheet and Dialog
  const [selectedUser, setSelectedUser] = useState<User | null>(null);  
 
 const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
 const [sort,setSort]=useState<{column:string,order:"asc"|"desc"}>();
 const [filter,SetFilter]=useState<UserFilter>();
 
  const { toast } = useToast();
//   useEffect(() => {       
//     refetch();
//     console.log(data);
// }, [pagination,filter,sort]);

  const { data,isLoading ,refetch,isFetching,error } = useQuery<{ data: User[]; totalCount: number }>({
    queryKey: ["users", filter,pagination,sort],
    queryFn:async () =>{
      const response = await getUsers({
        pageIndex: pagination.pageIndex, 
        pageSize: pagination.pageSize,
        sortBy: sort?.column,
        sortOrder: sort?.order,
        ...filter,
      });
      console.log("Data from server:", response);
      return response;
    },  
    placeholderData: keepPreviousData,
    // Disable refetching when the user navigates the page or any dependency change unless required
   // staleTime: 1000 * 60 * 5, 
  });
  if (error) {
    console.error("Error fetching users:", error);
  }


  const handleAction = (id: number, action: string) => {
    const user = data?.data.find((user) => user.id === id);
    if (user) {
      setSelectedUser(user);
      if (action === "edit") {
        if (useSheet) {
          setOpenSheet(true);
        } else {
          setOpenDialog(true);
        }
      } else if (action === "view") {
        // if (useSheet) {
        //   setOpenSheet(true);
        // } else {
        //   setOpenDialog(true);
        // }
        redirect(`/users/${id}`);
      } else if (action === "delete") {
        setOpenAlertDialog(true);
      }
    }
  };
  const addnewUser = () => {
    setSelectedUser(null);
    if (useSheet) {
      setOpenSheet(true);
    } else {
      setOpenDialog(true);
    }
  };
  const handleDelete = async () => {
    var userIdtoDelte=selectedUser?.id   
     await deleteUser(userIdtoDelte!);
            refetch();
            toast({
                title: "User deleted successfully!",
              });
    setOpenAlertDialog(false);  
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = () => {    
    // Handle form submission logic here
    setOpenSheet(false);
    setOpenDialog(false);
    toast({
      title: "User details saved successfully!",
    });
    refetch();
  };

const handleFilter=useCallback((fv:UserFilter)=>{               
  SetFilter(fv);   
  console.log(fv);            
},[])

const handlePaginationChange=useCallback((pagination: { pageIndex: number; pageSize: number })=>{
        setPagination(pagination);
        console.log("Pagination changed:", pagination);           
 },[])
const actionsColumn = (
    handleAction: (id: number, action: string) => void
  ): ColumnDef<User>[] => [
    {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original;

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
              >
                {" "}
                <Pencil />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction(payment.id, "view")}
              >
                <SquareArrowOutUpRight />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction(payment.id, "delete")}
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  // Define Columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    // {
    //   accessorKey: "employeeId",
    //   header: "Employee Id",
    // },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return <SortingButton column={column} title="Name" />;
      },
    },
    {
      accessorKey: "userName",
      header: ({ column }) => {
        return <SortingButton column={column} title="User Name" />;
      },
    },
    {
      accessorKey: "mobileNumber",
      header: ({ column }) => {
        return <SortingButton column={column} title="Mobile Number" />;
      },
    },
    {
      accessorKey: "userType",
      header: ({ column }) => {
        return <SortingButton column={column} title="User Type" />;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    ...actionsColumn(handleAction),
  ];

  return (
    <div className="container ">
      <DataTable
        columns={columns}
        data={data?.data||[]}
        totalCount={data?.totalCount}
        paginationState={pagination}
        onPaginationChange={handlePaginationChange}
        addnew={addnewUser}
        isLoading={isLoading}
        filterComponent={<UserFilterForm getFilter={handleFilter} />}
      />

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="overflow-y-auto scroll-m-1 max-w-4xl sm:max-w-md md:max-w-2xl lg:max-w-2xl p-8 bg-white rounded-lg shadow-lg">
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
          <UserForm user={selectedUser} onSuccess={handleSubmit} />
        </SheetContent>
      </Sheet>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="overflow-y max-w-4xl p-8 bg-white rounded-lg shadow-lg">
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
          <UserForm user={selectedUser} onSuccess={handleSubmit} />
        </DialogContent>
      </Dialog>

      <Sheet open={openFilterSheet} onOpenChange={setOpenFilterSheet}>
        <SheetContent className="overflow-y-auto scroll-m-1 max-w-4xl  p-8 bg-white rounded-lg shadow-lg">
          <SheetHeader>
            <SheetTitle>
              <div className="flex items-center">
                Edit User
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
            <SheetDescription>Edit the details of the user.</SheetDescription>
          </SheetHeader>
          {/* {selectedUser && (
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
          )} */}
        </SheetContent>
      </Sheet>

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

export function SortingButton({ column, title }: any) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
