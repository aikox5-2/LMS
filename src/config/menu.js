import {
    SquaresFour,
    Users,
    BookOpen,
    Monitor,
    FileText,
    ListChecks,
    Exam,   
}

from "@phosphor-icons/react";

export const MENU_DATA = {
  admin: [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: SquaresFour
    },
    {
      title: "Kelola Pengguna",
      path: "/users",
      icon: Users
    },
    {
      title: "Kelola Mapel",
      path: "/courses",
      icon: BookOpen
    },
    {
      title: "Monitor Ujian",
      path: "/monitor",
      icon: Monitor
    }
  ],
    teacher: [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: SquaresFour
    },
    {
      title: "Kelola Ujian",
      path: "/exams",
      icon: FileText
    },
    {
      title: "Bank Soal",
      path: "/question-bank",
      icon: ListChecks
    },
    {
      title: "Hasil & Evaluasi",
      path: "/results",
      icon: Exam
    }
  ],
  student: [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: SquaresFour
    },
    {
      title: "Ujian Aktif",
      path: "/active-exams",
      icon: Exam
    },
    {
      title: "Riwayat Ujian",
      path: "/history",
      icon: FileText
    }
  ]
};