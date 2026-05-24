"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/layout/AdminSidebar";
import ErrorBoundary from "@/components/ErrorBoundary";
import ToastContainer from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { createContext, useContext } from "react";
import type { Toast } from "@/hooks/useToast";

interface ToastContextType {
  addToast: (message: string, type?: Toast["type"]) => void;
}

export const ToastContext = createContext<ToastContextType>({ addToast: () => {} });
export const useAdminToast = () => useContext(ToastContext);

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        setReady(true);
      }
    }
  }, [user, loading, router]);

  if (loading || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a12]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 animate-pulse" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a12]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <AuthProvider>
      <ToastContext.Provider value={{ addToast }}>
        <AdminLayoutInner>{children}</AdminLayoutInner>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </ToastContext.Provider>
    </AuthProvider>
  );
}
