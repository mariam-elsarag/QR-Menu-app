"use client";

import { useTranslations } from "next-intl";
import { Loader2, Trash2 } from "lucide-react";
import type { MouseEvent } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  itemName?: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
};

const ConfirmationModal = ({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  title,
  description,
  confirmLabel,
  cancelLabel,
  isLoading = false,
}: ConfirmationModalProps) => {
  const t = useTranslations();

  const handleConfirm = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await onConfirm();
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isLoading && !nextOpen) return;
        onOpenChange(nextOpen);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <Trash2 className="size-5 text-destructive" />
          </div>

          <AlertDialogTitle className="w-full text-center">
            {title ?? t("deleteTitle")}
          </AlertDialogTitle>

          <AlertDialogDescription className="w-full text-center">
            {description ??
              (itemName
                ? t("deleteDescription", { itemName })
                : t("deleteDescriptionWithoutName"))}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="grid grid-cols-2">
          <AlertDialogCancel disabled={isLoading}>
            {cancelLabel ?? t("cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isLoading}
            variant="destructive"
            onClick={handleConfirm}
          >
            {isLoading && <Loader2 className="me-2 size-4 animate-spin" />}
            {isLoading ? t("deleting") : (confirmLabel ?? t("delete"))}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
