import {useEffect, useState} from 'react'
import {Box, Card, Dialog, Flex, Grid, Spinner, Stack, Text} from '@sanity/ui'
import {useClient} from 'sanity'

export const API_VERSION = '2024-01-01'

export type LibraryKind = 'image' | 'video'

type LibraryAsset = {_id: string; url: string; originalFilename?: string; size?: number}

const QUERIES: Record<LibraryKind, string> = {
  image: `*[_type == "sanity.imageAsset"] | order(_createdAt desc)[0...200]{_id, url, originalFilename}`,
  video: `*[_type == "sanity.fileAsset" && string::startsWith(mimeType, "video/")] | order(_createdAt desc)[0...200]{_id, url, originalFilename, size}`,
}

const LABELS: Record<LibraryKind, {header: string; empty: string}> = {
  image: {
    header: 'Choisir une photo déjà importée',
    empty:
      "Aucune photo dans la bibliothèque pour l'instant — importez-en une pour la retrouver ici la prochaine fois.",
  },
  video: {
    header: 'Choisir une vidéo déjà importée',
    empty:
      "Aucune vidéo dans la bibliothèque pour l'instant — importez-en une pour la retrouver ici la prochaine fois.",
  },
}

function formatSize(bytes?: number) {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1)} Mo` : `${Math.round(bytes / 1024)} Ko`
}

/** Modal listing every asset of one kind already uploaded to this Sanity dataset, so a field
 * can reuse a photo/video instead of uploading the same file again. Plain GROQ fetch +
 * `onSelect(assetId)` (the caller does the `onChange`/`set`) rather than Sanity's internal
 * asset-browser UI, which isn't part of the public plugin API. Shared by HeicImageInput
 * (photos, as a thumbnail grid) and VideoFileInput (videos, as a list — no thumbnails to show). */
export function AssetLibraryDialog({
  kind,
  onSelect,
  onClose,
}: {
  kind: LibraryKind
  onSelect: (assetId: string) => void
  onClose: () => void
}) {
  const client = useClient({apiVersion: API_VERSION})
  const [assets, setAssets] = useState<LibraryAsset[] | null>(null)

  useEffect(() => {
    let cancelled = false
    client.fetch<LibraryAsset[]>(QUERIES[kind]).then((result) => {
      if (!cancelled) setAssets(result)
    })
    return () => {
      cancelled = true
    }
  }, [client, kind])

  const labels = LABELS[kind]

  return (
    <Dialog
      id={`asset-library-${kind}`}
      header={labels.header}
      width={2}
      onClose={onClose}
      onClickOutside={onClose}
    >
      <Box padding={4}>
        {assets === null ? (
          <Flex justify="center" padding={4}>
            <Spinner />
          </Flex>
        ) : assets.length === 0 ? (
          <Text size={1} muted>
            {labels.empty}
          </Text>
        ) : kind === 'image' ? (
          <Grid columns={[2, 3, 4]} gap={2}>
            {assets.map((asset) => (
              <button
                key={asset._id}
                type="button"
                onClick={() => onSelect(asset._id)}
                title={asset.originalFilename}
                style={{
                  aspectRatio: '1',
                  padding: 0,
                  border: '1px solid var(--card-border-color)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'none',
                }}
              >
                <img
                  src={`${asset.url}?w=200&h=200&fit=crop`}
                  alt={asset.originalFilename || ''}
                  style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                />
              </button>
            ))}
          </Grid>
        ) : (
          <Stack space={2}>
            {assets.map((asset) => (
              <Card
                key={asset._id}
                as="button"
                padding={3}
                radius={2}
                border
                onClick={() => onSelect(asset._id)}
              >
                <Flex align="center" gap={3}>
                  <Text size={2}>🎬</Text>
                  <Box flex={1}>
                    <Text size={1} textOverflow="ellipsis">
                      {asset.originalFilename || asset._id}
                    </Text>
                  </Box>
                  <Text size={1} muted>
                    {formatSize(asset.size)}
                  </Text>
                </Flex>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Dialog>
  )
}
