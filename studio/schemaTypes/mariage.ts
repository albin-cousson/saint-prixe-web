import {defineField, defineType} from 'sanity'
import {HeicImageInput} from '../components/HeicImageInput'
import {galleryOf} from '../lib/galleryField'
import {isUniqueSlug} from '../lib/isUniqueSlug'
import {requireImageAsset} from '../lib/requireImageAsset'
import {descriptionRichTextOf} from '../lib/richText'

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
      name: 'litterSold',
      title: 'Portée entièrement placée',
      description:
        'À cocher quand tous les chiots ont rejoint leur famille. Sur le site, les fiches chiots (statuts, bouton Réserver) laissent place à un album photo de la portée, et la carte de la page Nos Portées affiche un aperçu de cet album.',
      type: 'boolean',
      initialValue: false,
      options: {layout: 'checkbox'},
    }),
    defineField({
      name: 'gallery',
      title: 'Album de la portée (photos et vidéos)',
      description:
        "Affiché sur le site uniquement quand la case « Portée entièrement placée » est cochée. Les photos de chaque chiot lié à ce mariage y sont ajoutées automatiquement : n'ajoutez ici que des photos ou vidéos supplémentaires.",
      type: 'array',
      of: galleryOf,
    }),
    defineField({name: 'description', title: 'Description', type: 'array', of: descriptionRichTextOf}),
  ],
  preview: {
    select: {title: 'title', media: 'dogGroomPhoto', litterSold: 'litterSold'},
    prepare: ({title, media, litterSold}) => ({
      title,
      media,
      subtitle: litterSold ? 'Portée entièrement placée' : undefined,
    }),
  },
})
