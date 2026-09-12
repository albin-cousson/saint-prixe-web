import {defineField, defineType} from 'sanity'
import {descriptionRichTextOf} from '../lib/richText'

export default defineType({
  name: 'faqPage',
  title: 'Page FAQ',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string'}),
    defineField({name: 'intro', title: "Texte d'introduction", type: 'array', of: descriptionRichTextOf}),
    defineField({
      name: 'questions',
      title: 'Questions fréquentes',
      description:
        "Laisser vide pour utiliser les questions par défaut du site. Une fois une question ajoutée ici, elle remplace entièrement la liste par défaut — pensez à toutes les reprendre.",
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'Question',
          fields: [
            {name: 'question', title: 'Question', type: 'string', validation: (Rule: any) => Rule.required()},
            {
              name: 'answer',
              title: 'Réponse',
              type: 'array',
              of: descriptionRichTextOf,
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {select: {title: 'question'}},
        },
      ],
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
    prepare: () => ({title: 'Page FAQ'}),
  },
})
