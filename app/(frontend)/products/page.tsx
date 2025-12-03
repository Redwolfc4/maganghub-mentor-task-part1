"use client"
import { Product, useProducts } from "@/app/validity/ProductStore"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import Header from "../component/Header"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa'
import { useFilterProduct, useModalConfirmationHandle } from "../zustandHandle/useModalConfirmationHandel"
import ConfirmDeleteModal from "@/app/(frontend)/component/DeleteModalConfirmation"
import { Input } from "@/components/ui/input"
import { useDebounce } from "use-debounce"

/**
 * ===============================================
 *  COMPONENT: ProductTable
 *  -----------------------------------------------
 *  Fungsi:
 *  - Menampilkan daftar produk dalam bentuk tabel
 *  - Mengambil data dari global store (Zustand)
 *  - Menampilkan state loading saat data belum siap
 *  - Menggunakan shadcn/ui table untuk styling
 *  - Memiliki header tabel yang "sticky"
 * ===============================================
 */

const ProductTable = () => {
    // buat routernya
    const navigation = useRouter();

    const { filterQuery, setFilterQuery } = useFilterProduct()

    const [queryDebounced] = useDebounce(filterQuery, 1000);

    /**
     * Hook Custom: useProducts()
     * -----------------------------------------------
     * Mengambil:
     * - products: array berisi data produk
     * - isLoading: boolean, true = saat fetch API berlangsung
     */
    const { products, isLoading, deleteProduct, isDeleting } = useProducts(queryDebounced)

    // ambil dari konfigurasi zustandhandle
    const { isOpen, onOpen, onClose, onConfirm, selectedId } = useModalConfirmationHandle()

    // ambil data di property docs
    const { docs = [] } = products || {};

    /**
     * Kondisi Loading:
     * -----------------------------------------------
     * Jika:
     * - data masih dimuat (isLoading)
     * - products masih kosong
     * Maka tampilkan pesan loading
     */
    if (isLoading) {
        return <div className="p-10 text-center text-white">Loading data...</div>
    }

    /**
     * RETURN UI UTAMA
     * -----------------------------------------------
     * UI tabel produk dengan:
     * - Header halaman
     * - Sticky header pada tabel (menempel saat scroll)
     * - Format harga Rupiah (IDR)
     * - sticky column pertama (KD Invoice)
     */
    return (
        /**
         * WRAPPER UTAMA
         * -----------------------------------------------
         * - w-full: agar tabel selebar kontainer
         */
        <div className="mx-3">

            {/** HEADER HALAMAN */}
            <Header className="my-7">
                <h1 className='text-center text-4xl font-semibold'>
                    Daftar Manajement Produk
                </h1>
            </Header>

            <div className="w-full flex flex-col sm:flex-row justify-center sm:justify-end my-3 sm:px-3 gap-3">
                {/* filterisasi data */}
                <Input
                    type="text"
                    onChange={(e) => {
                        setFilterQuery(e.target.value)
                    }}
                    defaultValue={filterQuery}
                    placeholder="Cari nama produk"
                    className="w-full mr-2"
                />


                <Button onClick={() => navigation.push("/products/add")} className="cursor-pointer" variant="outline">Add Page</Button>
            </div>

            {/** WRAPPER TABEL */}
            <div className="max-w-full mx-3">

                <Table>
                    {/** HEADER TABEL */}
                    <TableHeader>
                        <TableRow className="relative hover:bg-transparent border-b border-gray-700">

                            {/**
                             * STICKY FIRST COLUMN
                             * -----------------------------------------------
                             * - sticky top-0: header tetap terlihat saat scroll ke bawah
                             * - sticky left-0: hanya kolom paling kiri yang ikut scroll horizontal
                             * - z-52: untuk mengatasi overlapping dengan cell lain
                             * - bg-black: menjaga background saat sticky
                             */}
                            <TableHead className="sticky top-0 left-0 text-center z-36 -translate-x-1.5 bg-black shadow-md w-[120px] text-white font-bold">
                                KD Produk
                            </TableHead>

                            {/** IMAGE COLUMN */}
                            <TableHead className="sticky top-0 z-35 bg-black shadow-md text-white font-bold">
                                Gambar
                            </TableHead>

                            {/** TITLE COLUMN */}
                            <TableHead className="sticky top-0 z-35 bg-black shadow-md text-white font-bold">
                                Nama Produk
                            </TableHead>

                            {/** DESCRIPTION COLUMN */}
                            <TableHead className="sticky top-0 z-35 bg-black shadow-md text-white font-bold">
                                Deskripsi
                            </TableHead>

                            {/** VARIAN COLUMN */}
                            <TableHead className="sticky top-0 z-35 bg-black shadow-md text-white font-bold">
                                Variasi
                            </TableHead>

                            {/* COLOR COLUMN */}
                            <TableHead className="sticky top-0 z-35 bg-black shadow-md text-white font-bold">
                                Warna
                            </TableHead>

                            {/** PRICE COLUMN */}
                            <TableHead className="sticky top-0 z-35 bg-black shadow-md text-center text-white font-bold">
                                Harga
                            </TableHead>

                            {/* AKSI EDIT*/}
                            <TableHead className="sticky top-0 z-35 bg-black shadow-md text-center text-white font-bold">
                                Detail
                            </TableHead>

                            {/* AKSI EDIT*/}
                            <TableHead className="sticky top-0 z-35 bg-black shadow-md text-center text-white font-bold">
                                Edit
                            </TableHead>

                            {/* AKSI DELETE*/}
                            <TableHead className="sticky top-0 z-35 bg-black shadow-md text-center text-white font-bold">
                                Delete
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    {/** BODY TABEL */}
                    <TableBody>

                        {/**
                         * Jika data tersedia → render produk
                         * Jika tidak → tampilkan pesan "Tidak ada data"
                         */}
                        {docs.length > 0 ? (
                            docs.map((product: Product) => (

                                /**
                                 * ROW ITEM PRODUK
                                 * -----------------------------------------------
                                 * - key wajib unique
                                 * - hover:bg-gray-900: efek hover
                                 */
                                <TableRow
                                    key={product.id}
                                    className="border-gray-800 hover:bg-gray-900 transition-colors"
                                >

                                    {/**
                                     * FIRST COLUMN (STICKY)
                                     * -----------------------------------------------
                                     * - sticky left-0: kolom tetap ketika scroll horizontal
                                     * - -translate-x-1.5: perbaiki overlap border
                                     */}
                                    <TableCell className="sticky left-0 z-30 bg-black -translate-x-1.5 font-medium text-gray-300">
                                        {`Tk-${product.id}`}
                                    </TableCell>

                                    {/** IMAGE */}
                                    <TableCell className="font-medium text-gray-300">
                                        <Image
                                            src={product.image ?? ""}
                                            alt={product.title ?? ""}
                                            width={50}
                                            height={50}
                                            className="object-cover"
                                        />
                                    </TableCell>

                                    {/** TITLE */}
                                    <TableCell className="font-medium text-gray-300">
                                        {product.title ?? ''}
                                    </TableCell>

                                    {/**
                                     * DESCRIPTION (DIBATASI 4 LINE)
                                     * -----------------------------------------------
                                     * - line-clamp-4: memotong text jika terlalu panjang
                                     * - title attr: tooltip untuk full description
                                     */}
                                    <TableCell className="font-medium text-gray-300">
                                        <div className="line-clamp-4" title={product.description}>
                                            {product.description ?? ''}
                                        </div>
                                    </TableCell>

                                    {/** VARIAN */}
                                    <TableCell className="text-center font-medium text-gray-300">
                                        {product.varianItem ?? ''}
                                    </TableCell>

                                    {/** COLOR */}
                                    <TableCell className="text-center font-medium text-gray-300">
                                        {product.color ?? ''}
                                    </TableCell>

                                    {/**
                                     * PRICE (FORMATTED)
                                     * -----------------------------------------------
                                     * toLocaleString("id-ID") memberi format:
                                     * Rp 1.000.000
                                     */}
                                    <TableCell className="font-medium text-gray-300 text-right">
                                        {product?.price ? product.price.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }) : ''}
                                    </TableCell>

                                    {/* aksi detail */}
                                    <TableCell className="text-center font-medium text-gray-300">
                                        <Link href={`/products/${product.id}`}>
                                            <Button variant="outline" className="border-blue-500 border-2 cursor-pointer hover:bg-blue-500 text-center p-2" size="sm">
                                                <FaUser className="text-white" />
                                            </Button>
                                        </Link>
                                    </TableCell>

                                    {/* aksi edit */}
                                    <TableCell className="text-center font-medium text-gray-300">
                                        <Link href={`/products/${product.id}/edit`}>
                                            <Button variant="outline" className="border-blue-500 border-2 cursor-pointer hover:bg-blue-500 text-center p-2" size="sm">
                                                <FaEdit className="text-white" />
                                            </Button>
                                        </Link>
                                    </TableCell>

                                    {/* aksi delete */}
                                    <TableCell className="text-center font-medium text-gray-300">
                                        <Button variant="outline" onClick={() => onOpen(product?.id)} className="border-red-500 border-2 cursor-pointer hover:bg-red-500 text-center p-2" disabled={isDeleting} size="sm">
                                            <FaTrash className="text-white" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <>
                                {/** ROW JIKA TIDAK ADA DATA */}
                                <TableRow >
                                    <TableCell colSpan={10} className="h-24 text-center text-gray-300">
                                        Tidak ada data ditemukan.
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                    <ConfirmDeleteModal
                        open={isOpen}
                        onClose={onClose}
                        onConfirm={() => onConfirm((id) => deleteProduct(String(id)))}
                        productName={selectedId}
                    />
                </Table>
            </div>
        </div >
    )
}

export default ProductTable
