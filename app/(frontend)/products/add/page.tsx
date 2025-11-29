'use client'

/**
 * ============================================================
 * ADD PRODUCT PAGE — NEXT.JS + SHADCN/UI + ZOD + TANSTACK QUERY
 * ============================================================
 * 
 * Halaman ini digunakan untuk menambahkan produk baru.
 * Menggunakan:
 * - React Hook Form → handling form
 * - Zod → validasi form
 * - ShadCN UI → komponen UI form
 * - TanStack Query → mutation untuk add data
 * 
 * Struktur:
 * 1. Import Dependencies
 * 2. Zod Schema (validasi)
 * 3. Type inference dari Zod
 * 4. Function Component + React Hook Form
 * 5. Render Form lengkap (ShadCN)
 * 6. Submit handler (menggunakan addProduct dari ProductStore)
 */

import Header from "../../component/Header";
import { useForm } from "react-hook-form";
import { useProducts } from "@/app/validity/ProductStore";
import { useRouter } from "next/navigation";

// Zod + Resolver
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ShadCN UI Form Components
import {
    Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


/**
 * ====================================
 * 1. ZOD SCHEMA UNTUK VALIDASI INPUT
 * ====================================
 * 
 * Keterangan Validasi:
 * - title: minimal 2 karakter
 * - category: harus diisi
 * - color: harus diisi
 * - varianItem: harus diisi
 * - description: optional
 * - price: angka, minimal 1
 * - image: optional, namun jika diisi harus URL valid
 */
const productSchema = z.object({
    title: z.string().min(2, "Nama produk minimal 2 karakter"),
    category: z.string().min(2, "Category harus diisi"),
    color: z.string().min(2, "Warna produk wajib diisi"),
    varianItem: z.string().min(2, "Varian Item wajib diisi"),
    description: z.string().min(2, "Deskripsi minimal 2 karakter").optional().or(z.literal('')),
    price: z.number().min(1, "Harga minimal 1"),
    image: z
        .string()
        .url({ message: "URL tidak valid" })
        .optional()
        .or(z.literal("")) // izinkan empty string
});


// =======================================
// 2. Generate TypeScript Type otomatis
// =======================================
type ProductFormType = z.infer<typeof productSchema>;



/**
 * ================================================
 * 3. FUNCTION COMPONENT: AddProductsPage
 * ================================================
 * 
 * Bagian ini mencakup:
 * - Inisialisasi React Hook Form + Zod Resolver
 * - Panggilan hook TanStack Query (useProducts)
 * - Handler submit
 * - Render UI form ShadCN lengkap
 */
export default function AddProductsPage() {

    // Redirect jika produk berhasil ditambahkan
    const router = useRouter();

    /**
     * =============================
     * TANSTACK QUERY HOOK
     * =============================
     * addProduct → function POST
     * isAdding   → loading state
     */
    const { addProduct, isAdding } = useProducts();


    /**
     * =============================
     * REACT HOOK FORM + ZOD
     * =============================
     * 
     * resolver: zodResolver() → aktifkan validasi otomatis
     * defaultValues: nilai awal semua input
     */
    const form = useForm<ProductFormType>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: "",
            category: "",
            color: "",
            varianItem: "",
            description: "",
            price: 0,
            image: ""
        }
    });


    /**
     * ============================================
     * 4. HANDLE SUBMIT FORM
     * ============================================
     * 
     * Ketika form disubmit:
     * - panggil mutation addProduct()
     * - jika sukses → alert + reset form + redirect
     * - jika gagal → tampilkan error
     */
    const onSubmit = (values: ProductFormType) => {
        addProduct(values, {
            onSuccess: () => {
                alert("Produk berhasil ditambahkan! ✅");
                form.reset();        // reset form field
                router.push('/products'); // arahkan ke halaman list
            },
            onError: (error) => {
                alert(`Gagal: ${error.message}`);
            }
        });
    };

    /**
     * Handler untuk membatalkan form dan kembali ke halaman list
     */
    const onCancel = () => {
        form.reset();        // reset form field
        router.push('/products'); // arahkan ke halaman list
    };

    /**
     * ============================================
     * 5. UI FORM (SHADCN/UI)
     * ============================================
     * 
     * Struktur:
     * <Form>
     *   <form>
     *     <FormField> → setiap input
     *       <FormItem>
     *         <FormLabel>
     *         <FormControl> → Input / Textarea
     *         <FormMessage> → error otomatis
     * ============================================
     */

    return (
        <div className="max-w-xl mx-auto p-6">

            {/* Header bawaan user */}
            <Header>
                <h1 className='text-center my-7 text-4xl font-semibold'>
                    Add Management Produk
                </h1>
            </Header>

            {/* Wrapper React Hook Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* ===========================
                        FIELD: TITLE 
                    ============================ */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Produk</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama produk" {...field} />
                                </FormControl>
                                <FormMessage /> {/* tampilkan error otomatis */}
                            </FormItem>
                        )}
                    />

                    {/* ===========================
                        FIELD: CATEGORY
                    ============================ */}
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="Masukkan kategori" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ===========================
                        FIELD: PRICE
                    ============================ */}
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Harga</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Harga"
                                        value={field.value}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ===========================
                        FIELD: COLOR
                    ============================ */}
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Varian Warna</FormLabel>
                                <FormControl>
                                    <Input placeholder="Varian Warna" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ===========================
                        FIELD: VARIAN ITEM
                    ============================ */}
                    <FormField
                        control={form.control}
                        name="varianItem"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Varian Item</FormLabel>
                                <FormControl>
                                    <Input placeholder="Varian Item" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ===========================
                        FIELD: DESCRIPTION
                    ============================ */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Deskripsi</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Deskripsi produk" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ===========================
                        FIELD: IMAGE (OPTIONAL)
                    ============================ */}
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL Gambar (Opsional)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="https://contoh.com/img.jpg"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ===========================
                        BUTTON SUBMIT
                    ============================ */}
                    <Button
                        type="submit"
                        variant={'outline'}
                        size={'default'}
                        className="w-full border-2 border-blue-400 hover:bg-blue-500"
                        disabled={isAdding} // lock saat loading
                    >
                        {isAdding ? "Menyimpan..." : "Tambah Produk"}
                    </Button>
                    <Button
                        onClick={() => onCancel()}
                        variant={'default'}
                        size={'default'}
                        className="w-full border-2 border-red-500 hover:bg-red-500"
                    >
                        Cancel
                    </Button>
                </form>
            </Form>
        </div>
    )
}
