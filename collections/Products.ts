import type { CollectionConfig } from "payload";

/**
 * ========================
 *  PRODUCTS COLLECTION
 * ========================
 *
 * Collection ini digunakan untuk menyimpan data produk di Payload CMS.
 *
 * Setiap field dalam collection ini sudah dikonfigurasi agar:
 * - Bisa diakses public (create + read = true)
 * - Menyimpan data dasar produk (title, description, price, color, varianItem, image)
 *
 * Catatan penting:
 * - Field `image` TIDAK menggunakan upload bawaan Payload.
 * - Field `image` bertipe `text`, sehingga bisa menyimpan URL gambar eksternal.
 * - Cocok untuk gambar dari internet (misal: https://example.com/image.webp)
 */

const Products: CollectionConfig = {
  slug: "products", // URL dan API endpoint → /api/products

  admin: {
    useAsTitle: "title", // Judul produk akan muncul sebagai label utama di dashboard admin
  },

  access: {
    // Mengizinkan semua user (termasuk non-auth) membuat produk
    // Jika ingin proteksi nanti cukup ubah return false atau tambahkan role-based
    create: () => true,

    // Mengizinkan semua user membaca produk
    read: () => true,

    // Mengizinkan semua user memperbarui dan menghapus produk
    // Jika ingin proteksi nanti cukup ubah return false atau tambahkan role-based
    update: () => true,
    delete: () => true,
  },

  fields: [
    /**
     * TITLE
     * Judul / nama produk
     * Contoh: "iPhone 15 Pro Max"
     */
    {
      name: "title",
      type: "text",
      required: true,
    },

    /**
     * DESCRIPTION
     * Penjelasan singkat mengenai produk
     * Contoh: "Smartphone terbaru dengan chip A17 Pro."
     */
    {
      name: "description",
      type: "text",
    },

    /**
     * PRICE
     * Harga produk dalam satuan angka
     * Contoh: 15000000
     */
    {
      name: "price",
      type: "number",
      required: true,
    },

    /**
     * COLOR
     * Warna produk
     * Contoh: "Black", "Blue", "Titanium"
     */
    {
      name: "color",
      type: "text",
      required: true,
    },

    /**
     * VARIAN ITEM
     * Varian lain dari produk (misal kapasitas, ukuran)
     * Contoh: "256GB", "512GB", "XL", "S"
     */
    {
      name: "varianItem",
      type: "text",
      required: true,
    },

    /**
     * IMAGE
     * Menyimpan URL gambar produk.
     *
     * Kenapa type: text?
     * - Karena kamu mengirim URL (string) dari internet.
     * - Jika menggunakan type: "upload", Payload akan mengharuskan file.
     * - Dengan type: "text", kamu bebas memakai gambar dari mana saja.
     *
     * Contoh input:
     * "https://example.com/product-image.webp"
     */
    {
      name: "image",
      type: "text",
      // fields: [
        //     {
        //         name: "url",
        //         type: "text",
        //         required: true
        //     }
        // ]
    },
  ],
};

export {Products};
