import type { CollectionConfig } from "payload";
import redisClient from "@/lib/redis";

/**
 * Products Collection
 * 
 * Stores product data in Payload CMS.
 * 
 * Configuration:
 * - Public access (create, read, update, delete).
 * - Stores basic product details (title, description, price, etc.).
 * - Image handling: Uses a text field for external URLs instead of Payload's upload system.
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
