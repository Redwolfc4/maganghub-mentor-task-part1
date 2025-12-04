import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config'; // Pastikan path ini sesuai config payload Anda
import redisClient from '@/lib/redis'; // Import redis helper yang sudah kita buat sebelumnya
import { deleteCache } from '@/lib/cacheHandler';

const payload = await getPayload({ config: configPromise });
export const GET = async (req: Request) => {
  
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
    
    // DISINI KITA MANUALKAN SIMPLE SEARCH (sesuai kode frontend Anda):
    const titleSearch = searchParams.get('keyword');
    const page = Number(searchParams.get('page')) || 1;

    const searchCacheKey = titleSearch ? `products:search:${titleSearch}:${page}` : null;

    if (searchCacheKey) {
      const cachedSearchData = await redisClient.get(searchCacheKey);
      if (cachedSearchData) {
        return NextResponse.json(JSON.parse(cachedSearchData), { status: 200 });
      }
    }

    
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
      page,
    });

    // Simpan ke Redis (Expired 1 jam / 3600 detik)
    if (searchCacheKey) {
      await redisClient.setEx(searchCacheKey, 3600, JSON.stringify(result));
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const createdProduct = await payload.create({
      collection: 'products',
      data: body,
    });

    if (!createdProduct) {
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    // Invalidate the 'products:all' cache after a new product is added
    // Assuming 'redis' client is available in this scope
    // If not, you'll need to import/initialize it.
    // Example: import { redis } from '@/lib/redis';
    await deleteCache('products:*');

    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
