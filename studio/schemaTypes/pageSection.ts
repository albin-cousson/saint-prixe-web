import {defineField, defineType} from 'sanity'
import {richTextStylesWithCenter} from '../lib/richText'

/** Reusable flexible content block used by the simpler pages (About, Contact, Portfolio, Inquiry). */
export default defineType({
  name: 'pageSection',
  title: 'Section',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Titre', type: 'string'}),
    defineField({
      name: 'body',
      title: 'Contenu',
      type: 'array',
      of: [{type: 'block', styles: richTextStylesWithCenter}],
    }),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'ctaLabel', title: 'Texte du bouton "en savoir plus"', type: 'string'}),
    defineField({name: 'ctaHref', title: 'Lien du bouton "en savoir plus"', type: 'string'}),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
  },
})
