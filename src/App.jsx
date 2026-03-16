import styles from './App.module.css'

const playStoreLink = 'https://play.google.com/'
const logoPath = '/urban-green-logo.png'
const qrCodeUrl =
  'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https%3A%2F%2Fplay.google.com%2F'

const featureList = [
  {
    icon: '🌱',
    title: 'Monitoreo Ambiental',
    description:
      'Visualiza datos en tiempo real sobre la salud de las áreas verdes.',
  },
  {
    icon: '📡',
    title: 'Sensores Inteligentes',
    description:
      'Dispositivos instalados en parques y jardines recolectan información ambiental.',
  },
  {
    icon: '🗺️',
    title: 'Mapa Verde',
    description:
      'Explora los espacios verdes de tu ciudad desde la aplicación.',
  },
  {
    icon: '🤝',
    title: 'Participación Ciudadana',
    description:
      'Las personas pueden reportar el estado de áreas verdes y contribuir al cuidado urbano.',
  },
]

const processSteps = [
  {
    icon: '1',
    description: 'Sensores instalados en áreas verdes recopilan datos.',
  },
  {
    icon: '2',
    description: 'Los dispositivos envían la información a la plataforma.',
  },
  {
    icon: '3',
    description: 'La aplicación móvil muestra los datos en tiempo real.',
  },
  {
    icon: '4',
    description:
      'Ciudadanos y autoridades pueden actuar para mejorar los espacios verdes.',
  },
]

const urbanPhotos = [
  {
    src: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80',
    alt: 'Parque urbano con senderos y árboles',
  },
  {
    src: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&w=900&q=80',
    alt: 'Espacio verde dentro de la ciudad con zonas de descanso',
  },
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
    alt: 'Bosque urbano rodeado de edificios',
  },
]

function SectionTitle({ title, description }) {
  return (
    <div className={styles.sectionHeading}>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <article className={styles.featureCard}>
      <span className={styles.iconBadge} aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

function StepItem({ icon, description }) {
  return (
    <li className={styles.stepItem}>
      <span className={styles.stepNumber}>{icon}</span>
      <p>{description}</p>
    </li>
  )
}

function DownloadActions() {
  return (
    <div className={styles.downloadActions}>
      <a
        className={styles.primaryButton}
        href={playStoreLink}
        target="_blank"
        rel="noreferrer"
      >
        Descargar App
      </a>
      <img
        className={styles.qrCode}
        src={qrCodeUrl}
        alt="Código QR para descargar la aplicación Urban Green"
        loading="lazy"
      />
    </div>
  )
}

function App() {
  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <a className={styles.brand} href="#inicio">
          <img src={logoPath} alt="Logo Urban Green" />
        </a>
        <nav aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#acerca">Acerca de</a>
          <a href="#caracteristicas">Características</a>
          <a href="#descargar">Descargar</a>
        </nav>
      </header>

      <main>
        <section id="inicio" className={`${styles.section} ${styles.heroSection}`}>
          <div className={styles.heroContent}>
            <img
              className={styles.heroLogo}
              src={logoPath}
              alt="Logo Urban Green"
              loading="eager"
            />
            <p className={styles.kicker}>Tecnología para una ciudad más verde</p>
            <h1>Urban Green</h1>
            <h2 className={styles.heroSubtitle}>
              Conectando ciudades con la naturaleza.
            </h2>
            <p className={styles.heroDescription}>
              Urban Green es una plataforma que ayuda a monitorear, cuidar y
              expandir los espacios verdes urbanos mediante tecnología, sensores
              ambientales y participación ciudadana.
            </p>
            <DownloadActions />
          </div>
          <img
            className={styles.heroImage}
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=80"
            alt="Parque urbano rodeado de árboles y vegetación"
            loading="eager"
          />
        </section>

        <section id="acerca" className={styles.section}>
          <SectionTitle title="¿Qué es Urban Green?" />
          <div className={styles.aboutGrid}>
            <p>
              Urban Green es una iniciativa tecnológica enfocada en mejorar la
              calidad ambiental de las ciudades. A través de sensores inteligentes
              y una aplicación móvil, se pueden monitorear variables ambientales
              como humedad del suelo, temperatura y estado de áreas verdes.
            </p>
            <p>
              La plataforma permite a ciudadanos y autoridades visualizar
              información en tiempo real y tomar decisiones para cuidar mejor los
              espacios naturales dentro de las ciudades.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <SectionTitle
            title="Naturaleza dentro de la ciudad"
            description="Parques urbanos, árboles y espacios verdes que inspiran una vida más saludable."
          />
          <div className={styles.photoGrid}>
            {urbanPhotos.map((photo) => (
              <img
                key={photo.src}
                className={styles.photoCard}
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
              />
            ))}
          </div>
        </section>

        <section id="caracteristicas" className={styles.section}>
          <SectionTitle title="¿Qué puedes hacer con Urban Green?" />
          <div className={styles.featuresGrid}>
            {featureList.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section id="funciona" className={styles.section}>
          <SectionTitle title="¿Cómo funciona?" />
          <ul className={styles.stepsList}>
            {processSteps.map((step) => (
              <StepItem key={step.icon} {...step} />
            ))}
          </ul>
        </section>

        <section id="descargar" className={`${styles.section} ${styles.downloadSection}`}>
          <div className={styles.downloadText}>
            <SectionTitle
              title="Descarga la aplicación"
              description="Lleva Urban Green en tu bolsillo y descubre el estado ambiental de los espacios verdes de tu ciudad."
            />
            <DownloadActions />
          </div>
          <img
            className={styles.mockupImage}
            src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=80"
            alt="Ilustración de aplicación móvil en un entorno urbano verde"
            loading="lazy"
          />
        </section>
      </main>

      <footer className={styles.footer}>
        <p>Urban Green © 2026</p>
        <nav aria-label="Navegación secundaria">
          <a href="#inicio">Inicio</a>
          <a href="#acerca">Acerca de</a>
          <a href="#caracteristicas">Características</a>
          <a href="#descargar">Descargar</a>
        </nav>
        <p>Construyendo ciudades más verdes.</p>
      </footer>
    </div>
  )
}

export default App
