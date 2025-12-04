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

interface FilterProductState {
    filterQuery: string;
    setFilterQuery: (query: string) => void;
}

/**
 * Zustand Store: useModalConfirmationHandle
 * 
 * Manages the state of the delete confirmation modal.
 * Stores the ID of the item to be deleted and handles open/close actions.
 */
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

const getDataurl = () => {
    if (typeof window === 'undefined') return '';
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('title') || '';
}

/**
 * Zustand Store: useFilterProduct
 * 
 * Manages the product filter state (search query).
 * Syncs the filter state with the URL query parameters.
 */
export const useFilterProduct = create<FilterProductState>((set) => ({
    filterQuery: getDataurl(),
    setFilterQuery: (query) => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        if (query) {
            params.set('title', query);
        } else {
            params.delete('title');
        }
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState(null, '', newUrl);
        set({ filterQuery: query })
    },
}));


