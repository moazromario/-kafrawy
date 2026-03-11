import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  experience: number;
  image: string;
  price: number;
  about: string;
  availability: { day: string; slots: string[] }[];
  location: string;
  clinicName: string;
  coordinates: { lat: number; lng: number };
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "upcoming" | "past" | "cancelled";
  type: "clinic" | "video";
  price: number;
}

export interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  doctorName: string;
  type: "prescription" | "lab" | "report";
  fileUrl?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

interface MedicalContextType {
  doctors: Doctor[];
  appointments: Appointment[];
  records: MedicalRecord[];
  chats: Chat[];
  walletBalance: number;
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  addRecord: (record: Omit<MedicalRecord, "id">) => void;
  sendMessage: (chatId: string, message: Omit<Message, "id" | "timestamp">) => void;
}

const MedicalContext = createContext<MedicalContextType | undefined>(undefined);

export function MedicalProvider({ children }: { children: ReactNode }) {
  const [doctors] = useState<Doctor[]>([
    {
      id: "d1",
      name: "د. أحمد سمير",
      specialty: "استشاري جراحة القلب",
      rating: 4.9,
      reviewsCount: 250,
      experience: 15,
      image: "https://picsum.photos/seed/doc1/200/200",
      price: 400,
      about: "دكتور أحمد سمير استشاري جراحة القلب والصدر، متخصص في جراحات القلب المفتوح وتغيير الصمامات.",
      availability: [
        { day: "الأحد", slots: ["١٠:٠٠ ص", "١٠:٣٠ ص", "١١:٠٠ ص"] },
        { day: "الاثنين", slots: ["٠٤:٠٠ م", "٠٤:٣٠ م", "٠٥:٠٠ م"] },
      ],
      location: "مدينة العبور، الحي الأول، مول كفراوي",
      clinicName: "عيادة القلب التخصصية",
      coordinates: { lat: 30.23, lng: 31.45 },
    },
    {
      id: "d2",
      name: "د. سارة محمود",
      specialty: "أخصائي طب الأطفال",
      rating: 4.8,
      reviewsCount: 180,
      experience: 8,
      image: "https://picsum.photos/seed/doc2/200/200",
      price: 250,
      about: "دكتورة سارة محمود متخصصة في طب الأطفال وحديثي الولادة، ومتابعة نمو الطفل.",
      availability: [
        { day: "الثلاثاء", slots: ["٠١:٠٠ م", "٠١:٣٠ م", "٠٢:٠٠ م"] },
      ],
      location: "مدينة العبور، الحي الخامس",
      clinicName: "مركز الطفل السعيد",
      coordinates: { lat: 30.24, lng: 31.46 },
    },
    {
      id: "d3",
      name: "د. محمد علي",
      specialty: "استشاري طب وجراحة العيون",
      rating: 4.7,
      reviewsCount: 320,
      experience: 20,
      image: "https://picsum.photos/seed/doc3/200/200",
      price: 300,
      about: "دكتور محمد علي استشاري جراحة العيون والليزك، خبرة طويلة في عمليات المياه البيضاء.",
      availability: [
        { day: "الأربعاء", slots: ["٠٦:٠٠ م", "٠٦:٣٠ م", "٠٧:٠٠ م"] },
      ],
      location: "مدينة العبور، الحي التاسع",
      clinicName: "مركز النور للعيون",
      coordinates: { lat: 30.22, lng: 31.44 },
    },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "a1",
      doctorId: "d1",
      doctorName: "د. أحمد سمير",
      specialty: "جراحة القلب",
      date: "٢٠ مارس ٢٠٢٦",
      time: "١٠:٠٠ ص",
      status: "upcoming",
      type: "clinic",
      price: 400,
    },
    {
      id: "a2",
      doctorId: "d2",
      doctorName: "د. سارة محمود",
      specialty: "طب الأطفال",
      date: "١٠ مارس ٢٠٢٦",
      time: "٠٤:٠٠ م",
      status: "past",
      type: "video",
      price: 250,
    },
  ]);

  const [records, setRecords] = useState<MedicalRecord[]>([
    {
      id: "r1",
      title: "روشتة كشف القلب",
      date: "١٠ مارس ٢٠٢٦",
      doctorName: "د. أحمد سمير",
      type: "prescription",
    },
    {
      id: "r2",
      title: "تحليل صورة دم كاملة",
      date: "٠٥ مارس ٢٠٢٦",
      doctorName: "معمل البرج",
      type: "lab",
    },
  ]);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: "c1",
      doctorId: "d1",
      doctorName: "د. أحمد سمير",
      doctorImage: "https://picsum.photos/seed/doc1/200/200",
      lastMessage: "تمام يا دكتور، هعمل التحاليل دي.",
      lastMessageTime: "١٠:٣٠ ص",
      unreadCount: 0,
      messages: [
        { id: "m1", senderId: "d1", text: "أهلاً بك، كيف يمكنني مساعدتك؟", timestamp: "١٠:٠٠ ص" },
        { id: "m2", senderId: "user", text: "يا دكتور عندي ألم في الصدر بقاله يومين.", timestamp: "١٠:٠٥ ص" },
        { id: "m3", senderId: "d1", text: "هل الألم بيزيد مع المجهود؟", timestamp: "١٠:١٠ ص" },
      ],
    },
  ]);

  const [walletBalance] = useState(1250);

  const addAppointment = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = { ...appointment, id: `a${Date.now()}` };
    setAppointments((prev) => [newAppointment, ...prev]);
  };

  const addRecord = (record: Omit<MedicalRecord, "id">) => {
    const newRecord = { ...record, id: `r${Date.now()}` };
    setRecords((prev) => [newRecord, ...prev]);
  };

  const sendMessage = (chatId: string, message: Omit<Message, "id" | "timestamp">) => {
    const newMessage = { ...message, id: `m${Date.now()}`, timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) };
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: message.text || (message.imageUrl ? "صورة" : "رسالة صوتية"),
              lastMessageTime: newMessage.timestamp,
            }
          : chat
      )
    );
  };

  return (
    <MedicalContext.Provider value={{ doctors, appointments, records, chats, walletBalance, addAppointment, addRecord, sendMessage }}>
      {children}
    </MedicalContext.Provider>
  );
}

export function useMedical() {
  const context = useContext(MedicalContext);
  if (context === undefined) {
    throw new Error("useMedical must be used within a MedicalProvider");
  }
  return context;
}
