import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import appStyles from './App.module.css'
import styles from './TermsPage.module.css'
import { FOUNDER_CREDIT_SHORT, FOUNDER_SENTENCE } from './siteMeta.js'

const logoPath = '/urban-green-logo.png'

export default function TermsPage() {
  useEffect(() => {
    document.title = 'Términos y condiciones | Urban green'
    return () => {
      document.title = 'Urban green'
    }
  }, [])

  return (
    <div className={appStyles.page}>
      <header className={appStyles.topBar}>
        <Link className={appStyles.brand} to="/#inicio">
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

      <main className={styles.main}>
        <article className={styles.article}>
          <p className={styles.meta}>Última actualización: marzo de 2026</p>
          <h1 className={styles.title}>Términos y condiciones de uso</h1>
          <p className={styles.lead}>
            Los presentes términos regulan el acceso y uso de la aplicación móvil y
            servicios asociados de <strong>Urban green</strong> (en adelante, la
            «Aplicación»). Al descargar, registrarte o utilizar la Aplicación,
            aceptas estos términos en su totalidad.
          </p>

          <section className={styles.section}>
            <h2>1. Identificación</h2>
            <p>
              Urban green es una plataforma digital orientada al monitoreo y cuidado
              de espacios verdes urbanos. {FOUNDER_SENTENCE}. El responsable del
              tratamiento de datos y la operación de la Aplicación será quien figure
              como titular en los canales oficiales (sitio web, tienda de aplicaciones
              o avisos dentro de la propia app).
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Objeto del servicio</h2>
            <p>
              La Aplicación permite, entre otras funciones, visualizar información
              ambiental, mapas de espacios verdes, reportes ciudadanos y contenidos
              relacionados con la sostenibilidad urbana. Las funcionalidades pueden
              variar según versión, región o acuerdos con terceros.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Requisitos y registro</h2>
            <p>
              Para usar determinadas funciones puede ser necesario crear una cuenta,
              proporcionar datos veraces y mantener la confidencialidad de tus
              credenciales. Eres responsable de toda actividad realizada con tu
              cuenta.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Uso permitido</h2>
            <p>Te comprometes a utilizar la Aplicación de forma lícita y a:</p>
            <ul>
              <li>
                No emplearla para fines ilícitos, fraudulentos o que vulneren
                derechos de terceros.
              </li>
              <li>
                No intentar acceder de forma no autorizada a sistemas, datos o
                cuentas ajenas.
              </li>
              <li>
                No interferir en el funcionamiento de la Aplicación ni en la
                experiencia de otros usuarios.
              </li>
              <li>
                No reproducir, distribuir o explotar comercialmente el contenido sin
                autorización expresa.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Contenidos y reportes ciudadanos</h2>
            <p>
              Los reportes, comentarios o materiales que envíes deben ser leales y
              respetuosos. Te otorgamos una licencia no exclusiva para que podamos
              usar dichos contenidos en la medida necesaria para operar y mejorar el
              servicio, siempre respetando la normativa aplicable en materia de
              datos personales.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Datos personales</h2>
            <p>
              El tratamiento de datos personales se describe en el aviso de
              privacidad correspondiente. Al usar la Aplicación aceptas dicho
              tratamiento en los términos allí indicados.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Propiedad intelectual</h2>
            <p>
              Los elementos de la Aplicación (diseño, marca, software, textos e
              imágenes propias) están protegidos por la legislación aplicable. No se
              concede ningún derecho sobre ellos salvo el uso personal y no
              comercial permitido por estos términos.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Limitación de responsabilidad</h2>
            <p>
              La información mostrada (incluidos datos de sensores o mapas) se
              ofrece con fines informativos y de apoyo a la toma de decisiones. No
              sustituye estudios técnicos oficiales ni dictámenes de autoridad. En la
              medida permitida por la ley, no nos responsabilizamos por daños
              indirectos, pérdida de beneficios o interrupciones del servicio.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Modificaciones</h2>
            <p>
              Podemos actualizar la Aplicación y estos términos. Los cambios
              relevantes se comunicarán por medios razonables (por ejemplo, aviso en
              la app o actualización de esta página). El uso continuado tras la
              publicación implica la aceptación de las modificaciones.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Legislación aplicable</h2>
            <p>
              Estos términos se interpretan conforme a las leyes de los Estados
              Unidos Mexicanos. Para cualquier controversia, las partes se someten a
              la jurisdicción de los tribunales competentes de Hermosillo, Sonora,
              salvo disposición imperativa en contrario.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Contacto</h2>
            <p>
              Para consultas sobre estos términos o la Aplicación, utiliza los
              canales de contacto indicados en el sitio web oficial o dentro de la
              propia aplicación.
            </p>
          </section>
        </article>
      </main>

      <footer className={appStyles.footer}>
        <p>Urban green © 2026</p>
        <p className={appStyles.founderCredit}>{FOUNDER_CREDIT_SHORT}</p>
        <nav aria-label="Navegación secundaria">
          <Link to="/#inicio">Inicio</Link>
          <Link to="/#mapa">Mapa</Link>
          <Link to="/#acerca">Acerca de</Link>
          <Link to="/#caracteristicas">Características</Link>
          <Link to="/#descargar">Descargar</Link>
          <Link to="/terminos" aria-current="page">
            Términos y condiciones
          </Link>
        </nav>
        <p>Construyendo ciudades más verdes.</p>
      </footer>
    </div>
  )
}
