import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'Page À propos',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string'}),
    defineField({
      name: 'intro',
      title: "Texte d'introduction",
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({name: 'sections', title: 'Sections', type: 'array', of: [{type: 'pageSection'}]}),
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
    prepare: () => ({title: 'Page À propos'}),
  },
})
