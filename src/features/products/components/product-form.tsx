"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import FormBuilder from "@/components/share/form/form-builder";
import { FormFieldConfig } from "@/components/share/form/types";

const schema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().trim().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  isAvailable: z.boolean(),
  status: z.enum(["draft", "published"]),
});

type ProductFormValues = z.infer<typeof schema>;

const fields: FormFieldConfig<ProductFormValues>[] = [
  {
    type: "input",
    name: "name",
    label: "fields.name",
    placeholder: "fields.namePlaceholder",
    required: true,
  },
  {
    type: "input",
    name: "price",
    label: "fields.price",
    placeholder: "fields.pricePlaceholder",
    inputType: "number",
    required: true,
  },
  {
    type: "textarea",
    name: "description",
    label: "fields.description",
    placeholder: "fields.descriptionPlaceholder",
    rows: 4,
    required: true,
  },
  {
    type: "dropdown",
    name: "categoryId",
    label: "fields.category",
    placeholder: "fields.categoryPlaceholder",
    searchable: true,
    options: [
      { label: "Burgers", value: "burgers" },
      { label: "Pizza", value: "pizza" },
      { label: "Drinks", value: "drinks" },
    ],
    required: true,
  },
  {
    type: "switch",
    name: "isAvailable",
    label: "fields.isAvailable",
  },
  {
    type: "radio",
    name: "status",
    label: "fields.status",
    options: [
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" },
    ],
    required: true,
  },
  {
    type: "dropdown",
    name: "branchIds",
    label: "fields.branches",
    placeholder: "fields.selectBranches",
    searchable: true,
    multiple: true,
    hasVirtualScroller: true,
    itemSize: 40,
    options: [
      { label: "Nasr City", value: "branch-1" },
      { label: "Maadi", value: "branch-2" },
      { label: "6th of October", value: "branch-3" },
      { label: "Heliopolis", value: "branch-4" },
      { label: "New Cairo", value: "branch-5" },
      { label: "Zamalek", value: "branch-6" },
      { label: "Downtown Cairo", value: "branch-7" },
      { label: "Dokki", value: "branch-8" },
      { label: "Mohandessin", value: "branch-9" },
      { label: "Giza", value: "branch-10" },
      { label: "Sheikh Zayed", value: "branch-11" },
      { label: "Obour City", value: "branch-12" },
      { label: "Shorouk City", value: "branch-13" },
      { label: "Madinaty", value: "branch-14" },
      { label: "Rehab City", value: "branch-15" },
      { label: "Ain Shams", value: "branch-16" },
      { label: "Abbassia", value: "branch-17" },
      { label: "Shubra", value: "branch-18" },
      { label: "Helwan", value: "branch-19" },
      { label: "Maasara", value: "branch-20" },
      { label: "Faisal", value: "branch-21" },
      { label: "Haram", value: "branch-22" },
      { label: "Imbaba", value: "branch-23" },
      { label: "Agouza", value: "branch-24" },
      { label: "Garden City", value: "branch-25" },
      { label: "New Administrative Capital", value: "branch-26" },
      { label: "Badr City", value: "branch-27" },
      { label: "10th of Ramadan", value: "branch-28" },
      { label: "Mokattam", value: "branch-29" },
      { label: "Basateen", value: "branch-30" },
      { label: "Alexandria - Smouha", value: "branch-31" },
      { label: "Alexandria - Sidi Gaber", value: "branch-32" },
      { label: "Alexandria - Miami", value: "branch-33" },
      { label: "Alexandria - Stanley", value: "branch-34" },
      { label: "Tanta", value: "branch-35" },
      { label: "Mansoura", value: "branch-36" },
      { label: "Zagazig", value: "branch-37" },
      { label: "Ismailia", value: "branch-38" },
      { label: "Port Said", value: "branch-39" },
      { label: "Suez", value: "branch-40" },
      { label: "Minya", value: "branch-41" },
      { label: "Asyut", value: "branch-42" },
      { label: "Sohag", value: "branch-43" },
      { label: "Qena", value: "branch-44" },
      { label: "Luxor", value: "branch-45" },
      { label: "Aswan", value: "branch-46" },
      { label: "Hurghada", value: "branch-47" },
      { label: "Sharm El Sheikh", value: "branch-48" },
      { label: "Dahab", value: "branch-49" },
      { label: "Marsa Matrouh", value: "branch-50" },
    ],
  },
];

const ProductForm = () => {
  const t = useTranslations("products");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      categoryId: "",
      isAvailable: true,
      status: "draft",
    },
  });

  const onSubmit = (values: ProductFormValues) => {
    console.log("Product values:", values);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormBuilder fields={fields} />

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
          {t("actions.save")}
        </Button>
      </form>
    </FormProvider>
  );
};

export default ProductForm;
