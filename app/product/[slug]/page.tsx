import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProduct, products } from '@/lib/products';
import ProductPageClient from '@/components/product/ProductPageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: 'MONO®' };
  return {
    title: `${product.name} — MONO®`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return <ProductPageClient product={product} />;
}
