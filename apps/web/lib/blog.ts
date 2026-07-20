import type { Locale } from "./content";

export interface BlogPost {
  slug: string;
  collection: string;
  /** Real date the ORIGINAL external source was published (null for original guides). */
  sourcePublishedAt: string | null;
  sourceUrl: string | null;
  sourceTitle: string | null;
  /** Real date this article went live on fredo3d.com. Never backdated. */
  publishedAt: string;
  relatedWorks: string[];
  title: { es: string; en: string };
  excerpt: { es: string; en: string };
  /** Paragraphs. Strings starting with "## " render as subheads, "> " as quotes. */
  body: { es: string[]; en: string[] };
}

export const posts: BlogPost[] = [
  {
    slug: "2010-la-primera-entrevista-internacional",
    collection: "ARCHIVO",
    sourcePublishedAt: "2010-11-10",
    sourceUrl: "https://mymodernmet.com/unbelievable-3d-drawings-16/",
    sourceTitle: "My Modern Met — Unbelievable 3D Drawings by a 17-Year-Old",
    publishedAt: "2026-07-19",
    relatedWorks: ["obra-03", "obra-05", "obra-10"],
    title: {
      es: "2010: la primera entrevista internacional",
      en: "2010: the first international interview",
    },
    excerpt: {
      es: "Con 17 años, Fredo respondió a My Modern Met desde Santiago. Sus palabras de entonces siguen definiendo su trabajo.",
      en: "At 17, Fredo answered My Modern Met from Santiago. His words from back then still define his work.",
    },
    body: {
      es: [
        "En noviembre de 2010, el sitio estadounidense My Modern Met publicó una de las primeras entrevistas internacionales a Fredo, entonces un dibujante adolescente de Santiago cuyos dibujos tridimensionales a grafito ya circulaban por la web.",
        "## Lo que dijo entonces",
        "Sobre sus influencias: “I like Beksinski, Arcimboldo, Rembrandt, Alex Grey, and, of course M.C. Escher.”",
        "Sobre su proceso: “Sometimes 30 minutes, sometimes one month. Time is gold but the satisfaction of seeing a finished drawing is the most important.”",
        "> “Everything is possible with a pencil in your hands, the real world is smaller than the imaginary.”",
        "## Dónde llevó todo esto",
        "Esa cobertura temprana abrió el camino: en los años siguientes su trabajo anamórfico fue destacado por medios de Chile y el mundo. Las obras de esa época — el dominó que cae, el bebé que emerge del papel — siguen entre las más reconocidas de su archivo.",
        "Fuente original: My Modern Met, 10 de noviembre de 2010 (Eugene Kim). Extractos breves citados con atribución.",
      ],
      en: [
        "In November 2010, the American site My Modern Met published one of the first international interviews with Fredo, then a teenage draftsman from Santiago whose three-dimensional graphite drawings were already circulating online.",
        "## What he said then",
        "On his influences: “I like Beksinski, Arcimboldo, Rembrandt, Alex Grey, and, of course M.C. Escher.”",
        "On his process: “Sometimes 30 minutes, sometimes one month. Time is gold but the satisfaction of seeing a finished drawing is the most important.”",
        "> “Everything is possible with a pencil in your hands, the real world is smaller than the imaginary.”",
        "## Where it led",
        "That early coverage opened the road: in the following years his anamorphic work was featured by media in Chile and abroad. The works of that era — the falling dominoes, the baby emerging from the page — remain among the most recognized in his archive.",
        "Original source: My Modern Met, November 10, 2010 (Eugene Kim). Short excerpts quoted with attribution.",
      ],
    },
  },
  {
    slug: "el-dibujo-que-busca-ser-real-tvn-2013",
    collection: "ARCHIVO",
    sourcePublishedAt: "2013-01-31",
    sourceUrl:
      "https://www.24horas.cl/tendencias/espectaculosycultura/fredo-art-el-dibujo-que-busca-ser-real--493798",
    sourceTitle: "24horas.cl (TVN) — Fredo Art: el dibujo que busca ser real",
    publishedAt: "2026-07-19",
    relatedWorks: ["obra-04", "obra-09"],
    title: {
      es: "“El dibujo que busca ser real”: cuando la TV chilena descubrió a Fredo",
      en: "“The drawing that wants to be real”: when Chilean TV discovered Fredo",
    },
    excerpt: {
      es: "En enero de 2013, TVN perfiló al artista detrás del seudónimo — y explicó por qué Wladimir se queda atrás y Fredo sale al mundo.",
      en: "In January 2013, Chile's national broadcaster profiled the artist behind the pseudonym — and why Wladimir stays back while Fredo goes out into the world.",
    },
    body: {
      es: [
        "El 31 de enero de 2013, 24horas.cl — el portal de TVN, la televisión nacional de Chile — publicó un perfil del artista que firmaba sus dibujos simplemente como Fredo.",
        "El artículo lo presentó por su nombre real, Wladimir Inostroza, entonces estudiante de psicología de la Universidad Autónoma, y documentó algo que define su identidad artística hasta hoy:",
        "> “Wladimir se queda más tranquilo y atrás. Es Fredo el que sale y expone sus dibujos.”",
        "## Alcance internacional",
        "Según TVN, para esa fecha ya lo habían entrevistado medios de Rusia y Japón, además de los dos periódicos de mayor circulación del Reino Unido: The Sun y Daily Mail.",
        "## Por qué importa",
        "Este perfil es el registro verificado más claro del salto de Fredo desde los blogs de arte hacia la prensa masiva — y la razón por la que este sitio presenta primero el arte, y después al humano.",
        "Fuente original: 24horas.cl (TVN), 31 de enero de 2013.",
      ],
      en: [
        "On January 31, 2013, 24horas.cl — the portal of TVN, Chile's national broadcaster — published a profile of the artist who signed his drawings simply as Fredo.",
        "The article introduced him by his real name, Wladimir Inostroza, then a psychology student at Universidad Autónoma, and documented something that defines his artistic identity to this day:",
        "> “Wladimir stays quieter, in the back. It's Fredo who goes out and shows the drawings.” (Translated from the original Spanish.)",
        "## International reach",
        "According to TVN, by that date he had already been interviewed by media in Russia and Japan, plus the UK's two highest-circulation newspapers: The Sun and the Daily Mail.",
        "## Why it matters",
        "This profile is the clearest verified record of Fredo's jump from art blogs to mass press — and the reason this site shows the art first, and the human after.",
        "Original source: 24horas.cl (TVN), January 31, 2013.",
      ],
    },
  },
  {
    slug: "2010-el-primer-registro",
    collection: "ARCHIVO",
    sourcePublishedAt: "2010-07-19",
    sourceUrl:
      "https://www.biobiochile.cl/noticias/2010/07/19/adolescente-chileno-crea-impresionantes-dibujos-3d-con-lapiz-grafito.shtml",
    sourceTitle:
      "BioBioChile — Adolescente chileno crea impresionantes dibujos 3D con lápiz grafito",
    publishedAt: "2026-07-19",
    relatedWorks: ["obra-10", "obra-12"],
    title: {
      es: "2010: el primer registro de prensa",
      en: "2010: the earliest press record",
    },
    excerpt: {
      es: "El registro público más antiguo que hemos verificado: un adolescente de Santiago y un lápiz grafito.",
      en: "The oldest public record we have verified: a teenager from Santiago and a graphite pencil.",
    },
    body: {
      es: [
        "El 19 de julio de 2010, BioBioChile publicó la nota más antigua que hemos podido verificar sobre Fredo: un adolescente de Santiago que creaba dibujos 3D tan realistas que, en palabras del medio, “se confunden con la realidad”.",
        "La nota destacaba una idea que Fredo ha demostrado desde entonces:",
        "> “No es necesario contar con un gran presupuesto ni con los mejores materiales para crear maravillosas obras de arte.”",
        "## La era del blog",
        "En 2010 el trabajo de Fredo vivía en un blog de Blogspot y en DeviantArt. La nota registra además que el portal estadounidense Uphaa ya había republicado una selección de sus imágenes — la primera señal del alcance internacional que vendría.",
        "Fuente original: BioBioChile, 19 de julio de 2010.",
      ],
      en: [
        "On July 19, 2010, BioBioChile published the oldest piece we have been able to verify about Fredo: a teenager from Santiago creating 3D drawings so realistic that, in the outlet's words, they “get confused with reality.”",
        "The piece highlighted an idea Fredo has proven ever since:",
        "> “You don't need a big budget or the best materials to create wonderful works of art.” (Translated from the original Spanish.)",
        "## The blog era",
        "In 2010 Fredo's work lived on a Blogspot blog and on DeviantArt. The article also records that the American portal Uphaa had already republished a selection of his images — the first sign of the international reach to come.",
        "Original source: BioBioChile, July 19, 2010.",
      ],
    },
  },
  {
    slug: "como-funciona-el-dibujo-anamorfico",
    collection: "PROCESO",
    sourcePublishedAt: "2013-08-05",
    sourceUrl: "https://twistedsifter.com/2013/08/anamorphic-3d-pencil-drawings-by-fredo/",
    sourceTitle: "TwistedSifter — Anamorphic 3D Pencil Drawings by Fredo",
    publishedAt: "2026-07-19",
    relatedWorks: ["obra-03", "obra-05", "obra-10"],
    title: {
      es: "Cómo funciona el dibujo anamórfico de Fredo",
      en: "How Fredo's anamorphic drawing works",
    },
    excerpt: {
      es: "El truco no está en el papel: está en el ángulo. Así gana profundidad un dibujo plano.",
      en: "The trick isn't in the paper: it's in the angle. This is how a flat drawing gains depth.",
    },
    body: {
      es: [
        "Un dibujo anamórfico solo revela su profundidad desde un punto de vista exacto. Visto desde cualquier otro ángulo, sus elementos se ven alargados y distorsionados — ese es el precio geométrico de la ilusión.",
        "## La mecánica",
        "El artista deforma deliberadamente las proporciones sobre el papel, calculando cómo la perspectiva las corregirá cuando el espectador (o la cámara) se ubique en el punto preciso. El papel muchas veces se curva o se recorta para extender la ilusión fuera del borde.",
        "## En el archivo de Fredo",
        "Las piezas del dominó, el bebé que emerge del papel y el cráneo sobre papel curvado son ejemplos directos: objetos reales (una mano, una lata, un lápiz) conviven con el dibujo para anclar la ilusión en el mundo físico.",
        "Cobertura de referencia: TwistedSifter, 5 de agosto de 2013.",
      ],
      en: [
        "An anamorphic drawing only reveals its depth from one exact point of view. Seen from any other angle, its elements look elongated and distorted — that is the geometric price of the illusion.",
        "## The mechanics",
        "The artist deliberately deforms proportions on the paper, calculating how perspective will correct them when the viewer (or camera) stands at the precise point. The paper is often curved or cut to extend the illusion past the edge.",
        "## In Fredo's archive",
        "The falling dominoes, the baby emerging from the page, and the skull on curved paper are direct examples: real objects (a hand, a can, a pencil) share the frame with the drawing to anchor the illusion in the physical world.",
        "Reference coverage: TwistedSifter, August 5, 2013.",
      ],
    },
  },
  {
    slug: "como-comprar-un-original-de-fredo",
    collection: "COLECCIONISMO",
    sourcePublishedAt: null,
    sourceUrl: null,
    sourceTitle: null,
    publishedAt: "2026-07-19",
    relatedWorks: [],
    title: {
      es: "Cómo comprar un original de Fredo",
      en: "How to buy an original Fredo work",
    },
    excerpt: {
      es: "Ofertas, envío internacional y cuidado de obras en grafito — lo que un coleccionista debe saber.",
      en: "Offers, international shipping, and graphite care — what a collector should know.",
    },
    body: {
      es: [
        "## Hacer una oferta",
        "Las obras del archivo no tienen precio de lista. Si una pieza te interesa, envía una oferta desde su página o escribe directamente por WhatsApp. Fredo responde personalmente en español o inglés; cada acuerdo se conversa, no se automatiza.",
        "## Envío internacional",
        "Las obras en papel viajan en tubo rígido o embalaje plano protegido, con seguro y seguimiento. Los tiempos y costos dependen del destino y se confirman antes de cerrar cualquier acuerdo.",
        "## Cuidado de un original en grafito",
        "Papel lejos de la luz solar directa, humedad estable, enmarcado con vidrio UV y sin contacto directo entre el vidrio y la superficie del dibujo. Un enmarcador profesional lo resuelve con paspartú.",
        "## Obras vendidas o en colección privada",
        "Parte del archivo pertenece a colecciones privadas. Esas obras siguen visibles porque la historia también es parte del valor — y siempre puedes encargar una obra nueva.",
      ],
      en: [
        "## Making an offer",
        "Works in the archive carry no list price. If a piece interests you, send an offer from its page or write directly on WhatsApp. Fredo replies personally in Spanish or English; every agreement is a conversation, not an automation.",
        "## International shipping",
        "Works on paper travel in rigid tubes or protected flat packaging, insured and tracked. Times and costs depend on destination and are confirmed before any agreement closes.",
        "## Caring for a graphite original",
        "Keep paper away from direct sunlight, in stable humidity, framed with UV glass and no direct contact between glass and the drawing surface. A professional framer solves this with a mat.",
        "## Sold and private-collection works",
        "Part of the archive belongs to private collections. Those works remain visible because history is part of the value — and you can always commission a new piece.",
      ],
    },
  },
  {
    slug: "como-encargar-una-obra-o-mural",
    collection: "ENCARGOS",
    sourcePublishedAt: null,
    sourceUrl: null,
    sourceTitle: null,
    publishedAt: "2026-07-19",
    relatedWorks: ["obra-16"],
    title: {
      es: "Cómo encargar una obra o un mural",
      en: "How to commission a work or a mural",
    },
    excerpt: {
      es: "Del primer mensaje al proyecto terminado: cómo funciona un encargo con Fredo, en Chile o en el extranjero.",
      en: "From first message to finished project: how a commission with Fredo works, in Chile or abroad.",
    },
    body: {
      es: [
        "## El proceso",
        "1. Cuéntanos el proyecto: tipo de obra, dirección visual, medidas, plazo y rango de presupuesto. 2. Fredo evalúa y responde personalmente. 3. Se acuerdan propuesta, condiciones y calendario. 4. La obra se desarrolla con avances compartidos.",
        "## Murales y proyectos internacionales",
        "Fredo realiza murales y obras de gran formato, también fuera de Chile. En proyectos con viaje, los pasajes aéreos y el alojamiento corren por cuenta del cliente como parte del paquete. Consulta los detalles por WhatsApp o con el formulario de encargos.",
        "## Presupuesto",
        "Cada proyecto se cotiza a medida. Un rango de presupuesto claro en el primer mensaje acelera todo.",
      ],
      en: [
        "## The process",
        "1. Tell us the project: type of work, visual direction, dimensions, timeline, and budget range. 2. Fredo evaluates and replies personally. 3. Proposal, terms, and schedule are agreed. 4. The work develops with shared progress updates.",
        "## Murals and international projects",
        "Fredo takes on murals and large-format works, including outside Chile. For projects involving travel, airfare and lodging are covered by the client as part of the package. Ask for details on WhatsApp or through the commission form.",
        "## Budget",
        "Every project is quoted individually. A clear budget range in your first message speeds everything up.",
      ],
    },
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export const collectionLabels: Record<string, { es: string; en: string }> = {
  ARCHIVO: { es: "Archivo", en: "Archive" },
  PROCESO: { es: "Proceso", en: "Process" },
  COLECCIONISMO: { es: "Coleccionismo", en: "Collecting" },
  ENCARGOS: { es: "Encargos", en: "Commissions" },
};

export function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso + "T12:00:00Z");
  return d.toLocaleDateString(locale === "es" ? "es-CL" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
