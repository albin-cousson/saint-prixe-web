# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, served at equal priority:

1. **Prospective puppy buyers** — researching the "De Saint Prixe" kennel before making contact. They evaluate a specific dog or litter's pedigree, health/temperament philosophy, and availability, then reach out via Contact or the Inquiry page.
2. **The wider dog-show community** — judges, fellow breeders, and exhibition enthusiasts tracking the kennel's results and reputation across the show circuit (France and internationally).

Both groups read the same underlying content (dog pedigree pages, show-result posts) for different jobs: one is evaluating a potential puppy, the other is tracking competitive standing.

## Product Purpose

Showcase the De Saint Prixe kennel (Bearded Collie and Shih Tzu breeding, Alsace, France): its breeding dogs' pedigree and show record, its breeding pairs ("Mariages") and their available puppies ("Chiots"), its breeding philosophy, and its show results — and give visitors a real way to make contact. Success is a visitor trusting the kennel enough to inquire about a puppy, or recognizing its results within the show community.

## Positioning

Two things a generic "puppies for sale" site does not do:
- **Pedigree transparency as the norm, not the exception** — every Bearded Collie shown carries its real sire, dam, birth date, and show titles, not just a photo and a price.
- **Breeding pairs framed as relationships, not inventory** — a "Mariage" page presents a breeding pair the way an engagement announcement would (both dogs' portraits, a description, an emotional "&" framing), and its puppies are introduced as individuals, never priced or badged like stock-keeping units.

## Operating Context

- Browsing the dog roster by category: Nos Chiens (curated preview), Nos Mâles, Nos Femelles, Nos Shih Tzu — each dog links to its own pedigree/show-title detail page.
- Browsing Nos Chiots: breeding pairs ("Mariages") and their individual puppies, each puppy's own availability status visible at a glance.
- Reading Actualités: dated posts, mostly show-circuit results, occasionally a breeding-pair announcement.
- Reading À propos for the kennel's philosophy and the breeders' (Aurélie and Arnaud's) own voice.
- Reaching out via Contact (phone/email/address + form) or the Inquiry page.
- **Content management**: the breeder edits all of the above herself in Sanity Studio (`studio/`), the direct replacement for the Wix CMS she used before — the product must stay just as editable without code changes as it was on Wix.

## Capabilities and Constraints

- Static site (Astro) rebuilt from Sanity content at build time — publishing a change in Studio does not appear on the live site until a rebuild runs (a deploy-hook webhook is not yet configured; see CLAUDE.md).
- Terminology: "Mariage" = a breeding pair/couple (not a literal wedding); "Chiot" = puppy; "LOF" = the French kennel club pedigree-registration number, shown on some puppies.
- Undecided/open: whether the "Nos Chiots" nav label should be renamed now that it's powered by the Mariages/Chiots feature rather than the old static gallery page it replaced.

## Brand Commitments

- Kennel name **"De Saint Prixe"**; on-site tagline **"Élevage de Bearded Collie"** (the tagline names only the Bearded Collie even though the kennel also has a Shih Tzu page — that asymmetry is real, current site content, not an error to silently fix).
- Visual identity extracted from the real, live Wix site (not invented): ink `#3b3b3b`, cream `#faf8f0`, gold accent `#d9b280`, Libre Baskerville for display type, sharp corners as the default shape language everywhere (no circular photo framing, including dog/couple portraits), and a small heart-and-line flourish motif under headings, echoing the logo's own flourish.
- Breeders' own voice from À propos (quoted, not paraphrased elsewhere): breeding since 2018, "sous le nom De Saint Prixe," priority on temperament/socialization/standard-compliant quality over titles and pedigrees alone.

## Evidence on Hand

- Real dog roster with pedigree text (sire/dam/birth date/show titles), migrated verbatim from the live site: `src/pages/nos-males.astro`, `nos-femelles.astro`, `nos-shih-tzu.astro`, backed by `dog` documents in Sanity.
- 39 real blog posts (show results + individual dog pedigree announcements), migrated verbatim: see Actualités / `blogPost` documents.
- One real breeding pair ("Romy & Maverick"), sourced from a real blog announcement — intentionally the only one; no other Mariages/Chiots exist yet because no other real litter has happened since migration. Do not add placeholder ones.
- Real contact details (phone, email, address) and real social links (Facebook, Instagram) — see `src/components/Footer.astro`.
- **Confirmed absence** (asked directly, 2026-08-02): no health guarantee, club affiliation, or LOF/registry commitment exists beyond what's already migrated onto the site. Do not invent one.

## Product Principles

1. Every dog, pairing, and puppy shown must trace to real pedigree/availability data — never fabricate lineage, titles, or a litter that doesn't exist yet.
2. Serve puppy buyers and the show-circuit community equally; neither page type (roster/pedigree vs. show-result posts) should crowd out the other.
3. A breeding pair is presented as a relationship, not a listing — preserve the "Mariage" emotional framing and the puppy-as-individual (never priced/badged) presentation already established.
4. The breeder must be able to add or edit any real-world fact (a new dog, litter, show result) herself in Sanity Studio, with no code change — this is why the site exists as Astro+Sanity instead of staying on Wix.
5. Visual restraint over cuteness: sharp corners, real typography, real photography — never generic "cute puppy site" decoration standing in for the kennel's actual credibility.
