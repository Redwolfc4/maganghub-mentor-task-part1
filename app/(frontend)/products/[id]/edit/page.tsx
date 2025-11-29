"use client"

import { useRouter } from "next/navigation"
import { use, useMemo } from 'react'

import Header from "@/app/(frontend)/component/Header"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useProductById, useProducts } from "@/app/validity/ProductStore"

/* =====================
   ZOD SCHEMA VALIDASI
====================== */
const productSchema = z.object({
    title: z.string().min(2, "Nama produk minimal 2 karakter"),
    color: z.string().min(2, "Warna wajib"),
    varianItem: z.string().min(2, "Varian item wajib"),
    description: z.string().optional(),
    price: z.number().min(1, "Harga minimal 1"),
    image: z.string().url({ message: "URL tidak valid" }).optional().or(z.literal(""))
})

type ProductFormType = z.infer<typeof productSchema>
export default function EditProductPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
    const { id } = use(params)
    const router = useRouter()

    const { updateProduct, isUpdating } = useProducts()
    const { data: product, isLoading } = useProductById(id)

    // DEFINISIKAN DEFAULT VALUES
    // Kita buat object kosong untuk inisialisasi awal agar tidak error saat loading
    const defaultValues: ProductFormType = useMemo(() => ({
        title: "",
        color: "",
        varianItem: "",
        description: "",
        price: 0,
        image: ""
    }), [])

    // SIAPKAN DATA FORM (Tanpa useEffect)
    // Jika 'product' ada (selesai fetch), kita pakai data itu. Jika belum, pakai defaultValues.
    const formValues = useMemo(() => {
        if (!product) return defaultValues

        return {
            title: product.title,
            color: product.color,
            varianItem: product.varianItem,
            description: product.description,
            price: Number(product.price),
            image: product.image ?? ""
        }
    }, [defaultValues, product])


    // FORM SETUP
    const form = useForm<ProductFormType>({
        resolver: zodResolver(productSchema),
        defaultValues: defaultValues,
        values: formValues,
        resetOptions: {
            keepDirtyValues: true
        }
    })

    // HANDLER SUBMIT
    const onSubmit = (data: ProductFormType) => {
        // pengecekan value
        const isValueChanged = JSON.stringify(data) !== JSON.stringify(formValues)
        if (!isValueChanged) {
            return
        }
        updateProduct({ id, data }, {
            onSuccess: () => {
                router.push("/products")
            }
        })

    }

    /**
     * Handler untuk membatalkan form dan kembali ke halaman list
     */
    const onCancel = () => {
        form.reset();        // reset form field
        router.push('/products'); // arahkan ke halaman list
    };

    if (isLoading) return <p className="text-center mt-7">Memuat produk...</p>

    return (
        <div className="max-w-xl mx-auto p-6">
            <Header>
                <h1 className="text-center my-7 text-3xl font-bold">
                    Edit Produk
                </h1>
            </Header>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Produk</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama produk" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Harga</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        placeholder="Masukkan harga"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Warna</FormLabel>
                                <FormControl>
                                    <Input placeholder="Warna produk" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="varianItem"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Varian</FormLabel>
                                <FormControl>
                                    <Input placeholder="Varian produk" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL Gambar</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://contoh.com/img.jpg" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* disabled={isPending} */}
                    <Button variant={"outline"} type="submit" className="w-full border-2 border-blue-400 hover:bg-blue-500">
                        {isUpdating ? "Menyimpan..." : "Update Produk"}
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
