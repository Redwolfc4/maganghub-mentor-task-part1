'use client'
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductById } from '@/app/validity/ProductStore';
import { Button } from '@/components/ui/button';

const ProductDetailPage = () => {
    const router = useRouter()
    const { id } = useParams() as { id: string };

    // fetch data by id melalui tanstack yang telah dibuat
    const { data: product, isLoading } = useProductById(id);

    if (isLoading || !product) {
        return <div className="flex min-h-screen w-full items-center justify-center p-4">Loading...</div>;
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-lg border border-gray-200 p-6 shadow-lg">
                <div className="flex flex-col items-center gap-7">
                    <section className="mb-4 max-w-[180px]">
                        <img src={product.image} alt={product.title} className="mb-4 w-full rounded-md" />
                    </section>
                    <section id="product-info" className="w-full">
                        <h2 className="mb-2 text-xl font-bold w-full text-orange-600 text-start">{product.title}</h2>
                        <div className="w-full text-left text-xl font-bold text-green-600 text-wrap">
                            {product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                        </div>
                    </section>

                    <section id="detail-product" className="w-full">
                        <h1 className="text-md font-medium text-gray-300 w-full text-center">--Detail Produk--</h1>
                        <p className="mb-4 text-gray-300 w-full text-justify">{product.description}</p>
                        <div className="mb-2 w-full text-left text-gray-300 flex flex-wrap gap-2">
                            <span className="font-semibold text-gray-200">Color:</span>
                            <div className="flex gap-2 flex-wrap">
                                <span className="px-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-800 hover:text-gray-200 cursor-pointer">
                                    {product.color}
                                </span>
                            </div>
                        </div>
                        <div className="mb-2 w-full text-left text-gray-300 flex flex-wrap gap-2">
                            <label className="font-semibold text-gray-200">Variation:</label>
                            <div className="flex gap-2 flex-wrap">
                                <span className="px-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-800 hover:text-gray-200 cursor-pointer">
                                    {product.varianItem}
                                </span>
                            </div>
                        </div>
                    </section>
                    <section id='action' className='w-full'>
                        <Button className='w-full' variant="outline" size={'default'} onClick={() => router.back()}>Kembali</Button>
                    </section>
                </div>
            </div>
        </div >
    );
};

export default ProductDetailPage;
