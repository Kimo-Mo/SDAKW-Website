import { ProductForm } from '@/components/admin/products/form/product-form';

interface EditProductPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  return <ProductForm projectId={id} />;
}
