import {defineField, defineType} from 'sanity'
import {HeicImageInput} from '../components/HeicImageInput'
import {galleryOf} from '../lib/galleryField'
import {isUniqueSlug} from '../lib/isUniqueSlug'
import {requireImageAsset} from '../lib/requireImageAsset'

export default defineType({
  name: 'blogPost',
  title: 'Article (Actualités)',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: "Se remplit automatiquement depuis le titre. En cas de doublon, ajoutez un chiffre à la fin.",
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required().custom(isUniqueSlug('blogPost')),
    }),
    defineField({name: 'publishedAt', title: 'Date de publication', type: 'date'}),
    defineField({
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'image',
      description: 'Cliquez sur la photo pour ajuster le cadrage — l\'aperçu "Carte (4:3)" montre exactement comment elle apparaîtra sur la liste des actualités.',
      options: {hotspot: {previews: [{title: 'Carte (4:3)', aspectRatio: 4 / 3}]}},
      components: {input: HeicImageInput},
      validation: requireImageAsset,
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie (photos et vidéos secondaires)',
      type: 'array',
      of: galleryOf,
    }),
    defineField({name: 'excerpt', title: 'Résumé (liste des articles)', type: 'text'}),
    defineField({
      name: 'body',
      title: 'Contenu',
      type: 'array',
      of: [
        {type: 'block'},
        {type: 'image', options: {hotspot: true}, components: {input: HeicImageInput}, validation: requireImageAsset},
      ],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'publishedAt', media: 'coverImage'},
  },
  orderings: [
    {
      title: 'Date de publication, récent en premier',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})
