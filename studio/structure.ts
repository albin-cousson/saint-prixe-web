import type {StructureBuilder, StructureResolver} from 'sanity/structure'

/** Singleton page: clicking it opens the one document directly (no list-of-one detour). */
function singleton(S: StructureBuilder, type: string, title: string) {
  return S.listItem()
    .id(type)
    .title(title)
    .child(S.document().schemaType(type).documentId(type))
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      singleton(S, 'siteSettings', 'Réglages du site'),
      singleton(S, 'homePage', 'Accueil'),
      singleton(S, 'aboutPage', 'À propos'),
      S.listItem()
        .title('Actualités')
        .child(
          S.list()
            .title('Actualités')
            .items([
              singleton(S, 'actualitesPage', 'Réglages de la page'),
              S.documentTypeListItem('blogPost').title('Articles'),
            ]),
        ),
      S.listItem()
        .title('Nos Chiens')
        .child(
          S.list()
            .title('Nos Chiens')
            .items([
              singleton(S, 'nosChiensPage', 'Réglages de la page'),
              S.documentTypeListItem('dog').title('Chiens'),
              singleton(S, 'nosMalesPage', 'Nos Mâles'),
              singleton(S, 'nosFemellesPage', 'Nos Femelles'),
            ]),
        ),
      S.listItem()
        .title('Nos Portées')
        .child(
          S.list()
            .title('Nos Portées')
            .items([
              singleton(S, 'nosPorteesPage', 'Réglages de la page'),
              S.documentTypeListItem('mariage').title('Mariages'),
              S.documentTypeListItem('chiot').title('Chiots'),
            ]),
        ),
      singleton(S, 'portfolioPage', 'Portfolio'),
      singleton(S, 'guidePage', 'Guide du Bearded Collie'),
      singleton(S, 'faqPage', 'FAQ'),
      singleton(S, 'contactPage', 'Contact'),
    ])
