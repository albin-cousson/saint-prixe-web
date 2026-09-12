import { toPlainText } from 'astro-portabletext';

/** Fields migrated from plain `text` to Portable Text keep holding their old string value
 * until re-saved in Sanity Studio — treat a non-empty string the same as a non-empty block
 * array instead of silently hiding it. */
export function hasRichText(value: unknown): boolean {
  return typeof value === 'string' ? value.trim().length > 0 : Array.isArray(value) && value.length > 0;
}

export function richTextToPlainText(value: unknown): string {
  return typeof value === 'string' ? value : toPlainText((value as any[]) || []);
}
