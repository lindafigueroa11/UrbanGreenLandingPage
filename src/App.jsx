import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { distance, point } from '@turf/turf'
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
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
    alt: 'Parque urbano con senderos y arbolado denso',
  },
  {
    src: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80',
    alt: 'Area verde urbana con sendero peatonal y mobiliario',
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    alt: 'Parque metropolitano con vegetacion y espacios recreativos',
  },
]

const MAP_CONFIG = {
  center: [29.1028, -110.9773],
  zoom: 12,
  updateIntervalMs: 5000,
  notificationIntervalMs: 15000,
}

const MAP_EVENTS = [
  'Reforestacion comunitaria - Parque Madero',
  'Jornada de limpieza - UNISON',
  'Festival cultural - Gastro Park',
  'Carrera ecologica - Parque Zaragoza',
  'Taller infantil ambiental',
]

const EMBLEMATIC_PARKS = [
  {
    coords: [29.0985, -110.9502],
    name: 'Parque Madero - Pulmon de Hermosillo',
    description: 'Vivero Municipal · Mayor cobertura verde · 25 hectareas',
    category: 'pulmon',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/616/616554.png',
  },
  {
    coords: [29.0839, -110.9591],
    name: 'UNISON - Pulmon Universitario',
    description: 'Area verde estrategica · Investigacion ecologica',
    category: 'emblematico',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2772/2772468.png',
  },
  {
    coords: [29.0901, -110.9456],
    name: 'Gastro Park',
    description: 'Zona recreativa gastronomica · Eventos culturales',
    category: 'emblematico',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2421/2421740.png',
  },
  {
    coords: [29.0878, -110.9527],
    name: 'Soriana Bachoco',
    description: 'Area verde comercial · Mantenimiento constante',
    category: 'emblematico',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3079/3079324.png',
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
        alt="Código QR para descargar la aplicación Urban green"
        loading="lazy"
      />
    </div>
  )
}

function createRandomParks() {
  return Array.from({ length: 800 }, (_, index) => {
    const lat = MAP_CONFIG.center[0] + (Math.random() - 0.5) * 0.45
    const lng = MAP_CONFIG.center[1] + (Math.random() - 0.5) * 0.45

    return {
      name: `Parque HMO #${index + 1}`,
      coords: [lat, lng],
    }
  })
}

function formatDatetime() {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'America/Hermosillo',
  }).format(new Date())
}

function getEnvironmentMetrics() {
  const temp = Number((28 + Math.random() * 8).toFixed(1))
  const humidity = Number((40 + Math.random() * 40).toFixed(0))
  const aqi = Number((50 + Math.random() * 120).toFixed(0))
  const eco = Number((60 + Math.random() * 40).toFixed(0))

  const warnings = []
  if (temp > 35) warnings.push('Ola de calor extrema')
  if (aqi > 120) warnings.push('Aire contaminado')

  return { temp, humidity, aqi, eco, warnings }
}

