import { RoleType } from "@/app/generated/prisma/enums";

export type RoleItem = {
  id: string;
  name: string;
  type: RoleType;
  permissions: string[];
  permissionCount: number;
};

export type GetRolesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type GetRolesResult =
  | {
      success: true;
      data: RoleItem[] | [];
      page: number;

      count: number;
      pages: number;
    }
  | {
      success: false;
      error: "UNAUTHORIZED" | "PERMISSION_DENIED" | "SERVER_ERROR";
    };

export type RoleItemType = {
  id: string;
  name: string;
};
