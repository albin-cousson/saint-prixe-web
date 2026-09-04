import { useState } from 'react';
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
  description?: string;
  media: MediaItem[]; // pre-resolved Sanity CDN URLs (photos) / file URLs (videos)
  reserveLabel?: string;
}

export default function PuppyCarousel({ title, gender, color, birthDate, status, description, media, reserveLabel }: Props) {
  const [index, setIndex] = useState(0);
  const ok = isAvailable(status);
  const safeMedia = media.length ? media : [{ type: 'image' as const, url: '' }];
  const current = Math.min(index, safeMedia.length - 1);
  const currentItem = safeMedia[current];

  const step = (delta: number) => {
    setIndex((i) => (i + delta + safeMedia.length) % safeMedia.length);
  };

  const meta = [gender, color, birthDate && `Né(e) le ${formatDateFr(birthDate)}`].filter(Boolean).join(' · ');

  return (
    <div className={ok ? 'text-center' : 'text-center opacity-100'}>
      <div className="relative overflow-hidden bg-placeholder aspect-[4/5]">
        {currentItem.url && currentItem.type === 'video' ? (
          <video
            src={currentItem.url}
            controls
            preload="metadata"
            className={`w-full h-full object-contain bg-ink ${!ok ? 'grayscale opacity-65' : ''}`}
          />
        ) : (
          currentItem.url && (
            <img
              src={currentItem.url}
              alt={title}
              loading="lazy"
              data-lightbox={currentItem.url}
              className={`w-full h-full object-cover cursor-pointer ${!ok ? 'grayscale opacity-65' : ''}`}
            />
          )
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

        <div className="absolute inset-x-0 bottom-0 pt-8 pb-3 px-2.5 bg-gradient-to-t from-[rgba(30,22,14,0.82)] to-transparent pointer-events-none">
          <span className="font-display font-bold text-white text-base">{title}</span>
          {!ok && (
            <span className="block mt-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-white/85">
              {status || 'Plus disponible'}
            </span>
          )}
        </div>
      </div>
      {meta && <p className="text-xs text-muted-2 mt-2.5">{meta}</p>}
      {description && <p className="text-xs text-muted mt-1.5 leading-relaxed">{description}</p>}
      {ok && (
        <a
          href={`/contact?sujet=${encodeURIComponent(`ce chiot : ${title}`)}`}
          className="inline-block bg-gold hover:brightness-95 text-ink font-semibold text-xs px-4 py-2 mt-3 transition"
        >
          {reserveLabel || 'Réserver ce chiot'} ›
        </a>
      )}
    </div>
  );
}
