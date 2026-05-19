import "server-only"

import { renderMarkdown } from "@/lib/markdown/render"
import type { MarkdownEmojiItem } from "@/lib/markdown-emoji"
import { omitPostListPreviewMediaFromMarkdown, type PostListPreviewMedia } from "@/lib/post-list-media"

const PREVIEW_CONTENT_CACHE_MAX_ENTRIES = 500

interface PreviewContentResult {
  markdown: string
  html: string
}

const previewContentCache = new Map<string, PreviewContentResult>()

function buildPreviewContentCacheKey(input: {
  contentMarkdown: string
  previewMedia?: PostListPreviewMedia | null
  markdownEmojiMap: MarkdownEmojiItem[]
}) {
  return JSON.stringify({
    content: input.contentMarkdown,
    media: input.previewMedia ? `${input.previewMedia.type}:${input.previewMedia.src}` : "",
    emoji: input.markdownEmojiMap.map((item) => [item.shortcode, item.icon, item.label]),
  })
}

function rememberPreviewContent(key: string, value: PreviewContentResult) {
  if (previewContentCache.has(key)) {
    previewContentCache.delete(key)
  }

  previewContentCache.set(key, value)

  if (previewContentCache.size <= PREVIEW_CONTENT_CACHE_MAX_ENTRIES) {
    return
  }

  const oldestKey = previewContentCache.keys().next().value
  if (oldestKey) {
    previewContentCache.delete(oldestKey)
  }
}

export function buildPostListPreviewContent(input: {
  contentMarkdown: string
  previewMedia?: PostListPreviewMedia | null
  markdownEmojiMap: MarkdownEmojiItem[]
}): PreviewContentResult {
  const key = buildPreviewContentCacheKey(input)
  const cached = previewContentCache.get(key)
  if (cached) {
    previewContentCache.delete(key)
    previewContentCache.set(key, cached)
    return cached
  }

  const markdown = omitPostListPreviewMediaFromMarkdown(input.contentMarkdown, input.previewMedia)
  const result = {
    markdown,
    html: markdown ? renderMarkdown(markdown, input.markdownEmojiMap) : "",
  }

  rememberPreviewContent(key, result)
  return result
}
