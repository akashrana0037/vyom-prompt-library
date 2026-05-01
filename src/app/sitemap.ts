import { MetadataRoute } from 'next'
import promptsData from '@/data/prompts.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://prompt-studio.vyom.ai'

  // Main page
  const mainPage = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }

  // Categories
  const categories = Array.from(new Set(promptsData.map((p) => p.category)))
  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/?category=${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Individual Prompts
  const promptPages = promptsData.map((p) => ({
    url: `${baseUrl}/prompt/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [mainPage, ...categoryPages, ...promptPages]
}

