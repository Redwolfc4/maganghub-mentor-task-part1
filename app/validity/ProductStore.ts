'use client';
import { useQuery, useMutation, useQueryClient, UseMutateFunction } from '@tanstack/react-query';

// --- TIPE DATA ---
// 1. Tipe data untuk HASIL FETCH (biasanya ada ID dari server)
export interface Product {
    id: string;
    title: string;
    price: number;
    description: string;
    color: string;
    varianItem: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

// lanjutan nomor 1
export interface ProductResponse {
    docs: Product[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    hasPrevPage?: boolean;
    hasNextPage?: boolean;
}


// 2. Tipe data untuk INPUT FORM (Tanpa ID)
export type NewProductInput = {
    title: string;
    color: string
    varianItem: string
    description?: string;
    price: number;
    image?: string;
};


// --- FUNGSI API (FETCHER) ---

// A. Fetcher untuk GET Data dan search data
const fetchProductsOrSearchApi = async (query: string): Promise<ProductResponse> => {
  // Jika ada query search, panggil endpoint search
    if (query) {
        const res = await fetch(`/api/products?keyword=${query}`);
        if (!res.ok) throw new Error("Gagal mencari data");
        return res.json();
    }
    // Mengambil data dari Fake Store API
    const res = await fetch("/api/products");
    
    // jika response error
    if (!res.ok) throw new Error("Gagal mengambil data produk");

    // jika response success
    return res.json();
};

// Get products by id
const fetchProductByIdApi = async (id: string): Promise<Product> => {
    // Mengambil data dari mongodb get by id
    const res = await fetch(`/api/products/${id}`);
    
    // jika response error
    if (!res.ok) throw new Error("Gagal mengambil data produk berdasarkan ID");

    // jika response success
    return res.json();
}

// B. Fetcher untuk POST Data (Simpan ke server/API Anda)
const addProductApi = async (newProduct: NewProductInput) => {
    // Mengirim data ke server /api/products
    const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
    });
  
    console.log(res);
    
    // jika response gagal
    if (!res.ok) throw new Error("Gagal upload data");

    // jika response aman
    return res.json();
};

// C. Fetcher untuk POST Data (siman update ke server/API Anda)
const updateProductApi = async ({
    id,
    data
}: {
    id: string;
    data: NewProductInput;
}) => {
    const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("Gagal mengupdate data produk");

    return res.json();
};

// D. Fetcher untuk DELETE Data
const deleteProductApi = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, {
        method: "DELETE"
    });

  if (!res.ok) throw new Error("Gagal menghapus data produk");

  return res.json();
};

// --- CUSTOM HOOK: LIST + ADD + UPDATE ---
export interface UseProductsResult {
    products: ProductResponse | undefined;
    isLoading: boolean;
    isError: boolean;
    addProduct: UseMutateFunction<any, Error, NewProductInput, unknown>;
    isAdding: boolean;
    addError: Error | null;
    updateProduct: UseMutateFunction<any, Error, { id: string; data: NewProductInput }, unknown>;
    isUpdating: boolean;
    updateError: Error | null;
    deleteProduct: UseMutateFunction<any, Error, string, unknown>;
    isDeleting: boolean;
    deleteError: Error | null;
}

export const useProducts = (searchQuery: string = ""): UseProductsResult => {
  const queryClient = useQueryClient();

  // 1. QUERY: GET LIST PRODUK
  const productQuery = useQuery({
    queryKey: ["products", searchQuery],
    queryFn: () => fetchProductsOrSearchApi(searchQuery),
    staleTime: 1000 * 60 * 5, // 5 menit
  });

  // 2. MUTATION: ADD PRODUK
  const addMutation = useMutation({
    mutationFn: addProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // 3. MUTATION: UPDATE PRODUK
  const updateMutation = useMutation({
    mutationFn: updateProductApi,
    onSuccess: (_, variables) => {
      // invalidate data individual
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      // invalidate list
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // 4. MUTATION: DELETE PRODUK
  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      // otomatis refresh products sekarang dari database
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

    // Return gabungan state Query & Mutation
    return {
        // State untuk Read (List Produk)
        products: productQuery.data,      // Array data produk
        isLoading: productQuery.isLoading,// Loading saat fetch awal
        isError: productQuery.isError,    // Error saat fetch
        
        // State untuk Write (Tambah Produk)
        addProduct: addMutation.mutate,   // Fungsi aksi tambah
        isAdding: addMutation.isPending,  // Loading saat tombol diklik
        addError: addMutation.error,       // Error saat upload

        // ==== UPDATE PRODUK ====
        updateProduct: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        updateError: updateMutation.error,
        
        // ==== DELETE PRODUK ====
        deleteProduct: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
        deleteError: deleteMutation.error
    };
};

// --- CUSTOM HOOK: GET 1 PRODUK BY ID ---
export const useProductById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductByIdApi(id as string),
    enabled: !!id, // hanya jalan kalau id 
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};

