import {type DragEvent, useCallback, useRef, useState} from 'react'
import {Box, Button, Card, Flex, Spinner, Stack, Text, useToast} from '@sanity/ui'
import {set, useClient, type ImageInputProps} from 'sanity'
import {API_VERSION, AssetLibraryDialog} from './AssetLibraryDialog'

const HEIC_MIME_TYPES = ['image/heic', 'image/heif']
const HEIC_EXTENSION = /\.hei[cf]$/i

function isHeic(file: File) {
  return HEIC_MIME_TYPES.includes(file.type) || HEIC_EXTENSION.test(file.name)
}

async function convertHeicToJpeg(file: File): Promise<File> {
  const heic2any = (await import('heic2any')).default
  const result = await heic2any({blob: file, toType: 'image/jpeg', quality: 0.9})
  const blob = Array.isArray(result) ? result[0] : result
  return new File([blob], file.name.replace(HEIC_EXTENSION, '.jpg'), {type: 'image/jpeg'})
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
      {pickerOpen && (
        <AssetLibraryDialog
          kind="image"
          onSelect={selectFromLibrary}
          onClose={() => setPickerOpen(false)}
        />
      )}
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
