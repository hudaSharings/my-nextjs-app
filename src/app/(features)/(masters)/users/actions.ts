"use server";

const users = [
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
];

export async function fetchUsers({
  page,
  pageSize,
  sort,
  search,
}: {
  page: number;
  pageSize: number;
  sort: string;
  search: string;
}) {
  let filteredUsers = users;

  if (search) {
    const searchLower = search.toLowerCase();
    filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    );
  }

  if (sort) {
    const [key, order] = sort.split(":") as [keyof (typeof users)[number], "asc" | "desc"];

    filteredUsers = filteredUsers.sort((a, b) => {
      return order === "desc" ? (a[key] < b[key] ? 1 : -1) : a[key] > b[key] ? 1 : -1;
    });
  }

  return {
    data: filteredUsers.slice((page - 1) * pageSize, page * pageSize),
    totalPages: Math.ceil(filteredUsers.length / pageSize),
  };
}

