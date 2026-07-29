import { ReactNode } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function LandlordLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute allowedRole="landlord">
      {children}
    </ProtectedRoute>
  );
}