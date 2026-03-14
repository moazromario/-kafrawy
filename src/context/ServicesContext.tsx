import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { workersService } from "@/src/modules/services/workersService";

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
  loading: boolean;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkers() {
      setLoading(true);
      const { data } = await workersService.getWorkers();
      if (data) {
        setProfessionals(data.map((w: any) => ({
          id: w.user_id,
          name: w.profiles?.full_name || 'غير معروف',
          specialty: w.specialty,
          rating: w.rating,
          reviewsCount: 0, // TODO: fetch reviews
          worksCount: 0, // TODO: fetch works
          pricePerHour: w.price_per_hour,
          image: w.profiles?.avatar_url || 'https://picsum.photos/seed/user/200/200',
          bio: w.profiles?.bio || '',
          portfolio: [], // TODO: fetch portfolio
          location: w.profiles?.location || 'غير محدد',
          isVerified: true,
        })));
      }
      setLoading(false);
    }
    fetchWorkers();
  }, []);

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
    <ServicesContext.Provider value={{ professionals, bookings, addBooking, updateBookingStatus, loading }}>
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
