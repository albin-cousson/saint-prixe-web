import mariage from './mariage'
import chiot from './chiot'
import dog from './dog'
import blogPost from './blogPost'
import siteSettings from './siteSettings'
import pageSection from './pageSection'
import mariagesSection from './mariagesSection'
import actualitesSection from './actualitesSection'
import malesSection from './malesSection'
import femellesSection from './femellesSection'
import homePage from './homePage'
import aboutPage from './aboutPage'
import contactPage from './contactPage'
import portfolioPage from './portfolioPage'
import actualitesPage from './actualitesPage'
import nosChiensPage from './nosChiensPage'
import nosMalesPage from './nosMalesPage'
import nosFemellesPage from './nosFemellesPage'
import nosPorteesPage from './nosPorteesPage'
import guidePage from './guidePage'
import faqPage from './faqPage'

export const schemaTypes = [
  // Singletons (site-wide / one per page)
  siteSettings,
  homePage,
  aboutPage,
  contactPage,
  portfolioPage,
  actualitesPage,
  nosChiensPage,
  nosMalesPage,
  nosFemellesPage,
  nosPorteesPage,
  guidePage,
  faqPage,
  // Repeatable documents
  dog,
  mariage,
  chiot,
  blogPost,
  // Reusable objects
  pageSection,
  mariagesSection,
  actualitesSection,
  malesSection,
  femellesSection,
]
