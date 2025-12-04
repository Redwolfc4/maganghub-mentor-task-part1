import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import redisClient from '@/lib/redis';
import { deleteCache } from '@/lib/cacheHandler';

/**
 * GET /api/products
 * 
 * Retrieves a list of products with support for:
 * 1. Caching (Redis) for performance optimization.
 * 2. Search (by keyword).
 * 3. Pagination.
 * 
 * Strategy:
 * - "All Products" (no filters) are cached under `products:all`.
 * - Search results are cached dynamically based on keyword and page, e.g., `products:search:{keyword}:{page}`.
 * - Cache expires in 1 hour (3600 seconds).
 */
export const GET = async (req: Request) => {
  const payload = await getPayload({ config: configPromise });
  
  // Parse query parameters
  const { searchParams } = new URL(req.url);
  const hasQuery = Array.from(searchParams.keys()).length > 0;

  // Cache key for the default "All Products" view
  const cacheKey = 'products:all';
  
  try {
    // --- SCENARIO 1: GET ALL (No Filters) ---
    // Prioritize Redis cache to reduce database load for the most common request.
    if (!hasQuery) {
      const cachedData = await redisClient.get(cacheKey);
      
      if (cachedData) {
        return NextResponse.json(JSON.parse(cachedData), { status: 200 });
      }

      // Cache Miss: Fetch from Database
      const result = await payload.find({
        collection: 'products',
        depth: 1,
        limit: 100,
      });

      // Cache the result for 1 hour
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));

      return NextResponse.json(result, { status: 200 });
    }
    
    // --- SCENARIO 2: SEARCH / FILTER ---
    // Handle search queries with specific cache keys to avoid returning unrelated results.
    const titleSearch = searchParams.get('keyword');
    const page = Number(searchParams.get('page')) || 1;

    // Construct a unique cache key for this specific search query and page
    const searchCacheKey = titleSearch ? `products:search:${titleSearch}:${page}` : null;

    if (searchCacheKey) {
      const cachedSearchData = await redisClient.get(searchCacheKey);
      if (cachedSearchData) {
        return NextResponse.json(JSON.parse(cachedSearchData), { status: 200 });
      }
    }

    // Perform the search in the database
    const result = await payload.find({
      collection: 'products',
      depth: 1,
      limit: 100,
      where: titleSearch ? {
        title: {
          contains: titleSearch
        }
      } : undefined,
      page,
    });

    // Cache the search result if a valid key exists
    if (searchCacheKey) {
      await redisClient.setEx(searchCacheKey, 3600, JSON.stringify(result));
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};


/**
 * POST /api/products
 * 
 * Creates a new product and invalidates the cache to ensure data consistency.
 */
export async function POST(req: NextRequest) {
  const payload = await getPayload({ config: configPromise });

  try {
    const body = await req.json();
    
    // Create product in Payload CMS
    const createdProduct = await payload.create({
      collection: 'products',
      data: body,
    });

    if (!createdProduct) {
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    // --- CACHE INVALIDATION ---
    // Clear all product-related caches so the new product appears in lists immediately.
    // This includes 'products:all' and any search caches.
    await deleteCache('products:*');

    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
