import {HeicImageInput} from '../components/HeicImageInput'
import {VideoFileInput} from '../components/VideoFileInput'
import {requireFileAsset} from './requireFileAsset'
import {requireImageAsset} from './requireImageAsset'

/** Standard `of` for every gallery array (dog, chiot, mariage, blogPost, portfolioPage):
 * photos — with hotspot cropping, HEIC-safe upload (see HeicImageInput), and a guard
 * against empty "Untitled" slots — plus an optional video item guarded the same way.
 * Centralized so all galleries stay in sync instead of drifting field by field. */
export const galleryOf = [
  {
    type: 'image' as const,
    title: 'Photo',
    options: {hotspot: true},
    components: {input: HeicImageInput},
    validation: requireImageAsset,
    fields: [
      {
        name: 'alt',
        title: 'Texte alternatif (accessibilité + référencement)',
        type: 'string',
        description:
          'Optionnel — décrit la photo pour les lecteurs d\'écran et Google Images (ex. "Chiot Bearded Collie mâle, 8 semaines"). Laissé vide, un texte par défaut est utilisé.',
      },
    ],
  },
  {
    type: 'file' as const,
    title: 'Vidéo',
    options: {accept: 'video/*'},
    components: {input: VideoFileInput},
    validation: requireFileAsset({label: 'vidéo', mimePrefix: 'video/'}),
  },
]
