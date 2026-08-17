import { ProjectForm } from '@/components/admin/projects/form/project-form';

interface EditProjectPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  return <ProjectForm projectId={id} />;
}
