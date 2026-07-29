import { ReactNode } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function TenantLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute allowedRole="tenant">
      {children}
    </ProtectedRoute>
  );
}