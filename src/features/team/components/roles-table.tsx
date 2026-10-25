"use client";

import type { GetRolesResult, RoleItem } from "../type/types";
import type { TableColumn } from "@/components/share/table/types";
import TableWrapper from "@/components/share/table/table-wrapper";
import PermissionList from "./permission-list";
import { useState } from "react";
import ConfirmationModal from "@/components/share/model/confirmation-modal";

type RolesTableProps = {
  response: Extract<GetRolesResult, { success: true }>;
};

export default function RolesTable({ response }: RolesTableProps) {
  const { data, page, pages, count } = response;
  const [visible, setVisible] = useState<{
    visible: boolean;
    value: string;
  }>({ visible: false, value: "" });

  const columns = [
    {
      head: "Role",
      field: "name",
    },
    {
      head: "Permissions",
      field: "permissions",
      render: (value, row) => (
        <PermissionList
          permissions={Array.isArray(value) ? value : []}
          roleType={row.type}
          visibleCount={3}
        />
      ),
    },
  ] satisfies TableColumn<RoleItem>[];

  return (
    <>
      <TableWrapper
        data={data}
        columns={columns}
        page={page}
        pages={pages}
        count={count}
        onPageChange={(nextPage) => {
          console.log("Fetch page:", nextPage);
        }}
        onEdit={(role) => console.log("Edit role:", role.id)}
        onDelete={(role) => {
          setVisible({
            visible: true,
            value: role?.id,
          });
        }}
      />
      <ConfirmationModal
        open={visible?.visible}
        onOpenChange={(open) => {
          setVisible({ visible: false, value: "" });
          console.log("kkk");
        }}
        onConfirm={() => {
          console.log("kkk");
        }}
        title="deleteRole"
        description="deleteRoleMessage"
      />
    </>
  );
}
