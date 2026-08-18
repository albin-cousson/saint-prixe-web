import type {Rule} from 'sanity'

// Sanity image asset IDs are formatted "image-<hash>-<width>x<height>-<format>" — the
// trailing format segment reliably reflects the uploaded file, so this is enough to catch a
// HEIC/HEIF asset without an extra network round-trip.
const HEIC_ASSET_ID = /-hei[cf]$/i

/** Blocks publish on: (1) an image item that was added but never got a file uploaded (shows
 * up as an empty "Untitled" entry — the bug that used to crash the Netlify build), and (2) a
 * HEIC/HEIF photo that reached Sanity unconverted (no browser can display HEIC and Sanity's
 * pipeline can't process it either) — belt-and-suspenders for HeicImageInput, which converts
 * HEIC on upload but only intercepts the first upload into an empty field; this catches any
 * HEIC that slips in another way (e.g. replacing an existing photo). Used on every image
 * field, single or in a gallery array, so editors get a clear French error instead of a
 * silently broken image on the live site. */
function requireImageAssetImpl(Rule: Rule) {
  return Rule.custom((value: {asset?: {_ref?: string}} | undefined) => {
    if (!value) return true
    if (!value.asset?._ref) {
      return 'Cet emplacement est vide — ajoutez une image ou supprimez cet élément avant de publier.'
    }
    if (HEIC_ASSET_ID.test(value.asset._ref)) {
      return 'Cette photo est au format HEIC (format iPhone) et ne s\'affichera pas sur le site — remplacez-la (le champ accepte maintenant le HEIC et le convertit automatiquement si vous réimportez le fichier original).'
    }
    return true
  })
}

// Cast for the same reason as HeicImageInput's export cast (see that file): the `validation`
// slot on an image field definition is typed against @sanity/types' ImageRule, a narrower
// sibling of the generic `Rule` type this validator is written against.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const requireImageAsset = requireImageAssetImpl as any
