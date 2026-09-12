/** Shared rich-text config for every description-style field (intro texts, "Description"
 * fields, memorial text, FAQ answers): bold/italic/underline plus a "Centré" style for
 * alignment. No headings/lists/links — these are short prose blurbs, not full editorial
 * content, and headings inside them would compete with the page's own title. Centralized so
 * every description field stays in sync instead of drifting field by field (same pattern as
 * galleryField.ts). */
export const descriptionRichTextOf = [
  {
    type: 'block' as const,
    styles: [
      {title: 'Normal', value: 'normal'},
      {title: 'Centré', value: 'center'},
    ],
    lists: [] as {title: string; value: string}[],
    marks: {
      decorators: [
        {title: 'Gras', value: 'strong'},
        {title: 'Italique', value: 'em'},
        {title: 'Souligné', value: 'underline'},
      ],
      annotations: [] as any[],
    },
  },
]

/** Block styles for fields that already held full editorial rich text (headings, lists,
 * links — Sanity's defaults when `styles` is left unspecified) before "Centré" was added:
 * every previous option plus centering, so nothing existing content used is lost. */
export const richTextStylesWithCenter = [
  {title: 'Normal', value: 'normal'},
  {title: 'Titre 1', value: 'h1'},
  {title: 'Titre 2', value: 'h2'},
  {title: 'Titre 3', value: 'h3'},
  {title: 'Titre 4', value: 'h4'},
  {title: 'Citation', value: 'blockquote'},
  {title: 'Centré', value: 'center'},
]
