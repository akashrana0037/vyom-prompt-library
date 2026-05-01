import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import promptsData from '@/data/prompts.json';
import PromptModalContent from '@/components/PromptModalContent';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return promptsData.map((p) => ({
    id: p.id.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const prompt = promptsData.find((p) => p.id.toString() === id);

  if (!prompt) return { title: 'Prompt Not Found' };

  return {
    title: `${prompt.title} | Vyom Prompt Studio`,
    description: prompt.description,
    openGraph: {
      title: prompt.title,
      description: prompt.description,
      images: prompt.images.map((img) => ({ url: img })),
    },
    twitter: {
      card: 'summary_large_image',
      title: prompt.title,
      description: prompt.description,
      images: [prompt.images[0]],
    },
  };
}

export default async function PromptPage({ params }: PageProps) {
  const { id } = await params;
  const prompt = promptsData.find((p) => p.id.toString() === id);

  if (!prompt) notFound();

  return (
    <div className="min-h-screen bg-black">
      {/* We reuse the modal content but styled as a full page */}
      <PromptModalContent prompt={prompt} isFullPage={true} />
    </div>
  );
}
