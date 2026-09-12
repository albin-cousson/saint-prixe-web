import { useState } from 'react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { isAvailable, formatDateFr } from '../../lib/status';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface Props {
  title: string;
  gender?: string;
  color?: string;
  birthDate?: string;
  status?: string;
  description?: any[]; // Portable Text blocks (see studio/lib/richText.ts)
  media: MediaItem[]; // pre-resolved Sanity CDN URLs (photos) / file URLs (videos)
  reserveLabel?: string;
}

// Bold/italic/underline are handled by @portabletext/react's own defaults — only the custom
// "Centré" style (see studio/lib/richText.ts) needs a renderer here.
const descriptionComponents: PortableTextComponents = {
  block: {
    center: ({ children }) => <p style={{ textAlign: 'center' }}>{children}</p>,
  },
};

export default function PuppyCarousel({ title, gender, color, birthDate, status, description, media, reserveLabel }: Props) {
  const [index, setIndex] = useState(0);
  const ok = isAvailable(status);
  const safeMedia = media.length ? media : [{ type: 'image' as const, url: '' }];
  const current = Math.min(index, safeMedia.length - 1);

  const step = (delta: number) => {
    setIndex((i) => (i + delta + safeMedia.length) % safeMedia.length);
  };

  const meta = [gender, color, birthDate && `Né(e) le ${formatDateFr(birthDate)}`].filter(Boolean).join(' · ');

  return (
    <div className="text-center">
      <div className="relative overflow-hidden bg-placeholder aspect-[4/5]">
        {/* All slides sit side by side in a track that slides to the current index, so arrow
            clicks animate instead of swapping the image instantly. */}
        <div
          className="flex h-full transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {safeMedia.map((item, i) => (
            <div key={i} className="w-full h-full shrink-0">
              {item.url && item.type === 'video' ? (
                <video
                  src={item.url}
                  controls
                  preload="metadata"
                  className={`w-full h-full object-contain bg-ink ${!ok ? 'grayscale opacity-65' : ''}`}
                />
              ) : (
                item.url && (
                  <img
                    src={item.url}
                    alt={title}
                    loading="lazy"
                    data-lightbox={item.url}
                    className={`w-full h-full object-cover cursor-pointer ${!ok ? 'grayscale opacity-65' : ''}`}
                  />
                )
              )}
            </div>
          ))}
        </div>

        {!ok && (
          <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none" aria-hidden="true">
            <span className="absolute top-7 -right-9 w-44 rotate-45 bg-ink text-gold text-[11px] font-bold uppercase tracking-[0.25em] text-center py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
              {status || 'Plus dispo'}
            </span>
          </div>
        )}

        {safeMedia.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={`Photo précédente de ${title}`}
              className="absolute top-1/2 left-2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center text-lg opacity-85 hover:opacity-100 transition"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={`Photo suivante de ${title}`}
              className="absolute top-1/2 right-2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center text-lg opacity-85 hover:opacity-100 transition"
            >
              ›
            </button>
            {ok && (
              <div className="absolute top-2 inset-x-0 flex justify-center gap-1.5">
                {safeMedia.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${i === current ? 'bg-white' : 'bg-white/55'}`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 pt-10 pb-3.5 px-3 bg-gradient-to-t from-[rgba(30,22,14,0.82)] to-transparent pointer-events-none">
          <span className="font-display font-bold text-white text-xl md:text-2xl">{title}</span>
        </div>
      </div>
      {meta && <p className="text-sm text-muted-2 mt-3">{meta}</p>}
      {description && description.length > 0 && (
        <div className="text-sm text-muted mt-2 leading-relaxed">
          <PortableText value={description} components={descriptionComponents} />
        </div>
      )}
      {ok && (
        <a
          href={`/contact?sujet=${encodeURIComponent(`ce chiot : ${title}`)}`}
          className="inline-block bg-gold hover:brightness-95 text-ink font-semibold text-sm px-6 py-2.5 mt-4 transition"
        >
          {reserveLabel || 'Réserver ce chiot'} ›
        </a>
      )}
    </div>
  );
}
