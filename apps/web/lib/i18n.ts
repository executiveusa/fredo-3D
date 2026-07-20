import type { Locale } from "./content";

export const locales: Locale[] = ["es", "en"];

export const routes = {
  home: { es: "/es", en: "/en" },
  gallery: { es: "/es/galeria", en: "/en/gallery" },
  artwork: { es: "/es/obra", en: "/en/artwork" },
  blog: { es: "/es/blog", en: "/en/blog" },
  commissions: { es: "/es/encargos", en: "/en/commissions" },
  contact: { es: "/es/contacto", en: "/en/contact" },
} as const;

export const t = {
  nav: {
    gallery: { es: "Galería", en: "Gallery" },
    blog: { es: "Blog", en: "Blog" },
    commissions: { es: "Encargos", en: "Commissions" },
    contact: { es: "Contacto", en: "Contact" },
    switchLocale: { es: "English", en: "Español" },
    switchAria: { es: "Cambiar a inglés", en: "Switch to Spanish" },
  },
  hero: {
    tagline: { es: "Entre el papel y lo imposible.", en: "Between paper and the impossible." },
    scroll: { es: "Entrar al mundo", en: "Enter the world" },
    toGallery: { es: "Ir directo a la galería", en: "Go straight to the gallery" },
  },
  chapters: {
    ch2t: { es: "La línea sale del papel", en: "The line leaves the page" },
    ch2p: {
      es: "Dibujos anamórficos: solo desde el ángulo exacto el grafito gana profundidad y el papel deja de ser plano.",
      en: "Anamorphic drawings: only from the exact angle does the graphite gain depth and the paper stop being flat.",
    },
    ch3t: { es: "Dentro de lo imposible", en: "Inside the impossible" },
    ch3p: {
      es: "Escaleras que no terminan, cabezas de piedra, tronos de plumas. El mundo surrealista de Fredo.",
      en: "Stairs that never end, stone heads, feather thrones. Fredo's surreal world.",
    },
    ch4t: { es: "Los mundos interiores", en: "The worlds inside" },
    ch4p: {
      es: "Del grafito a la pintura: mares nocturnos, jardines y figuras que sueñan.",
      en: "From graphite to paint: night seas, gardens, and dreaming figures.",
    },
    ch5t: { es: "El humano", en: "The human" },
    ch5bio: {
      es: "Fredo 3D es el proyecto artístico de Wladimir Inostroza, artista chileno de Santiago. Comenzó a publicar sus dibujos tridimensionales a grafito siendo adolescente: en 2010 la prensa chilena e internacional ya mostraba obras que “se confunden con la realidad”. Su trabajo anamórfico ha sido destacado por My Modern Met, TVN y medios de varios países. Sus influencias declaradas: Escher, Rembrandt, Beksinski, Arcimboldo y Alex Grey.",
      en: "Fredo 3D is the artistic identity of Wladimir Inostroza, a Chilean artist from Santiago. He began publishing his three-dimensional graphite drawings as a teenager; by 2010 Chilean and international press were featuring work that “gets confused with reality.” His anamorphic work has been covered by My Modern Met, Chile's TVN, and media in several countries. His declared influences: Escher, Rembrandt, Beksinski, Arcimboldo, and Alex Grey.",
    },
    ch5quote: {
      es: "“Wladimir se queda más tranquilo y atrás. Es Fredo el que sale y expone sus dibujos.” — TVN, 2013",
      en: "“Wladimir stays quieter, in the back. It's Fredo who goes out and shows the drawings.” — TVN, 2013 (translated)",
    },
    ch6t: { es: "El archivo", en: "The archive" },
    ch6p: {
      es: "Prensa verificada desde 2010: BioBioChile, My Modern Met, TVN, TwistedSifter. La historia completa vive en el blog.",
      en: "Verified press since 2010: BioBioChile, My Modern Met, TVN, TwistedSifter. The full story lives on the blog.",
    },
    ch7t: { es: "Sé dueño de parte del mundo", en: "Own part of the world" },
    ch7p: {
      es: "Los originales no tienen precio de lista: cada obra se conversa. Haz una oferta o pregunta por WhatsApp.",
      en: "Originals carry no list price: every work is a conversation. Make an offer or ask on WhatsApp.",
    },
    ch8t: { es: "Trae a Fredo a tu mundo", en: "Bring Fredo into your world" },
    ch8p: {
      es: "Encargos, murales, licencias de personajes y colaboraciones — en Chile y el extranjero. En proyectos con viaje, pasajes y alojamiento corren por cuenta del cliente.",
      en: "Commissions, murals, character licensing, and collaborations — in Chile and abroad. For travel projects, airfare and lodging are covered by the client.",
    },
    ch9t: { es: "La invitación final", en: "The final invitation" },
    ch9p: {
      es: "El mundo de Fredo está abierto. Entra a la galería, lee el archivo o escribe directamente.",
      en: "Fredo's world is open. Enter the gallery, read the archive, or write directly.",
    },
  },
  cta: {
    view: { es: "VER", en: "VIEW" },
    offer: { es: "Hacer una oferta", en: "Make an offer" },
    whatsapp: { es: "Preguntar por WhatsApp", en: "Ask on WhatsApp" },
    commission: { es: "Encargar una obra", en: "Commission a work" },
    license: { es: "Licenciar", en: "License" },
    gallery: { es: "Ver la galería", en: "View the gallery" },
    blogArchive: { es: "Leer el archivo", en: "Read the archive" },
  },
  gallery: {
    title: { es: "Galería", en: "Gallery" },
    intro: {
      es: "El archivo de Fredo 3D. Obras en grafito, anamórficos y pintura. Disponibilidad a consultar.",
      en: "The Fredo 3D archive. Graphite works, anamorphics, and painting. Availability on inquiry.",
    },
    all: { es: "Todas", en: "All" },
  },
  work: {
    metaTitle: { es: "Título", en: "Title" },
    metaYear: { es: "Año", en: "Year" },
    metaMedium: { es: "Técnica", en: "Medium" },
    metaDims: { es: "Medidas", en: "Dimensions" },
    metaAvail: { es: "Disponibilidad", en: "Availability" },
    unknown: { es: "Por documentar", en: "To be documented" },
    untitledNote: {
      es: "Los datos de esta obra están siendo documentados con el artista. Solo publicamos información verificada.",
      en: "This work's details are being documented with the artist. We only publish verified information.",
    },
    back: { es: "← Volver a la galería", en: "← Back to the gallery" },
  },
  blog: {
    title: { es: "Blog", en: "Blog" },
    intro: {
      es: "El archivo vivo de Fredo 3D: prensa histórica verificada, proceso y guías para coleccionistas.",
      en: "The living archive of Fredo 3D: verified historical press, process, and collector guides.",
    },
    originally: { es: "Fuente original publicada el", en: "Original source published" },
    published: { es: "Publicado en fredo3d.com el", en: "Published on fredo3d.com" },
    source: { es: "Fuente original", en: "Original source" },
    related: { es: "Obras relacionadas", en: "Related works" },
    back: { es: "← Volver al blog", en: "← Back to the blog" },
  },
  footer: {
    rights: {
      es: "Todas las obras © Wladimir Inostroza (Fredo 3D). Prohibida su reproducción sin autorización.",
      en: "All artworks © Wladimir Inostroza (Fredo 3D). Reproduction prohibited without permission.",
    },
    langNote: { es: "Puedes escribir en español o inglés.", en: "You can write in Spanish or English." },
  },
  book: {
    title: { es: "Isla de Plástico", en: "Isla de Plástico" },
    p: {
      es: "Fredo es autor e ilustrador del proyecto Isla de Plástico. Detalles de publicación y venta, próximamente.",
      en: "Fredo is the author and illustrator of the Isla de Plástico project. Publication and purchase details coming soon.",
    },
  },
} as const;
