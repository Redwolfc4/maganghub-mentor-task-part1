"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { JSX } from "react";

interface ConfirmDeleteModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (() => void);
    productName?: number | string | null;
}

export default function ConfirmDeleteModal({
    open,
    onClose,
    onConfirm,
    productName,
}: Readonly<ConfirmDeleteModalProps>): JSX.Element {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent className="sm:max-w-md bg-black">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600 font-bold text-xl">Hapus Produk?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah kamu yakin ingin menghapus produk{" "}
                        <span className="font-semibold italic">{productName}</span>?
                        Tindakan ini tidak bisa dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" className="border-2 border-gray-500 hover:bg-gray-500" onClick={onClose}>
                        Batal
                    </Button>

                    <Button variant="outline" className="border-2 border-red-500 hover:bg-red-500" onClick={onConfirm}>
                        Hapus
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
