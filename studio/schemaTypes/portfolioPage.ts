import {defineField, defineType} from 'sanity'
import {galleryOf} from '../lib/galleryField'

export default defineType({
  name: 'portfolioPage',
  title: 'Page Portfolio',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string'}),
    defineField({name: 'intro', title: "Texte d'introduction", type: 'text'}),
    defineField({
      name: 'images',
      title: 'Galerie (photos et vidéos)',
      type: 'array',
      of: galleryOf,
    }),
  ],
  preview: {
    prepare: () => ({title: 'Page Portfolio'}),
  },
})
