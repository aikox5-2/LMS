import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button";
import Input from "../../components/input";
import Pagination from "../../components/pagination";
import Modal from "../../components/modal";
import FilterDropdown from "../../components/filter-dropdown";
import UserTable from "./components/user-table";
import UserDelete from "./components/user-delete";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useUsersList, useDeleteUser } from "../../hooks/useUsers";
import { useDebounce } from "../../hooks/useDebounce";
import { CircleNotch, Plus } from "@phosphor-icons/react";

const User = () => {
  const navigate = useNavigate();
  const deleteModal = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);

  const [pagination, setPagination] = useState({
    current_page: 1,
    limit: 10,
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  }, [debouncedSearch]);

  const { data: usersData, isLoading, isFetching } = useUsersList({
    page: pagination.current_page,
    limit: pagination.limit,
    search: debouncedSearch,
    role: selectedRole || undefined,
  });

  const deleteUserMutation = useDeleteUser();

  const users = usersData?.data || [];
  const queryPagination = usersData?.pagination || {
    current_page: 1,
    total_page: 1,
    total_data: 0,
    limit: 10,
  };

  const loading = isLoading || deleteUserMutation.isPending;

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current_page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, current_page: 1 }));
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const handleDelete = async (user) => {
    try {
      await deleteUserMutation.mutateAsync(user.id);
      deleteModal.close();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full px-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-[#1D2939] tracking-tight">
            Daftar Pengguna
          </h1>
          <p className="text-[#475467] mt-0.5">
            Pantau dan kelola pengguna dengan cepat.
          </p>
        </div>
        <div className="flex md:justify-end">
          <Button
            className="w-full md:w-auto h-11"
            onClick={() => navigate("/users/create")}
          >
            <Plus size={20} weight="bold" className="mr-2" />
            Tambah Pengguna
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(16,24,40,0.1),0_1px_2px_rgba(16,24,40,0.06)] overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex items-end gap-3 flex-1">
            <div className="flex-1">
              <Input
                label="Search"
                placeholder="Cari nama..."
                className="w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <FilterDropdown
              options={[
                { label: "Semua Pengguna", value: "" },
                { label: "Admin", value: "admin" },
                { label: "Student", value: "student" },
                { label: "Teacher", value: "teacher" },
              ]}
              selectedValue={selectedRole}
              onSelect={handleRoleSelect}
            />
          </div>
        </div>

        <div className="relative min-h-50">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <CircleNotch size={32} className="text-[#465FFF] animate-spin" />
            </div>
          )}

          <UserTable
            users={users}
            currentPage={pagination.current_page}
            limit={pagination.limit}
            onEdit={(user) => navigate(`/users/edit/${user.id}`)}
            onDelete={(user) => {
              setSelectedUser(user);
              deleteUserMutation.reset();
              deleteModal.open();
            }}
          />
        </div>

        {/* Atomic Pagination */}
        <Pagination
          currentPage={queryPagination.current_page}
          totalPages={queryPagination.total_page}
          onPageChange={handlePageChange}
          limit={pagination.limit}
          onLimitChange={handleLimitChange}
        />
      </div>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close}>
        <UserDelete
          user={selectedUser}
          onClose={deleteModal.close}
          onDelete={handleDelete}
          isLoading={deleteUserMutation.isPending}
          error={deleteUserMutation.error}
        />
      </Modal>
    </div>
  );
};

export default User;