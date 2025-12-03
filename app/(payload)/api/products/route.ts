import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config'; // Pastikan path ini sesuai config payload Anda
import redisClient from '@/lib/redis'; // Import redis helper yang sudah kita buat sebelumnya

export const GET = async (req: Request) => {
  const payload = await getPayload({ config: configPromise });
  
  // 1. Cek apakah ada Query Params (Search/Filter/Pagination)
  const { searchParams } = new URL(req.url);
  const hasQuery = Array.from(searchParams.keys()).length > 0;

  // Key untuk cache "Semua Data" (Halaman 1, tanpa filter)
  const cacheKey = 'products:all';

  try {
    // --- SKENARIO 1: GET ALL (Tanpa Filter) -> PAKAI REDIS ---
    if (!hasQuery) {
      // A. Cek Redis
      const cachedData = await redisClient.get(cacheKey);
      
      if (cachedData) {
        // HIT! Kembalikan data dari cache
        return NextResponse.json(JSON.parse(cachedData), { status: 200 });
      }

      // MISS! Ambil dari Payload (Database)
      const result = await payload.find({
        collection: 'products',
        depth: 1,
        limit: 100, // Atur limit default sesuai kebutuhan
      });

      // Simpan ke Redis (Expired 1 jam / 3600 detik)
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));

      return NextResponse.json(result, { status: 200 });
    }

    // --- SKENARIO 2: SEARCH / FILTER -> LANGSUNG DATABASE ---
    // Jika user melakukan search, kita tidak pakai cache 'products:all'
    // Kita biarkan Payload menangani query string-nya secara otomatis
    
    // Kita harus parse query string manual atau gunakan local API payload dengan 'where'
    // Cara paling aman untuk meneruskan query string kompleks Payload adalah 
    // membiarkan Payload REST API menanganinya, TAPI karena kita sudah override route ini,
    // kita harus memetakan query params ke payload.find().
    
    // Tips: Parsing query params URL ke format payload.find itu rumit.
    // Solusi cepat: Kita passing searchParams langsung ke opsi 'where' jika sederhana,
    // ATAU (Better Approach) -> Gunakan REST operations bawaan Payload tapi dipanggil internal.
    
    // DISINI KITA MANUALKAN SIMPLE SEARCH (sesuai kode frontend Anda):
    const titleSearch = searchParams.get('keyword');
    console.log(titleSearch)
    
    const result = await payload.find({
      collection: 'products',
      depth: 1,
      limit: 100,
      where: titleSearch ? {
        title: {
          contains: titleSearch
        }
      } : undefined,
      // Tambahkan logic pagination dari params jika perlu (page, limit, sort)
      page: Number(searchParams.get('page')) || 1,
    });

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};