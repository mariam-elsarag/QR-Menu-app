"use client";
import React, { useState } from "react";
import { GetUsersResult, UserItemType } from "../typse/types";
import TableWrapper from "@/components/share/table/table-wrapper";
import { TableColumn } from "@/components/share/table/types";
import UserStatusBadge from "./user-status-badge";
import InvitationStatusBadge from "./invitation-status-badge";
import { UserStatus } from "@/app/generated/prisma/enums";

type UsersTableProps = {
  response: Extract<GetUsersResult, { success: true }>;
  loading: boolean;
};

const UsersTable = ({ response, loading }: UsersTableProps) => {
  const { data, page, pages, count } = response;
  console.log(response, "s");
  const [visible, setVisible] = useState<{
    visible: boolean;
    value: string;
  }>({ visible: false, value: "" });
  const columns = [
    {
      head: "fullName",
      field: "fullName",
    },
    {
      head: "email",
      field: "email",
    },
    {
      head: "phone",
      field: "phone",
      render: (value) => <p dir="ltr">{value}</p>,
    },
    {
      head: "status",
      field: "status",
      render: (_, row) => <UserStatusBadge status={row.status} />,
    },
    {
      head: "invitationStatus",
      field: "invitationStatus",
      render: (_, row) => (
        <InvitationStatusBadge status={row.invitationStatus} />
      ),
    },
  ] satisfies TableColumn<UserItemType>[];
  return (
    <div>
      {" "}
      <TableWrapper
        data={data}
        columns={columns}
        page={page}
        pages={pages}
        count={count}
        isLoading={loading}
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
    </div>
  );
};

export default UsersTable;
