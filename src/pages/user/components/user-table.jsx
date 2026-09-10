import { PencilSimpleLine, TrashSimple } from "@phosphor-icons/react";
import Table from "../../../components/table";
import Button from "../../../components/button";
import { formatDateTime } from "../../../utils/date";
import Badge from "../../../components/badge";

const UserTable = ({
  users = [],
  currentPage = 1,
  limit = 10,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      header: "No",
      render: (row) => (currentPage - 1) * limit + users.indexOf(row) + 1,
      className: "w-[60px] text-gray-500",
    },
    {
      header: "Akun",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#344054]">{row.name}</span>
          <span className="text-gray-500 text-sm font-normal">{row.email}</span>
        </div>
      ),
    },
    {
      header: "Role",
      className: "text-center",
      render: (row) => {
        const roleConfig = {
          admin: { label: "Admin", variant: "primary" },
          teacher: { label: "Guru", variant: "primary" },
          student: { label: "Siswa", variant: "primary" },
        }[row.role];

        return (
          <div className="flex justify-center">
            <Badge variant={roleConfig.variant}>
              {roleConfig.label}
            </Badge>
          </div>
        );
      },
    },
    {
      header: "Created At",
      render: (row) => formatDateTime(row.created_at),
      className: "text-gray-500 font-normal whitespace-nowrap",
    },
  ];

  return (
    <div className="[&>div]:border-0 [&>div]:shadow-none [&>div]:rounded-none">
      <Table
        columns={columns}
        data={users}
        renderActions={(row, closeMenu) => (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              className="justify-start! rounded-none! h-10 px-4 gap-2.5"
              onClick={() => {
                onEdit?.(row);
                closeMenu();
              }}
            >
              <PencilSimpleLine size={18} className="text-gray-500" />
              <span className="font-medium">Edit Pengguna</span>
            </Button>
            <div className="border-t border-gray-100" />
            <Button
              variant="ghostDestructive"
              className="justify-start! rounded-none! h-10 px-4 gap-2.5"
              onClick={() => {
                onDelete?.(row);
                closeMenu();
              }}
            >
              <TrashSimple size={18} />
              <span className="font-medium">Delete Pengguna</span>
            </Button>
          </div>
        )}
      />
    </div>
  );
};

export default UserTable;