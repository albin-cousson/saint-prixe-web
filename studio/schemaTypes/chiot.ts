import {defineField, defineType} from 'sanity'
import {HeicImageInput} from '../components/HeicImageInput'
import {galleryOf} from '../lib/galleryField'
import {requireImageAsset} from '../lib/requireImageAsset'

export default defineType({
  name: 'chiot',
  title: 'Chiot',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Prénom', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'mariage',
      title: 'Mariage (parents)',
      type: 'reference',
      to: [{type: 'mariage'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gender',
      title: 'Sexe',
      type: 'string',
      options: {list: ['Mâle', 'Femelle']},
    }),
    defineField({name: 'color', title: 'Robe / couleur', type: 'string'}),
    defineField({name: 'birthDate', title: 'Date de naissance', type: 'date'}),
    defineField({
      name: 'photo',
      title: 'Photo principale',
      type: 'image',
      options: {hotspot: true},
      components: {input: HeicImageInput},
      validation: requireImageAsset,
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie (photos et vidéos)',
      type: 'array',
      of: galleryOf,
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {list: ['Disponible', 'Réservé', 'Vendu']},
      initialValue: 'Disponible',
    }),
    defineField({name: 'description', title: 'Description', type: 'text'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'status', media: 'photo'},
  },
})
