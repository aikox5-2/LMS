import { useState, useEffect } from "react";
import {
  CaretLeft,
  Calendar,
  Clock,
  ArrowsDownUp,
  CircleNotch,
} from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/button";
import Input from "../../../components/input";
import { toast } from "sonner";
import { useCoursesList } from "../../../hooks/useCourses";
import {
  useExamDetail,
  useCreateExam,
  useUpdateExam,
} from "../../../hooks/useExam";

const toDatetimeLocal = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    return "";
  }
};

const extractErrorMessage = (error) => {
  if (!error) return "Terjadi kesalahan";
  const data = error.response?.data;
  if (!data) return error.message || "Gagal menghubungi server";

  if (typeof data === "string") return data;

  if (Array.isArray(data.message)) {
    return data.message.join(", ");
  }

  if (typeof data.message === "string" && data.message) {
    if (data.errors) {
      if (Array.isArray(data.errors)) {
        const errMsgs = data.errors
          .map((e) =>
            typeof e === "object"
              ? e.message || e.msg || (e.path ? `${e.path.join(".")}: ${e.message}` : null) || JSON.stringify(e)
              : e
          )
          .join(", ");
        return `${data.message}: ${errMsgs}`;
      } else if (typeof data.errors === "object") {
        const errMsgs = Object.entries(data.errors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join(", ");
        return `${data.message}: ${errMsgs}`;
      }
    }
    return data.message;
  }

  if (Array.isArray(data.error)) return data.error.join(", ");
  if (typeof data.error === "string") return data.error;

  if (Array.isArray(data.errors)) {
    return data.errors
      .map((e) =>
        typeof e === "object"
          ? e.message || e.msg || JSON.stringify(e)
          : e
      )
      .join(", ");
  }

  if (typeof data.errors === "object") {
    return Object.entries(data.errors)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
      .join(", ");
  }

  return error.message || "Gagal menyimpan ujian";
};

const ExamForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";

  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleBack = () => navigate("/exams");

  const { data: coursesData } = useCoursesList({ limit: 100 });
  const courses = Array.isArray(coursesData) ? coursesData : (coursesData?.data || []);

  const { data: examDetail, isLoading: loading } = useExamDetail(id, isEdit);

  const createExamMutation = useCreateExam();
  const updateExamMutation = useUpdateExam();

  useEffect(() => {
    if (isEdit && examDetail) {
      setTitle(examDetail.title || "");
      setCourseId(examDetail.course_id ? examDetail.course_id.toString() : "");
      setDescription(examDetail.description || "");
      setDuration(examDetail.duration ? examDetail.duration.toString() : "");
      setStartTime(
        toDatetimeLocal(examDetail.start_time || examDetail.startTime)
      );
      setEndTime(toDatetimeLocal(examDetail.end_time || examDetail.endTime));
    }
  }, [examDetail, isEdit]);

  const saving = createExamMutation.isPending || updateExamMutation.isPending;

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Silakan isi judul ujian");
      return;
    }
    if (!courseId) {
      toast.error("Silakan pilih kursus/mata pelajaran");
      return;
    }
    if (!duration || Number(duration) <= 0) {
      toast.error("Silakan isi durasi yang valid");
      return;
    }
    if (!startTime) {
      toast.error("Silakan isi waktu mulai");
      return;
    }
    if (!endTime) {
      toast.error("Silakan isi waktu selesai");
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime())) {
      toast.error("Waktu mulai tidak valid");
      return;
    }
    if (isNaN(end.getTime())) {
      toast.error("Waktu selesai tidak valid");
      return;
    }
    if (end <= start) {
      toast.error("Waktu selesai harus lebih lambat dari waktu mulai");
      return;
    }

    const payload = {
      title: title.trim(),
      course_id: Number(courseId),
      description: description.trim(),
      duration: Number(duration),
      start_time: start.toISOString(),
      end_time: end.toISOString(),
    };

    try {
      if (isEdit) {
        await updateExamMutation.mutateAsync({ id, data: payload });
        toast.success("Ujian berhasil diperbarui");
      } else {
        await createExamMutation.mutateAsync(payload);
        toast.success("Ujian berhasil dibuat");
      }
      navigate("/exams");
    } catch (error) {
      console.error("Error saving exam response data:", error.response?.data);
      console.error("Error saving exam details:", error);
      const apiMessage = extractErrorMessage(error);
      toast.error(apiMessage);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <CircleNotch size={32} className="text-[#465FFF] animate-spin" />
        </div>
      )}
      <div className="p-6 lg:p-10 flex flex-col lg:flex-row gap-10 lg:gap-20">
        {/* Left Section - Info */}
        <div className="flex flex-col gap-4 lg:w-1/3">
          <Button onClick={handleBack} className="w-fit" variant="secondary" glossy>
            <CaretLeft size={16} weight="bold" />
            Kembali
          </Button>
          <div className="mt-2">
            <h2 className="text-2xl font-bold text-[#1D2939]">
              {isEdit ? "Edit Ujian" : "Tambah Ujian"}
            </h2>
            <p className="text-[#475467] mt-1 leading-relaxed">
              {isEdit
                ? "Perbarui data ujian ini. Pastikan jadwal dan durasi sudah benar."
                : "Tambahkan data ujian. Pastikan data sudah benar sebelum disimpan."}
            </p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="flex flex-col gap-6 lg:flex-1 max-w-2xl">
          <Input
            label="Judul Ujian"
            placeholder="Masukkan judul ujian..."
            className="[&>div]:h-11 [&>div]:rounded-xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#344054]">
              Mata Pelajaran
            </label>
            <div className="relative">
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-[#e4e7ec] outline-none appearance-none transition-all focus:border-blue-500 text-sm text-[#344054] bg-white cursor-pointer"
              >
                <option value="">Pilih Mata Pelajaran</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <ArrowsDownUp
                size={18}
                className="absolute right-4 top-3 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#344054]">
              Deskripsi Singkat
            </label>
            <textarea
              className="w-full min-h-32 p-4 rounded-xl border border-[#e4e7ec] outline-none focus:border-blue-500 text-sm text-[#344054] placeholder:text-[#98a2b3] transition-all resize-none"
              placeholder="Masukkan deskripsi singkat ujian ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              label="Durasi (Menit)"
              type="number"
              placeholder="0"
              className="[&>div]:h-11 [&>div]:rounded-xl"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <Input
              label="Waktu Mulai"
              type="datetime-local"
              className="[&>div]:h-11 [&>div]:rounded-xl [&_input]:cursor-pointer"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              label="Waktu Selesai"
              type="datetime-local"
              className="[&>div]:h-11 [&>div]:rounded-xl [&_input]:cursor-pointer"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
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

export default ExamForm;