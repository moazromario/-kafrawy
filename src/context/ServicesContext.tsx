import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  worksCount: number;
  pricePerHour: number;
  image: string;
  bio: string;
  portfolio: string[];
  location: string;
  isVerified: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
}

export interface Booking {
  id: string;
  professionalId: string;
  professionalName: string;
  serviceName: string;
  date: string;
  time: string;
  status: "confirmed" | "on_the_way" | "in_progress" | "completed" | "cancelled";
  totalPrice: number;
  address: string;
}

interface ServicesContextType {
  professionals: Professional[];
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "status">) => void;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [professionals] = useState<Professional[]>([
    {
      id: "p1",
      name: "أحمد النجار",
      specialty: "نجارة",
      rating: 4.9,
      reviewsCount: 128,
      worksCount: 450,
      pricePerHour: 150,
      image: "https://picsum.photos/seed/carpenter/200/200",
      bio: "خبرة أكثر من ١٥ عاماً في كافة أعمال النجارة الموبليا والتركيبات الخشبية.",
      portfolio: [
        "https://picsum.photos/seed/w1/400/300",
        "https://picsum.photos/seed/w2/400/300",
        "https://picsum.photos/seed/w3/400/300",
      ],
      location: "مدينة العبور، الحي الأول",
      isVerified: true,
    },
    {
      id: "p2",
      name: "محمود السباك",
      specialty: "سباكة",
      rating: 4.7,
      reviewsCount: 95,
      worksCount: 320,
      pricePerHour: 120,
      image: "https://picsum.photos/seed/plumber/200/200",
      bio: "متخصص في تأسيس وصيانة السباكة المنزلية بأحدث المعدات.",
      portfolio: [
        "https://picsum.photos/seed/s1/400/300",
        "https://picsum.photos/seed/s2/400/300",
      ],
      location: "مدينة العبور، الحي الخامس",
      isVerified: true,
    },
    {
      id: "p3",
      name: "سيد الكهربائي",
      specialty: "كهرباء",
      rating: 4.8,
      reviewsCount: 150,
      worksCount: 500,
      pricePerHour: 130,
      image: "https://picsum.photos/seed/electrician/200/200",
      bio: "فني كهرباء معتمد لجميع التوصيلات والأعطال المنزلية.",
      portfolio: [
        "https://picsum.photos/seed/e1/400/300",
        "https://picsum.photos/seed/e2/400/300",
      ],
      location: "مدينة العبور، الحي التاسع",
      isVerified: true,
    },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "b1",
      professionalId: "p1",
      professionalName: "أحمد النجار",
      serviceName: "تركيب باب خشب",
      date: "2026-03-15",
      time: "10:00 ص",
      status: "confirmed",
      totalPrice: 300,
      address: "الحي الثاني، فيلا ٤٥",
    }
  ]);

  const addBooking = (booking: Omit<Booking, "id" | "status">) => {
    const newBooking: Booking = {
      ...booking,
      id: `b${Date.now()}`,
      status: "confirmed",
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  return (
    <ServicesContext.Provider value={{ professionals, bookings, addBooking, updateBookingStatus }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error("useServices must be used within a ServicesProvider");
  }
  return context;
}
