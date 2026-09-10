import { useState, useEffect } from 'react';
import { CaretLeft, Eye, EyeSlash, ArrowsDownUp, CircleNotch } from '@phosphor-icons/react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/button';
import Input from '../../components/input';
import { useUserDetail, useCreateUser, useUpdateUser } from '../../hooks/useUsers';

const UserForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === 'edit';

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const { data: userDetail, isLoading: fetching } = useUserDetail(id, isEdit);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    if (isEdit && userDetail) {
      setFormData({
        name: userDetail.name || '',
        email: userDetail.email || '',
        role: userDetail.role || '',
        password: '',
      });
    }
  }, [isEdit, userDetail]);

  const loading = createUserMutation.isPending || updateUserMutation.isPending;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      if (isEdit && !submitData.password) {
        delete submitData.password;
      }
      let response;
      if (isEdit) {
        response = await updateUserMutation.mutateAsync({ id, data: submitData });
      } else {
        response = await createUserMutation.mutateAsync(submitData);
      }

      if (response.success) {
        navigate('/users');
      }
    } catch (error) {
      console.error('Error submitting user form:', error);
    }
  };

  const handleBack = () => navigate('/users');

  if (fetching) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <CircleNotch size={32} className="text-[#465FFF] animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Form Header */}
      <div className="p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex flex-col gap-4 lg:w-1/3">
          <Button
            type="button"
            onClick={handleBack}
            className="w-fit"
            variant="secondary"
            glossy
          >
            <CaretLeft size={16} weight="bold" />
            Kembali
          </Button>

          <div className="mt-2">
            <h2 className="text-2xl font-bold text-[#1D2939]">
              {isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}
            </h2>
            <p className="text-[#475467] mt-1 line-clamp-2">
              {isEdit
                ? 'Perbarui data pengguna. Pastikan sudah benar sebelum disimpan.'
                : 'Tambahkan data pengguna. Pastikan data sudah benar sebelum disimpan.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:flex-1 max-w-2xl">
          <Input
            label="Nama Lengkap"
            name="name"
            placeholder="Masukkan nama lengkap..."
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Alamat Email"
            name="email"
            type="email"
            placeholder="Masukkan alamat email..."
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={isEdit ? "Kosongkan jika tidak ingin diubah" : "Masukkan password..."}
                required={!isEdit}
                value={formData.password}
                onChange={handleChange}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeSlash size={18} />}
                  </button>
                }
              />
            </div>

            <div className="flex-1">
              <label className="font-['DM_Sans',sans-serif] font-medium text-[#344054] text-[14px] tracking-[-0.28px] mb-1 block">
                Role
              </label>
              <div className="relative">
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="appearance-none bg-white border border-[#e4e7ec] flex h-9 items-center px-3 rounded-[10px] w-full font-['DM_Sans',sans-serif] font-normal outline-none text-[14px] text-[#344054] focus:border-[#3641f5] transition-all cursor-pointer"
                >
                  <option value="" disabled>Pilih Role</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                  <ArrowsDownUp size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Footer */}
      <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          glossy
          onClick={handleBack}
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <CircleNotch size={20} className="animate-spin" />
          ) : (
            isEdit ? 'Simpan' : 'Tambah'
          )}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;