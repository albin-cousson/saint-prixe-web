/** Helpers for the "sold litter" album (mariage.litterSold in Studio): once every puppy has
 * found a family, the per-puppy cards give way to one shuffled gallery of the litter. */

interface PuppyLike {
  title?: string;
  photo?: any;
  gallery?: any[];
}
interface MariageLike {
  gallery?: any[];
  puppies?: PuppyLike[];
}

/** The album's content: the mariage's own gallery (extra photos/videos the breeder adds by
 * hand) plus every linked puppy's main photo + gallery, picked up automatically. Videos are
 * kept only when the query resolved their asset URL (MARIAGE_BY_SLUG_QUERY does, the listing
 * query doesn't). */
export function collectLitterMedia(mariage: MariageLike, pairName: string) {
  const keep = (item: any) => item && (item._type === 'image' ? item.asset : item.url);
  const own = (mariage.gallery || []).filter(keep).map((item) => ({ ...item, alt: item.alt || `Portée de ${pairName}` }));
  const fromPuppies = (mariage.puppies || []).flatMap((p) => {
    const alt = `${p.title} — chiot de ${pairName}`;
    return [p.photo && { ...p.photo, _type: 'image' }, ...(p.gallery || [])]
      .filter(keep)
      .map((item) => ({ ...item, alt: item.alt || alt }));
  });
  return [...own, ...fromPuppies];
}

/** Deterministic Fisher-Yates shuffle (mulberry32 seeded from a string). The site is built
 * statically, so seeding on the mariage id keeps the album order stable from build to build
 * instead of reshuffling on every deploy. */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  const random = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
