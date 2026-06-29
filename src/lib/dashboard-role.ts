import { AuthDto } from "@/types/auth";

export type DashboardRole = "customer" | "so" | "admin";

export function getDashboardRole(user: Pick<AuthDto, "role">): DashboardRole {
  const role = String(user.role).toUpperCase();

  if (role === "ADMIN" || role === "1") {
    return "admin";
  }

  if (
    role === "SERVICE_OWNER" ||
    role === "SERVICEOWNER" ||
    role === "SO" ||
    role === "2"
  ) {
    return "so";
  }

  return "customer";
}

export function getDashboardRoleLabel(role: DashboardRole) {
  switch (role) {
    case "admin":
      return "Quản Trị Viên";
    case "so":
      return "Chủ Studio";
    case "customer":
    default:
      return "Khách Hàng";
  }
}
