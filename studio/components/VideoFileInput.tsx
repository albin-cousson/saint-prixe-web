import {type DragEvent, useCallback, useRef, useState} from 'react'
import {Box, Button, Card, Flex, Spinner, Stack, Text} from '@sanity/ui'
import {set, useClient, type FileInputProps} from 'sanity'
import {API_VERSION, AssetLibraryDialog} from './AssetLibraryDialog'

/** Video counterpart of HeicImageInput: same empty-state dropzone (drop / pick a file /
 * pick from the library), then Sanity's own file input takes over once a value exists.
 * No format conversion needed here — it exists so videos get the same "Choisir dans la
 * bibliothèque" flow as photos instead of Sanity's default, less discoverable, browse menu. */
function VideoFileInputImpl(props: FileInputProps) {
  const {value, onChange, schemaType} = props
  const client = useClient({apiVersion: API_VERSION})
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  const setAsset = useCallback(
    (assetId: string) =>
      onChange(set({_type: schemaType.name, asset: {_type: 'reference', _ref: assetId}})),
    [onChange, schemaType.name],
  )

  const upload = useCallback(
    async (file: File | undefined) => {
      if (!file) return
      setBusy(true)
      try {
        const asset = await client.assets.upload('file', file, {filename: file.name})
        setAsset(asset._id)
      } finally {
        setBusy(false)
      }
    },
    [client, setAsset],
  )

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setDragging(false)
      upload(event.dataTransfer.files?.[0])
    },
    [upload],
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
              Glissez une vidéo ici ou
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
            accept="video/*"
            hidden
            onChange={(event) => upload(event.target.files?.[0])}
          />
        </Flex>
      </Stack>
      {pickerOpen && (
        <AssetLibraryDialog
          kind="video"
          onSelect={(assetId) => {
            setAsset(assetId)
            setPickerOpen(false)
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </Card>
  )
}

// Same cast as HeicImageInput's export (see the comment there).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VideoFileInput = VideoFileInputImpl as any
