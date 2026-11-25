import type { CollectionConfig, Field, Tab } from 'payload'

import { adminOnly, authenticated } from '../access/roles'
import { media, richText, sectionFlags, select, text, textarea, url, validatePhone } from '../fields'
import { HERO_CLIP_MAX_SECONDS } from './Media'

/**
 * Pagina Acasă: secțiunile din content-model 4 (structura hibridă, D-11).
 * Un document pe restaurant (pluginul multi-tenant, `isGlobal`). Tipurile de secțiune sunt fixe;
 * din panou se pornesc, se opresc și se ordonează. Tagline-ul vine din Setări; insigna din Premii.
 */

const section = (name: string, label: string, fields: Field[], description?: string): Tab => ({
  name,
  label,
  description,
  fields: [...sectionFlags(), ...fields],
})

const title = (max = 50) => text({ name: 'title', label: 'Titlu', max, required: true, localized: true })
const intro = (max = 160, required = false) =>
  textarea({ name: 'intro', label: 'Text introductiv', max, required, localized: true })
const button = (defaultValue: string, description?: string) =>
  text({ name: 'buttonLabel', label: 'Etichetă buton', max: 26, required: true, localized: true, defaultValue, description })

export const HomePage: CollectionConfig = {
  slug: 'home-page',
  labels: { singular: 'Pagina Acasă', plural: 'Pagina Acasă' },
  admin: {
    group: 'Conținut',
    useAsTitle: 'id',
    description: 'Secțiunile paginii Acasă, cu ordinea lor. Oprirea unei secțiuni o scoate și din meniu.',
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: adminOnly,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        section(
          'hero',
          'Hero',
          [
            select({
              name: 'mediaMode',
              label: 'Mod media',
              required: true,
              defaultValue: 'video',
              options: [
                { value: 'video', label: 'Video (implicit, D-29)' },
                { value: 'slideshow', label: 'Slideshow (rezervă)' },
              ],
            }),
            {
              type: 'row',
              fields: [
                media({
                  name: 'videoDesktop',
                  label: 'Video desktop',
                  kinds: ['clip'],
                  maxClipSeconds: HERO_CLIP_MAX_SECONDS,
                  description: `16:9, fără sunet, cel mult ${HERO_CLIP_MAX_SECONDS} s (clipurile lungi merg pe paginile proprii, D-61).`,
                  condition: (_, s) => s?.mediaMode !== 'slideshow',
                }),
                media({
                  name: 'videoMobile',
                  label: 'Video telefon',
                  kinds: ['clip'],
                  maxClipSeconds: HERO_CLIP_MAX_SECONDS,
                  description: `9:16, fără sunet, cel mult ${HERO_CLIP_MAX_SECONDS} s (D-02, D-24, D-61).`,
                  condition: (_, s) => s?.mediaMode !== 'slideshow',
                }),
              ],
            },
            {
              type: 'row',
              fields: [
                media({ name: 'posterDesktop', label: 'Poster desktop', format: 'HERO-L', description: 'Apare înaintea clipului.', requiredUnlessPlaceholder: true }),
                media({ name: 'posterMobile', label: 'Poster telefon', format: 'HERO-P', requiredUnlessPlaceholder: true }),
              ],
            },
            {
              name: 'slides',
              label: 'Cadre de slideshow',
              type: 'array',
              maxRows: 5,
              labels: { singular: 'Cadru', plural: 'Cadre' },
              admin: { condition: (_, s) => s?.mediaMode === 'slideshow' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    media({ name: 'desktop', label: 'Imagine desktop', format: 'HERO-L', required: true }),
                    media({ name: 'mobile', label: 'Imagine telefon', format: 'HERO-P', required: true }),
                  ],
                },
              ],
            },
            text({ name: 'subtitle', label: 'Subtitlu', max: 90, localized: true }),
            {
              type: 'row',
              fields: [
                text({ name: 'bookLabel', label: 'Etichetă buton rezervare', max: 22, required: true, localized: true, defaultValue: 'Rezervă o masă', description: 'Deschide fereastra ialoc.' }),
                text({ name: 'menuButtonLabel', label: 'Etichetă buton meniu', max: 22, required: true, localized: true, defaultValue: 'Meniu', description: 'Deschide meniul digital în filă nouă.' }),
              ],
            },
          ],
          'Tagline-ul vine din Setări; insigna premiului din Premii și distincții.',
        ),
        section('stay', 'Bară de cazare', [
          text({ name: 'title', label: 'Titlu', max: 30, required: true, localized: true, defaultValue: 'Cazare la Hotel ANNA' }),
          text({ name: 'note', label: 'Text sub bară', max: 90, required: true, localized: true, description: 'Spune că este o cerere, confirmată de hotel.' }),
          button('Cere ofertă de cazare'),
          {
            type: 'row',
            fields: [
              { name: 'maxAdults', label: 'Maximum de adulți', type: 'number', required: true, min: 1, defaultValue: 6 },
              { name: 'maxChildren', label: 'Maximum de copii', type: 'number', required: true, min: 0, defaultValue: 4 },
            ],
          },
        ]),
        section(
          'kitchen',
          'Bucătăria',
          [title(), intro(), button('Vezi meniul complet')],
          'Cardurile vin din Categorii de preparate.',
        ),
        section(
          'wines',
          'Vinuri',
          [
            title(),
            intro(),
            button('Vezi lista de vinuri', 'Duce la /catalog-vinuri.'),
            media({
              name: 'pdf',
              label: 'Lista de vinuri în PDF',
              kinds: ['document'],
              description:
                'Opțional. Cu un fișier ales aici, pe pagina Lista de vinuri apare butonul „Descarcă PDF” (D-69). Încarcă PDF-ul în Biblioteca media, cu „Ce încarci?” → „Document PDF”.',
            }),
          ],
          'Lista arată vinurile bifate „Recomandat” (cel mult 5 din fiecare tip), pe tipuri, cu filtre. Deasupra titlului: logo-ul grupului pe fundal închis (Setări).',
        ),
        section(
          'reviews',
          'Ce spun oaspeții',
          [title(), button('Lasă o recenzie', 'Folosește legătura de recenzie Google din Setări.')],
          'Arată primele 3 recenzii active din grupul Restaurant.',
        ),
        section(
          'parties',
          'Petreceri și agenda',
          [
            title(),
            intro(),
            textarea({ name: 'emptyMessage', label: 'Mesaj fără seri viitoare', max: 120, required: true, localized: true, defaultValue: 'Pregătim următoarea seară' }),
          ],
          'Arată următoarele 3 seri din Seri tematice.',
        ),
        section(
          'privateEvents',
          'Evenimente private',
          [
            title(),
            intro(200),
            {
              name: 'eventTypes',
              label: 'Tipuri de evenimente',
              type: 'array',
              maxRows: 8,
              labels: { singular: 'Tip', plural: 'Tipuri' },
              fields: [text({ name: 'label', label: 'Tip', max: 24, required: true, localized: true })],
            },
            button('Rezervă salonul'),
          ],
          'Cardurile vin din Saloane. Aceleași câmpuri alimentează și antetul paginii Evenimente private.',
        ),
        section('pizza', 'Cursuri de pizza', [
          title(),
          textarea({ name: 'shortText', label: 'Text scurt (pe Acasă)', max: 300, required: true, localized: true }),
          media({ name: 'photo', label: 'Fotografie', format: 'CARD-L', requiredUnlessPlaceholder: true }),
          button('Înscrie copilul'),
          richText({ name: 'fullText', label: 'Text complet (pagina cursului)', max: 1200, required: true, localized: true }),
          media({ name: 'gallery', label: 'Galerie foto-video', kinds: ['photo', 'clip'], format: 'GAL', hasMany: true, maxRows: 12 }),
          media({
            name: 'video',
            label: 'Clip principal (pagina cursului)',
            kinds: ['clip'],
            description:
              'D-67: apare pe pagina cursului în locul fotografiei, în formatul lui (de exemplu 9:16), cu sunet la apăsare. Gol = primul clip din galerie.',
          }),
          {
            type: 'row',
            fields: [
              text({ name: 'age', label: 'Vârstă', max: 40, localized: true }),
              text({ name: 'duration', label: 'Durată', max: 40, localized: true }),
              text({ name: 'price', label: 'Preț', max: 40, localized: true }),
              text({ name: 'seats', label: 'Număr de locuri', max: 40, localized: true }),
            ],
          },
        ], 'Vârsta, durata, prețul și locurile rămân goale până la Q-11; apar doar dacă sunt completate.'),
        section('hotel', 'Cazare · Hotel ANNA', [
          title(),
          intro(300, true),
          {
            type: 'row',
            fields: [
              text({ name: 'hotelName', label: 'Numele hotelului', max: 40, required: true, nt: true }),
              text({ name: 'hotelAddress', label: 'Adresa hotelului', max: 80, required: true, nt: true }),
            ],
          },
          url({ name: 'hotelUrl', label: 'Site-ul hotelului' }),
          {
            type: 'row',
            fields: [
              text({
                name: 'hotelPhone',
                label: 'Telefonul recepției',
                max: 30,
                nt: true,
                validate: validatePhone as never,
                description: 'Apare în secțiune și la „Dacă este urgent” după o cerere de cazare (D-51).',
              }),
              text({
                name: 'hotelEmail',
                label: 'Emailul recepției',
                max: 80,
                nt: true,
                description: 'Apare în secțiune, lângă telefon.',
              }),
            ],
          },
          {
            type: 'row',
            fields: [
              { name: 'priceFrom', label: 'Preț „de la” (RON)', type: 'number', min: 0, admin: { description: 'Apare doar dacă este completat și confirmat.' } },
              text({ name: 'priceNote', label: 'Mențiune la preț', max: 40, localized: true }),
            ],
          },
          media({ name: 'photos', label: 'Fotografii', format: 'CARD-L', hasMany: true, maxRows: 3, requiredUnlessPlaceholder: true }),
        ], 'Tipurile de camere vin din Tipuri de camere; recenziile din grupul Hotel.'),
        section('gallery', 'Galerie', [title(), button('Vezi galeria')], 'Arată 6–8 elemente bifate „Pe Acasă”.'),
        section(
          'contact',
          'Contact și întrebări frecvente',
          [title(), intro()],
          'Adresa, programul, telefoanele și harta vin din Setări. Întrebările vin din FAQ, grupul Acasă (cel mult 5).',
        ),
        {
          name: 'footer',
          label: 'Footer',
          description:
            'Creditul realizatorului este fix, pe 2 rânduri, și nu se editează din panou (ADR-013). Logo-ul grupului, premiile, linkurile grupului și paginile legale vin din colecțiile lor.',
          fields: [
            text({ name: 'copyright', label: 'Text drepturi', max: 80, required: true, localized: true }),
            { name: 'placeholder', label: 'Provizoriu', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
  ],
}
