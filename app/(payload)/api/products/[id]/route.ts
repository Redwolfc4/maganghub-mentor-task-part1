import { getPayload } from "payload";
import configPromise from "@payload-config";
import { deleteCache } from "@/lib/cacheHandler";
import redisClient from "@/lib/redis";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: any) {
  try {
    const { id } = await params;

    // 1. HAPUS DATA DI DATABASE
    const payload = await getPayload({ config: configPromise });
    const deleted = await payload.delete({
      collection: "products",
      id,
    });

    // 2. HAPUS CACHE DI REDIS
    await deleteCache(`products:*`);
    console.log(`Cache for product:${id} deleted from Redis`);

    return NextResponse.json({ message: "Product deleted successfully", deleted });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ message: "Failed to delete product", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: any) {
  try {
    const { id } = await params;
    const data = await req.json();

    console.log('jalan');

    // 1. UPDATE DATA DI DATABASE
    const payload = await getPayload({ config: configPromise });
    const updated = await payload.update({
      collection: "products",
      id,
      data,
    });

    // 2. HAPUS CACHE DI REDIS
    await deleteCache(`products:*`);
    console.log(`Cache for product:${id} and products:* deleted from Redis`);

    return NextResponse.json({ message: "Product updated successfully", updated });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Failed to update product", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: any) {
  try {
    const { id } = await params;
    
    const cacheKey = `product:${id}`;
    const cachedProduct = await redisClient.get(cacheKey);

    if (cachedProduct) {
      console.log(`Cache hit for product:${id}`);
      return NextResponse.json(JSON.parse(cachedProduct));
    }
    // 1. AMBIL DATA DARI DATABASE
    const payload = await getPayload({ config: configPromise });
    const product = await payload.findByID({
      collection: "products",
      id,
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 400 });
    }
      
    // 2. SIMPAN DATA DI REDIS
    await redisClient.set(cacheKey, JSON.stringify(product)); 

    console.log(`Cache miss for product:${id}, fetching from DB`);
      
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Failed to fetch product", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

