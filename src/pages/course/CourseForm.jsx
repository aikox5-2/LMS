import { useState, useEffect } from "react";
import { CaretLeft, ArrowsDownUp, CircleNotch } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/button";
import Input from "../../components/input";
import { toast } from "sonner";
import { useUsersList } from "../../hooks/useUsers";
import {
  useCourseDetail,
  useCreateCourse,
  useUpdateCourse,
} from "../../hooks/useCourses";

const CourseForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const isEdit = mode === "edit";

  const handleBack = () => navigate("/courses");

  // fetch teacher
  const { data: teachersData } = useUsersList({ role: "teacher", limit: 100 });

  // teacher data
  const teachers = teachersData?.data || [];

  const { data: courseDetail, isLoading: loading } = useCourseDetail(
    id,
    isEdit,
  );

  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();

  useEffect(() => {
    if (isEdit && courseDetail) {
      setTitle(courseDetail.title || "");
      setDescription(courseDetail.description || "");
      setTeacherId(
        courseDetail.teacher?.id ? courseDetail.teacher.id.toString() : "",
      );
    }
  }, [courseDetail, isEdit]);

  const saving =
    createCourseMutation.isPending || updateCourseMutation.isPending;

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Silakan isi judul kelas");
      return;
    }
    if (!teacherId) {
      toast.error("Silakan pilih guru pendamping");
      return;
    }

    const payload = {
      title,
      description,
      teacher_id: Number(teacherId),
      ...(isEdit ? {} : { student_ids: [] }),
    };

    try {
      if (isEdit) {
        await updateCourseMutation.mutateAsync({ id, data: payload });
      } else {
        await createCourseMutation.mutateAsync(payload);
      }
      navigate("/courses");
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Gagal menyimpan kelas");
    }
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <CircleNotch size={32} className="text-[#465FFF] animate-spin" />
        </div>
      )}

      {/* Form Header & Content */}
      <div className="p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Side: Title & Description */}
        <div className="flex flex-col gap-4 lg:w-1/3">
          <Button
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
              {isEdit ? "Edit Mapel" : "Tambah Mapel"}
            </h2>
            <p className="text-[#475467] mt-1 line-clamp-3">
              {isEdit
                ? "Perbarui data Mapel. Pastikan data sudah benar sebelum disimpan."
                : "Tambahkan data Mapel. Pastikan data sudah benar sebelum disimpan."}
            </p>
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <div className="flex flex-col gap-5 lg:flex-1 max-w-2xl">
          <Input
            label="Judul Mapel"
            placeholder="Masukkan judul Mapel..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="font-['DM_Sans',sans-serif] font-medium text-[#344054] text-[14px] tracking-[-0.28px]">
              Deskripsi Singkat
            </label>
            <textarea
              rows={4}
              className="bg-white border border-[#e4e7ec] flex items-center px-4 py-3 rounded-[10px] w-full font-['DM_Sans',sans-serif] font-normal outline-none text-[14px] text-[#344054] focus:border-[#3641f5] transition-all resize-none"
              placeholder="Masukkan deskripsi singkat dari Mapel..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['DM_Sans',sans-serif] font-medium text-[#344054] text-[14px] tracking-[-0.28px]">
              Guru Pendamping
            </label>
            <div className="relative">
              <select
                className="appearance-none bg-white border border-[#e4e7ec] flex h-11 items-center px-3 rounded-[10px] w-full font-['DM_Sans',sans-serif] font-normal outline-none text-[14px] text-[#344054] focus:border-[#3641f5] transition-all cursor-pointer"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
              >
                <option value="">Pilih Guru Pendamping</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                <ArrowsDownUp size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
        <Button
          variant="secondary"
          glossy
          onClick={handleBack}
          disabled={saving}
        >
          Batal
        </Button>
        <Button onClick={handleSave} disabled={saving || loading}>
          {saving ? (
            <>
              <CircleNotch size={18} className="animate-spin mr-2" />
              Menyimpan...
            </>
          ) : isEdit ? (
            "Simpan"
          ) : (
            "Tambah"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CourseForm;