import type {Rule} from 'sanity'

interface MimeRule {
  /** Exact expected mimeType (e.g. 'application/pdf'). */
  mimeType?: string
  /** Mime prefix to require instead of an exact match (e.g. 'video/', 'image/'). */
  mimePrefix?: string
}

interface RequireFileAssetOptions extends MimeRule {
  /** Human label used in the French error messages, e.g. 'PDF', 'vidéo', 'PDF ou image'. */
  label: string
  /** Accept any one of several rules (e.g. PDF *or* any image) instead of a single mimeType/mimePrefix. */
  anyOf?: MimeRule[]
}

/** Generalizes requireImageAsset to any `file` field: blocks publish on an empty "Untitled"
 * slot (added but never uploaded — same bug as the image galleries), and, when `mimeType`/
 * `mimePrefix`/`anyOf` is given, also rejects a real file whose format doesn't match (e.g. a
 * renamed .docx dropped into the pedigree field) by checking the uploaded asset's mimeType.
 * Used by the pedigree field and by the video item in gallery arrays. */
export function requireFileAsset({label, mimeType, mimePrefix, anyOf}: RequireFileAssetOptions) {
  const rules: MimeRule[] = anyOf ?? (mimeType || mimePrefix ? [{mimeType, mimePrefix}] : [])

  // Cast for the same reason as HeicImageInput's export cast (see that file): the
  // `validation` slot on a field definition is typed against @sanity/types' narrower
  // FileRule/ImageRule, a sibling of the generic `Rule` type this validator is written
  // against, so a plain `(Rule) => Rule` function doesn't structurally match every call site.
  return ((Rule: Rule) =>
    Rule.custom(async (value: {asset?: {_ref?: string}} | undefined, context) => {
      if (!value) return true
      if (!value.asset?._ref) {
        return `Cet emplacement est vide — ajoutez un fichier ${label} ou supprimez cet élément avant de publier.`
      }
      if (rules.length === 0) return true

      const {getClient} = context
      const client = getClient({apiVersion: '2024-01-01'})
      const asset = await client.fetch<{mimeType?: string; originalFilename?: string} | null>(
        '*[_id == $id][0]{mimeType, originalFilename}',
        {id: value.asset._ref},
      )
      if (!asset) {
        return `Le fichier associé est introuvable — supprimez cet élément et réimportez-le.`
      }
      const actualMime = asset.mimeType || ''
      const matches = rules.some((rule) =>
        rule.mimeType ? actualMime === rule.mimeType : actualMime.startsWith(rule.mimePrefix as string),
      )
      if (!matches) {
        return `Seuls les fichiers ${label} sont acceptés ici (fichier détecté : ${asset.originalFilename || actualMime || 'format inconnu'}).`
      }
      return true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any
}