function MapSection() {
  const mapNodeRef = useRef(null)
  const mapRef = useRef(null)
  const parkLayerRef = useRef(null)
  const parks = useMemo(() => createRandomParks(), [])

  const [datetime, setDatetime] = useState(formatDatetime)
  const [eventsShown, setEventsShown] = useState([])
  const [notifications, setNotifications] = useState([])
  const [environment, setEnvironment] = useState(() => getEnvironmentMetrics())
  const [nearestParks, setNearestParks] = useState([])
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [adoptModalOpen, setAdoptModalOpen] = useState(false)
  const [reciclaModalOpen, setReciclaModalOpen] = useState(false)
  const [selectedReportPark, setSelectedReportPark] = useState('')
  const [issueType, setIssueType] = useState('basura')
  const [issueDesc, setIssueDesc] = useState('')

  useEffect(() => {
    const map = L.map(mapNodeRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView(MAP_CONFIG.center, MAP_CONFIG.zoom)

    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap | Urban green',
    }).addTo(map)

    const parkLayer = L.layerGroup().addTo(map)
    parkLayerRef.current = parkLayer

    parks.forEach((park) => {
      L.circleMarker(park.coords, {
        radius: 4,
        color: '#2ed573',
        fillOpacity: 0.7,
      })
        .addTo(parkLayer)
        .bindPopup(park.name)
    })

    EMBLEMATIC_PARKS.forEach((park) => {
      const icon = L.icon({
        iconUrl: park.iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -28],
      })

      L.marker(park.coords, { icon })
        .addTo(map)
        .bindPopup(
          `<b>${park.name}</b><br>${park.description}<br><button class="js-fly-to-park" data-lat="${park.coords[0]}" data-lng="${park.coords[1]}">Ir al parque</button>`
        )
    })

    const clickHandler = (event) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      if (!target.classList.contains('js-fly-to-park')) return

      const lat = Number(target.dataset.lat)
      const lng = Number(target.dataset.lng)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
      map.flyTo([lat, lng], 16)
    }

    map.getContainer().addEventListener('click', clickHandler)

    return () => {
      map.getContainer().removeEventListener('click', clickHandler)
      map.remove()
      mapRef.current = null
    }
  }, [parks])

  useEffect(() => {
    setEventsShown(
      [...MAP_EVENTS].sort(() => 0.5 - Math.random()).slice(0, 3)
    )
    const timer = setInterval(() => {
      setEventsShown(
        [...MAP_EVENTS].sort(() => 0.5 - Math.random()).slice(0, 3)
      )
    }, 20000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setDatetime(formatDatetime())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setEnvironment(getEnvironmentMetrics())
    }, MAP_CONFIG.updateIntervalMs)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const eventText = MAP_EVENTS[Math.floor(Math.random() * MAP_EVENTS.length)]
      setNotifications((prev) => [
        { id: crypto.randomUUID(), text: `Nuevo evento: ${eventText}` },
        ...prev,
      ].slice(0, 5))
    }, MAP_CONFIG.notificationIntervalMs)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!navigator.geolocation || !mapRef.current) return

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      const userIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      })

      L.marker([latitude, longitude], { icon: userIcon })
        .addTo(mapRef.current)
        .bindPopup('Tu ubicacion')

      mapRef.current.flyTo([latitude, longitude], 14)

      const userPoint = point([longitude, latitude])
      const closestParks = parks
        .map((park) => {
          const parkPoint = point([park.coords[1], park.coords[0]])
          return {
            ...park,
            distKm: distance(userPoint, parkPoint),
          }
        })
        .sort((a, b) => a.distKm - b.distKm)
        .slice(0, 5)

      setNearestParks(closestParks)
    })
  }, [parks])

  const handleSendReport = () => {
    window.alert('Reporte enviado a Urban green.')
    setIssueDesc('')
    setSelectedReportPark('')
    setIssueType('basura')
    setReportModalOpen(false)
  }

  return (
    <section id="mapa" className={`${styles.section} ${styles.mapSection}`}>
      <div className={styles.sectionHeading}>
        <h2>Mapa inteligente de areas verdes</h2>
        <p>
          Monitoreo ambiental, geolocalizacion, eventos, alertas y programas
          ciudadanos en una sola vista.
        </p>
      </div>

      <div className={styles.mapDashboard}>
        <aside className={styles.mapSidebar}>
          <h3>Estado ambiental</h3>
          <p className={styles.mapDatetime}>{datetime}</p>
          <div className={styles.metricGrid}>
            <article className={styles.metricCard}>
              <span>Temperatura</span>
              <strong>{environment.temp} °C</strong>
            </article>
            <article className={styles.metricCard}>
              <span>Humedad</span>
              <strong>{environment.humidity} %</strong>
            </article>
            <article className={styles.metricCard}>
              <span>AQI</span>
              <strong>{environment.aqi}</strong>
            </article>
            <article className={styles.metricCard}>
              <span>Indice ecologico</span>
              <strong>{environment.eco}</strong>
            </article>
          </div>

          <h3>Alertas</h3>
          <div className={styles.stackList}>
            {environment.warnings.length ? (
              environment.warnings.map((warning) => (
                <div key={warning} className={styles.alertCard}>
                  {warning}
                </div>
              ))
            ) : (
              <p className={styles.placeholderText}>Sin alertas criticas.</p>
            )}
          </div>

          <h3>Notificaciones</h3>
          <div className={styles.stackList}>
            {notifications.length ? (
              notifications.map((notification) => (
                <div key={notification.id} className={styles.noticeCard}>
                  {notification.text}
                </div>
              ))
            ) : (
              <p className={styles.placeholderText}>
                Esperando nuevas notificaciones...
              </p>
            )}
          </div>

          <h3>Eventos proximos</h3>
          <div className={styles.stackList}>
            {eventsShown.map((eventText) => (
              <button
                key={eventText}
                className={styles.listAction}
                type="button"
                onClick={() => {
                  const park = EMBLEMATIC_PARKS.find((item) =>
                    eventText.toLowerCase().includes(item.name.toLowerCase().split(' ')[0])
                  )
                  if (!park || !mapRef.current) return
                  mapRef.current.flyTo(park.coords, 15)
                }}
              >
                {eventText}
              </button>
            ))}
          </div>

          <h3>Parques cercanos</h3>
          <div className={styles.stackList}>
            {nearestParks.length ? (
              nearestParks.map((park) => (
                <button
                  key={park.name}
                  type="button"
                  className={styles.listAction}
                  onClick={() => mapRef.current?.flyTo(park.coords, 16)}
                >
                  {park.name} - {park.distKm.toFixed(2)} km
                </button>
              ))
            ) : (
              <p className={styles.placeholderText}>
                Detectando ubicacion para calcular distancias...
              </p>
            )}
          </div>

          <h3>Programas ciudadanos</h3>
          <div className={styles.buttonStack}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => setReportModalOpen(true)}
            >
              Reportar problema
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => setAdoptModalOpen(true)}
            >
              Adopta tu parque
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => setReciclaModalOpen(true)}
            >
              CRECES Recicla
            </button>
          </div>
        </aside>

        <div className={styles.mapCanvasWrap}>
          <div ref={mapNodeRef} className={styles.mapCanvas} />
          <div className={styles.mapLegend}>
            <span>
              <i style={{ background: '#2ed573' }} />
              Parques (800)
            </span>
            <span>
              <i style={{ background: '#00eaff' }} />
              Emblematicos
            </span>
            <span>
              <i style={{ background: '#ffa502' }} />
              Pulmon ciudad
            </span>
          </div>
        </div>
      </div>

      {reportModalOpen ? (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <h3>Reporte ciudadano</h3>
            <label>
              Parque afectado
              <select
                value={selectedReportPark}
                onChange={(event) => setSelectedReportPark(event.target.value)}
              >
                <option value="">Seleccionar parque...</option>
                {parks.slice(0, 50).map((park) => (
                  <option key={park.name} value={park.name}>
                    {park.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tipo de problema
              <select
                value={issueType}
                onChange={(event) => setIssueType(event.target.value)}
              >
                <option value="basura">Basura acumulada</option>
                <option value="arboles">Arboles danados</option>
                <option value="iluminacion">Falta iluminacion</option>
                <option value="otros">Otros</option>
              </select>
            </label>
            <label>
              Descripcion
              <textarea
                rows={4}
                value={issueDesc}
                onChange={(event) => setIssueDesc(event.target.value)}
              />
            </label>
            <div className={styles.modalActions}>
              <button type="button" className={styles.primaryButton} onClick={handleSendReport}>
                Enviar reporte
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setReportModalOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {adoptModalOpen ? (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <h3>Adopta tu parque</h3>
            <p>
              Registrate para apoyar el mantenimiento de espacios verdes con
              actividades comunitarias.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => {
                  window.alert('Registro exitoso en Adopta tu parque.')
                  setAdoptModalOpen(false)
                }}
              >
                Inscribirme
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setAdoptModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {reciclaModalOpen ? (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <h3>CRECES Recicla</h3>
            <p>
              Programa municipal de reciclaje con brigadas de recoleccion
              quincenal.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => {
                  window.alert('Inscripcion completada en CRECES Recicla.')
                  setReciclaModalOpen(false)
                }}
              >
                Unirme al programa
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setReciclaModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function App() {
  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <Link className={styles.brand} to="/#inicio">
          <img src={logoPath} alt="Logo Urban green" />
        </Link>
        <nav aria-label="Navegación principal">
          <Link to="/#inicio">Inicio</Link>
          <Link to="/#mapa">Mapa</Link>
          <Link to="/#acerca">Acerca de</Link>
          <Link to="/#caracteristicas">Características</Link>
          <Link to="/#descargar">Descargar</Link>
        </nav>
      </header>

      <main>
        <section id="inicio" className={`${styles.section} ${styles.heroSection}`}>
          <div className={styles.heroContent}>
            <p className={styles.kicker}>Tecnología para una ciudad más verde</p>
            <h1>Urban green</h1>
            <h2 className={styles.heroSubtitle}>
              Conectando ciudades con la naturaleza.
            </h2>
            <p className={styles.heroDescription}>
              Urban green es una plataforma que ayuda a monitorear, cuidar y
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

        <MapSection />

        <section id="acerca" className={styles.section}>
          <SectionTitle title="¿Qué es Urban green?" />
          <div className={styles.aboutGrid}>
            <p>
              Urban green es una iniciativa tecnológica enfocada en mejorar la
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
          <SectionTitle title="¿Qué puedes hacer con Urban green?" />
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
              description="Lleva Urban green en tu bolsillo y descubre el estado ambiental de los espacios verdes de tu ciudad."
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
        <p>Urban green © 2026</p>
        <nav aria-label="Navegación secundaria">
          <Link to="/#inicio">Inicio</Link>
          <Link to="/#mapa">Mapa</Link>
          <Link to="/#acerca">Acerca de</Link>
          <Link to="/#caracteristicas">Características</Link>
          <Link to="/#descargar">Descargar</Link>
          <Link to="/terminos">Términos y condiciones</Link>
        </nav>
        <p>Construyendo ciudades más verdes.</p>
      </footer>
    </div>
  )
}

export default App
