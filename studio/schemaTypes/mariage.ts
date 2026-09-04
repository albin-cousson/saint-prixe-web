import {defineField, defineType} from 'sanity'
import {HeicImageInput} from '../components/HeicImageInput'
import {galleryOf} from '../lib/galleryField'
import {isUniqueSlug} from '../lib/isUniqueSlug'
import {requireImageAsset} from '../lib/requireImageAsset'

export default defineType({
  name: 'mariage',
  title: 'Mariage',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre (ex: Romy & Maverick)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: "Se remplit automatiquement depuis le titre. En cas de doublon, ajoutez un chiffre à la fin.",
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required().custom(isUniqueSlug('mariage')),
    }),
    defineField({name: 'dogGroomName', title: 'Nom du mâle', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'dogGroomPhoto',
      title: 'Photo du mâle',
      type: 'image',
      options: {hotspot: true},
      components: {input: HeicImageInput},
      validation: requireImageAsset,
    }),
    defineField({name: 'dogBrideName', title: 'Nom de la femelle', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'dogBridePhoto',
      title: 'Photo de la femelle',
      type: 'image',
      options: {hotspot: true},
      components: {input: HeicImageInput},
      validation: requireImageAsset,
    }),
    defineField({name: 'litterDate', title: 'Date de naissance des chiots', type: 'date'}),
    defineField({
      name: 'gallery',
      title: 'Galerie (photos et vidéos)',
      type: 'array',
      of: galleryOf,
    }),
    defineField({name: 'description', title: 'Description', type: 'text'}),
  ],
  preview: {
    select: {title: 'title', media: 'dogGroomPhoto'},
  },
})
