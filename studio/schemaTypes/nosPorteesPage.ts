import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'nosPorteesPage',
  title: 'Page Nos Portées',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string'}),
    defineField({name: 'intro', title: "Texte d'introduction", type: 'text'}),
    defineField({
      name: 'cardCtaLabel',
      title: 'Texte du bouton "Découvrir la portée" (sur les cartes)',
      description: 'Optionnel — affiché sur chaque carte portée (page Nos Portées et accueil). Par défaut : "Découvrir la portée".',
      type: 'string',
    }),
    defineField({
      name: 'reserveCtaLabel',
      title: 'Texte du bouton "Réserver ce chiot"',
      description: 'Optionnel — affiché sous chaque chiot disponible, sur la fiche d\'une portée. Par défaut : "Réserver ce chiot".',
      type: 'string',
    }),
    defineField({
      name: 'notifyCtaLabel',
      title: 'Texte du bouton "Être prévenu·e de la naissance"',
      description: 'Optionnel — affiché sur la fiche d\'une portée dont les chiots ne sont pas encore nés. Par défaut : "Être prévenu·e de la naissance".',
      type: 'string',
    }),
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO (balise <title> / Google)',
      description:
        "Optionnel — remplace le titre affiché dans l'onglet du navigateur et les résultats Google. Laisser vide pour utiliser le titre par défaut.",
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description SEO (Google)',
      description:
        "Optionnel — le résumé affiché sous le titre dans les résultats Google (150-160 caractères recommandés). Laisser vide pour utiliser la description par défaut.",
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    prepare: () => ({title: 'Page Nos Portées'}),
  },
})
