/**
 * Datos de la marca. Fuente: Manual de Marca Maitú y arte del empaque
 * (entregados por la marca). Todo lo que no venga de ahí está marcado como
 * `pending` y no se muestra en la web hasta tener el dato real.
 */
export const brand = {
  name: 'Maitú Café',
  shortName: 'Maitú',
  founder: 'Nicolas Bernal',
  tagline: 'Del origen a tu taza',
  logos: {
    color: '/brand/maitu-logo-color.svg',
    white: '/brand/maitu-logo-blanco.svg',
    badge: '/brand/maitu-sello-nicolas.svg',
    seal: '/brand/maitu-sello-m.svg',
  },
  // Texto del manual y del reverso del empaque.
  description:
    'Maitú es la invitación a explorar el mundo del café, a descubrir sabores ancestrales y a crear nuevas experiencias. Maitú es un puente entre el pasado y el presente, una conexión con nuestras raíces culturales.',
  // "Breve historia — Cómo empezamos" (manual, pág. 02), en primera persona de Nicolas.
  story: [
    'En el 2020 el café llegó a mi vida. Fue un momento crucial porque estaba, por decirlo así, en el limbo: nada de lo que hacía o había hecho antes me apasionaba, y el café despertó en mí el amor por un arte.',
    'Al darme cuenta de que era bueno en lo que hacía apareció el sentido de la competitividad, y eso me ha llevado a obtener reconocimiento, admiración y orgullo por parte de mi familia y personas allegadas.',
    'Las personas suelen acudir a mí en busca de un buen café porque confían en mis conocimientos y capacidades. Por esto decidí crear mi propia marca de café especial.',
  ],
  values: [
    { title: 'Joven', text: 'Fresca y diferente, para quienes buscan autenticidad y nuevas experiencias, y valoran los productos con historia.' },
    { title: 'Orgullo regional', text: 'Un nombre con raíces locales que enfatiza el orgullo por el lugar de origen del café y su tradición cafetera.' },
    { title: 'Calidad', text: 'Un compromiso con la esencia y la pureza del café, y con el cuidado en el cultivo.' },
  ],
  contact: {
    whatsappDisplay: '313 481 9333',
    // Formato internacional para wa.me (Colombia +57).
    whatsappIntl: '573134819333',
    email: 'Maitucafe12@gmail.com',
    instagram: 'maitucafe',
  },
  origin: {
    country: 'Colombia',
    region: 'Tolima',
    // ⚠ Pendiente: fincas, municipios, productores, altitudes.
    farms: [],
  },
}

export const whatsappLink = (message = 'Hola Maitú, quiero hacer un pedido de café.') =>
  `https://wa.me/${brand.contact.whatsappIntl}?text=${encodeURIComponent(message)}`

export const instagramLink = `https://www.instagram.com/${brand.contact.instagram}/`
export const emailLink = `mailto:${brand.contact.email}`
