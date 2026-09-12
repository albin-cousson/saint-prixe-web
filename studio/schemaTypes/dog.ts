import {defineField, defineType} from 'sanity'
import {HeicImageInput} from '../components/HeicImageInput'
import {TitlesInput} from '../components/TitlesInput'
import {galleryOf} from '../lib/galleryField'
import {isUniqueSlug} from '../lib/isUniqueSlug'
import {requireFileAsset} from '../lib/requireFileAsset'
import {requireImageAsset} from '../lib/requireImageAsset'
import {descriptionRichTextOf} from '../lib/richText'

export default defineType({
  name: 'dog',
  title: 'Chien (Nos Chiens / Mâles / Femelles)',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Nom', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: "Se remplit automatiquement depuis le nom. En cas de doublon, ajoutez un chiffre à la fin.",
      type: 'slug',
      options: {source: 'name'},
      validation: (Rule) => Rule.required().custom(isUniqueSlug('dog')),
    }),
    defineField({
      name: 'sex',
      title: 'Sexe',
      type: 'string',
      options: {list: ['Mâle', 'Femelle']},
      description: 'Laisser vide si non confirmé plutôt que de deviner.',
    }),
    defineField({name: 'birthDate', title: 'Date de naissance', type: 'date'}),
    defineField({name: 'deathDate', title: 'Date de décès', type: 'date', description: 'Laisser vide si le chien est toujours parmi nous.'}),
    defineField({
      name: 'memorialText',
      title: 'Texte en hommage',
      type: 'array',
      of: descriptionRichTextOf,
      description: "Affiché uniquement si une date de décès est renseignée — un hommage sur la fiche du chien, pour ne jamais l'oublier.",
      hidden: ({document}) => !document?.deathDate,
    }),
    defineField({
      name: 'photo',
      title: 'Photo principale',
      type: 'image',
      description: 'Cliquez sur la photo pour ajuster le cadrage — l\'aperçu "Carte (4:3)" montre exactement comment elle apparaîtra sur Nos Chiens / Nos Mâles / Nos Femelles.',
      options: {hotspot: {previews: [{title: 'Carte (4:3)', aspectRatio: 4 / 3}]}},
      components: {input: HeicImageInput},
      validation: requireImageAsset,
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie (photos et vidéos)',
      type: 'array',
      of: galleryOf,
    }),
    defineField({name: 'sire', title: 'Père', type: 'string'}),
    defineField({name: 'dam', title: 'Mère', type: 'string'}),
    defineField({
      name: 'titles',
      title: 'Palmarès',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Collez ou tapez tous les titres d\'un coup, un par ligne — pas besoin d\'ajouter chaque ligne une par une.',
      components: {input: TitlesInput},
    }),
    defineField({
      name: 'pedigreeFile',
      title: 'Document pedigree (PDF ou image)',
      type: 'file',
      description: 'Facultatif — si présent, un bouton de téléchargement apparaît sur la fiche du chien. PDF ou image (JPEG, PNG…) acceptés.',
      options: {accept: 'application/pdf,image/*'},
      validation: requireFileAsset({label: 'PDF ou image', anyOf: [{mimeType: 'application/pdf'}, {mimePrefix: 'image/'}]}),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'sex', media: 'photo'},
  },
})
