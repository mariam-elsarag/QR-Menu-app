"use client";
import React from "react";
import TableWrapper, {
  TableColumn,
} from "@/components/share/table/table-wrapper";
import ConfirmationModal from "@/components/share/model/confirmation-modal";
import ProductForm from "./product-form";

const response = {
  data: [
    { id: "1", name: "Margherita Pizza", category: "Pizza", price: 180 },
    { id: "2", name: "Chicken Burger", category: "Burgers", price: 150 },
  ],
  page: 1,
  pages: 10,
  count: 100,
};

const columns = [
  { head: "Product", field: "name" },
  { head: "Category", field: "category" },
  { head: "Price", field: "price" },
] satisfies TableColumn<(typeof response.data)[number]>[];

const ProductsList = () => {
  return (
    <div>
      <TableWrapper
        {...response}
        columns={columns}
        onPageChange={(page) => {
          // Fetch the requested page from your backend
          console.log("Fetch page:", page);
        }}
        onView={(product) => {
          console.log("View product:", product.id);
        }}
        onEdit={(product) => {
          console.log("Edit product:", product.id);
        }}
        onDelete={(product) => {
          console.log("Delete product:", product.id);
        }}
      />
      {/* <ConfirmationModal
        open={true}
        onOpenChange={(open) => {
          console.log("kkk");
        }}
        onConfirm={() => {
          console.log("kkk");
        }}
        itemName="test"
      /> */}

      <ProductForm />
    </div>
  );
};

export default ProductsList;
