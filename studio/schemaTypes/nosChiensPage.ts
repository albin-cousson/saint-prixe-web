import {defineField, defineType} from 'sanity'
import {descriptionRichTextOf} from '../lib/richText'

export default defineType({
  name: 'nosChiensPage',
  title: 'Page Nos Chiens',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string'}),
    defineField({name: 'intro', title: "Texte d'introduction", type: 'array', of: descriptionRichTextOf}),
    defineField({
      name: 'malesCtaLabel',
      title: 'Texte du bouton "Tous les découvrir" (section Nos Mâles)',
      description: 'Optionnel — par défaut : "Tous les découvrir".',
      type: 'string',
    }),
    defineField({
      name: 'femellesCtaLabel',
      title: 'Texte du bouton "Toutes les découvrir" (section Nos Femelles)',
      description: 'Optionnel — par défaut : "Toutes les découvrir".',
      type: 'string',
    }),
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO (balise <title> / Google)',
      description:
        "Optionnel — remplace le titre affiché dans l'onglet du navigateur et les résultats Google. Laisser vide pour utiliser le titre par défaut.",
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description SEO (Google)',
      description:
        "Optionnel — le résumé affiché sous le titre dans les résultats Google (150-160 caractères recommandés). Laisser vide pour utiliser la description par défaut.",
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    prepare: () => ({title: 'Page Nos Chiens'}),
  },
})
