import { PencilSimpleLine, TrashSimple, GraduationCap } from '@phosphor-icons/react';
import Table from '../../components/table';
import Button from '../../components/button';

import { formatDateTimeWithComma } from '../../utils/date';
import Badge from '../../components/badge';

const CourseTable = ({ courses = [], currentPage = 1, limit = 10, onEdit, onDelete, onManageStudents }) => {
  const columns = [
    {
      header: 'No',
      render: (row) => (currentPage - 1) * limit + courses.indexOf(row) + 1,
      className: 'w-[60px] text-gray-500'
    },
    {
      header: 'Judul Mapel',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#344054]">{row.title}</span>
          <span className="text-gray-500 text-sm font-normal line-clamp-1">{row.description}</span>
        </div>
      )
    },
    {
      header: 'Guru Pendamping',
      render: (row) => {
        const teacherName = row.teacher?.name;
        return (
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <GraduationCap size={18} className="text-[#3641F5]" />
            </div>
            <span className="text-[#344054] font-medium whitespace-nowrap">{teacherName}</span>
          </div>
        );
      }
    },
    {
      header: 'Total Siswa',
      className: "text-center",
      render: (row) => {
        const totalStudents = row.total_students;
        return (
          <div className="flex justify-center">
            <Badge variant="primary">
              {totalStudents} Siswa
            </Badge>
          </div>
        );
      }
    },
    {
      header: 'Created At',
      render: (row) => (
        <span className="text-gray-500 font-normal whitespace-nowrap">
          {formatDateTimeWithComma(row.created_at)}
        </span>
      )
    }
  ];

  return (
    <div className="[&>div]:border-0 [&>div]:shadow-none [&>div]:rounded-none">
      <Table
        columns={columns}
        data={courses}
        renderActions={(row, closeMenu) => (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              className="justify-start! rounded-none! h-10 px-4 gap-2.5"
              onClick={() => { onEdit?.(row); closeMenu(); }}
            >
              <PencilSimpleLine size={18} className="text-gray-500" />
              <span className="font-medium">Edit Mapel</span>
            </Button>
            <div className="border-t border-gray-100" />
            <Button
              variant="ghost"
              className="justify-start! rounded-none! h-10 px-4 gap-2.5"
              onClick={() => { onManageStudents?.(row); closeMenu(); }}
            >
              <GraduationCap size={18} className="text-gray-500" />
              <span className="font-medium">Kelola Siswa</span>
            </Button>
            <div className="border-t border-gray-100" />
            <Button
              variant="ghostDestructive"
              className="justify-start! rounded-none! h-10 px-4 gap-2.5"
              onClick={() => { onDelete?.(row); closeMenu(); }}
            >
              <TrashSimple size={18} />
              <span className="font-medium">Hapus Mapel</span>
            </Button>
          </div>
        )}
      />
    </div>
  );
};

export default CourseTable;