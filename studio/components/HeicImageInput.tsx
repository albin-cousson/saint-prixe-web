import {type DragEvent, useCallback, useEffect, useRef, useState} from 'react'
import {Box, Button, Card, Dialog, Flex, Grid, Spinner, Stack, Text, useToast} from '@sanity/ui'
import {set, useClient, type ImageInputProps} from 'sanity'

const HEIC_MIME_TYPES = ['image/heic', 'image/heif']
const HEIC_EXTENSION = /\.hei[cf]$/i
const API_VERSION = '2024-01-01'

function isHeic(file: File) {
  return HEIC_MIME_TYPES.includes(file.type) || HEIC_EXTENSION.test(file.name)
}

async function convertHeicToJpeg(file: File): Promise<File> {
  const heic2any = (await import('heic2any')).default
  const result = await heic2any({blob: file, toType: 'image/jpeg', quality: 0.9})
  const blob = Array.isArray(result) ? result[0] : result
  return new File([blob], file.name.replace(HEIC_EXTENSION, '.jpg'), {type: 'image/jpeg'})
}

type LibraryAsset = {_id: string; url: string; originalFilename?: string}

/** Modal listing every image asset already uploaded to this Sanity dataset, so a field can
 * reuse a photo instead of uploading the same file again. Plain GROQ fetch + `onChange`/`set`
 * (the same primitives the upload flow below already uses) rather than Sanity's internal
 * asset-browser UI, which isn't part of the public plugin API. */
function AssetLibraryDialog({onSelect, onClose}: {onSelect: (assetId: string) => void; onClose: () => void}) {
  const client = useClient({apiVersion: API_VERSION})
  const [assets, setAssets] = useState<LibraryAsset[] | null>(null)

  useEffect(() => {
    let cancelled = false
    client
      .fetch<LibraryAsset[]>(
        `*[_type == "sanity.imageAsset"] | order(_createdAt desc)[0...200]{_id, url, originalFilename}`,
      )
      .then((result) => {
        if (!cancelled) setAssets(result)
      })
    return () => {
      cancelled = true
    }
  }, [client])

  return (
    <Dialog id="asset-library" header="Choisir une photo déjà importée" width={2} onClose={onClose} onClickOutside={onClose}>
      <Box padding={4}>
        {assets === null ? (
          <Flex justify="center" padding={4}>
            <Spinner />
          </Flex>
        ) : assets.length === 0 ? (
          <Text size={1} muted>
            Aucune photo dans la bibliothèque pour l'instant — importez-en une pour la retrouver ici la prochaine fois.
          </Text>
        ) : (
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
        )}
      </Box>
    </Dialog>
  )
}

/** Only the empty-field upload flow goes through this custom dropzone — once a value exists,
 * rendering falls back to Sanity's own image input (crop/hotspot/replace/remove all still
 * work natively). That first upload is exactly the case that matters: no browser can preview
 * a HEIC file (the format iPhones save photos in by default) and Sanity's own pipeline can't
 * process it either, so an unconverted upload used to produce an image the Studio couldn't
 * preview and the site couldn't render. This intercepts the file before it ever reaches
 * Sanity, converts HEIC → JPEG in the browser, and only then uploads it. */
function HeicImageInputImpl(props: ImageInputProps) {
  const {value, onChange, schemaType} = props
  const client = useClient({apiVersion: API_VERSION})
  const toast = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  const upload = useCallback(
    async (file: File | undefined) => {
      if (!file) return
      setBusy(true)
      try {
        const toUpload = isHeic(file) ? await convertHeicToJpeg(file) : file
        const asset = await client.assets.upload('image', toUpload, {filename: toUpload.name})
        onChange(set({_type: schemaType.name, asset: {_type: 'reference', _ref: asset._id}}))
      } catch {
        toast.push({
          status: 'error',
          title: 'Import impossible',
          description: isHeic(file)
            ? `"${file.name}" est une photo au format HEIC (format iPhone) et n'a pas pu être convertie automatiquement. Réessayez, ou exportez la photo en JPEG depuis votre téléphone avant de l'importer.`
            : `"${file.name}" n'a pas pu être importé. Vérifiez le fichier et réessayez.`,
        })
      } finally {
        setBusy(false)
      }
    },
    [client, onChange, schemaType.name, toast],
  )

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setDragging(false)
      upload(event.dataTransfer.files?.[0])
    },
    [upload],
  )

  const selectFromLibrary = useCallback(
    (assetId: string) => {
      onChange(set({_type: schemaType.name, asset: {_type: 'reference', _ref: assetId}}))
      setPickerOpen(false)
    },
    [onChange, schemaType.name],
  )

  if (value?.asset) {
    return props.renderDefault(props)
  }

  return (
    <Card
      padding={4}
      radius={2}
      border
      tone={dragging ? 'primary' : undefined}
      style={{borderStyle: 'dashed'}}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <Stack space={3}>
        <Box style={{textAlign: 'center'}}>
          {busy ? (
            <Spinner />
          ) : (
            <Text size={1} muted>
              Glissez une photo ici (JPEG, PNG, HEIC…) ou
            </Text>
          )}
        </Box>
        <Flex justify="center" gap={2} wrap="wrap">
          <Button
            mode="ghost"
            text="Choisir un fichier"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          />
          <Button
            mode="ghost"
            text="Choisir dans la bibliothèque"
            disabled={busy}
            onClick={() => setPickerOpen(true)}
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.heic,.heif"
            hidden
            onChange={(event) => upload(event.target.files?.[0])}
          />
        </Flex>
      </Stack>
      {pickerOpen && <AssetLibraryDialog onSelect={selectFromLibrary} onClose={() => setPickerOpen(false)} />}
    </Card>
  )
}

// `defineField({type: 'image', components: {input}})` type-checks its `input` against
// @sanity/types' schema-definition-side ObjectInputProps<ImageValue>, which is a different
// (narrower) type than the `ImageInputProps` Studio actually passes to it at runtime — a
// known gap between Sanity's schema-typing and form-runtime type layers. Cast once here
// instead of at every field that uses this component.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HeicImageInput = HeicImageInputImpl as any
