"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../shadcn-ui/alert-dialog";

interface ConfirmDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title: string;
  readonly message: string;
  readonly onConfirm: () => void;
  readonly confirmText?: string;
  readonly cancelText?: string;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  onConfirm,
  confirmText = "はい",
  cancelText = "いいえ",
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-center">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-center pt-2">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel className="flex-1 sm:flex-1">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="flex-1 sm:flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
