import { getPayload } from "payload";
import configPromise from "@payload-config";
import { deleteCache } from "@/lib/cacheHandler";
import redisClient from "@/lib/redis";
import { NextResponse } from "next/server";

/**
 * DELETE /api/products/[id]
 * 
 * Deletes a product and invalidates the cache.
 */
export async function DELETE(req: Request, { params }: any) {
  try {
    const { id } = await params;

    // 1. DELETE FROM DATABASE
    const payload = await getPayload({ config: configPromise });
    const deleted = await payload.delete({
      collection: "products",
      id,
    });

    // 2. INVALIDATE CACHE
    // Remove all product-related caches to reflect the deletion immediately.
    await deleteCache(`products:*`);
    console.log(`Cache for product:${id} deleted from Redis`);

    return NextResponse.json({ message: "Product deleted successfully", deleted });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ message: "Failed to delete product", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

/**
 * PATCH /api/products/[id]
 * 
 * Updates a product and invalidates the cache.
 */
export async function PATCH(req: Request, { params }: any) {
  try {
    const { id } = await params;
    const data = await req.json();

    // 1. UPDATE DATABASE
    const payload = await getPayload({ config: configPromise });
    const updated = await payload.update({
      collection: "products",
      id,
      data,
    });

    // 2. INVALIDATE CACHE
    // Clear cache to ensure the updated data is fetched on next request.
    await deleteCache(`products:*`);
    console.log(`Cache for product:${id} and products:* deleted from Redis`);

    return NextResponse.json({ message: "Product updated successfully", updated });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Failed to update product", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

/**
 * GET /api/products/[id]
 * 
 * Retrieves a single product by ID with caching.
 * Strategy: Cache-First (Read-Through)
 */
export async function GET(req: Request, { params }: any) {
  try {
    const { id } = await params;
    
    // Define a unique cache key for this specific product
    const cacheKey = `product:${id}`;
    
    // 1. CHECK REDIS CACHE
    const cachedProduct = await redisClient.get(cacheKey);

    if (cachedProduct) {
      console.log(`Cache hit for product:${id}`);
      return NextResponse.json(JSON.parse(cachedProduct));
    }

    // 2. CACHE MISS: FETCH FROM DATABASE
    const payload = await getPayload({ config: configPromise });
    const product = await payload.findByID({
      collection: "products",
      id,
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 400 });
    }
      
    // 3. SAVE TO REDIS
    // Cache the individual product data for future requests.
    // Note: Consider adding an expiration (TTL) here if data changes frequently, e.g., .setEx(key, 3600, ...)
    await redisClient.set(cacheKey, JSON.stringify(product)); 

    console.log(`Cache miss for product:${id}, fetching from DB`);
      
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Failed to fetch product", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

