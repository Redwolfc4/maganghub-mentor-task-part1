// useModalConfirmationHandel.ts
import { create } from 'zustand'

interface ConfirmDeleteModalState {
    isOpen: boolean;
    selectedId: string | number | null;
    productName?: string;

    onOpen: (id: string | number) => void;
    onClose: () => void;
    onConfirm: ((callback: (id: string | number) => void) => void) | (() => void);
}

export const useModalConfirmationHandle = create<ConfirmDeleteModalState>((set, get) => ({
    isOpen: false,
    selectedId: null,
    productName: "",

    // Open modal with selected product ID
    onOpen: (id) => set({ isOpen: true, selectedId: id }),

    // Close modal + reset selection
    onClose: () => set({ isOpen: false, selectedId: null }),

    // Run delete callback, then close modal
    onConfirm: (callback) => {
        const id = get().selectedId;
        if (id) callback(id);
        set({ isOpen: false, selectedId: null });
    },
}));
