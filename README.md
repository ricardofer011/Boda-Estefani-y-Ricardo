# Invitación Digital de Boda Católica — Estefani & Ricardo 💌

Una experiencia web de lujo, romántica, interactiva y totalmente responsive, diseñada especialmente para distribuirse por WhatsApp y visualizarse con fluidez en dispositivos móviles y ordenadores. Incluye sobre 3D animado con sello de cera artesanal, cuenta regresiva en tiempo real, integración con Google Maps y Google Calendar, confirmación de asistencia (RSVP) con almacenamiento en base de datos real y un panel de administración privado con exportación a CSV.

---

## 💍 Información Oficial Centralizada

Todos los datos del evento están centralizados en un único archivo de configuración:
📂 **[`src/config/wedding.ts`](src/config/wedding.ts)**

- **Novios:** Estefani & Ricardo
- **Tipo de ceremonia:** Matrimonio Católico
- **Fecha:** Sábado, 12 de diciembre de 2026
- **Hora:** 11:00 a. m.
- **Iglesia:** Iglesia Las Mercedes
- **Ubicación:** Ciudad Colonial, Santo Domingo, República Dominicana
- **Zona Horaria:** `America/Santo_Domingo` (UTC-4)
- **Recepción:** No definida (la sección permanece oculta automáticamente hasta que se configure).

---

## ✨ Características Principales

1. **Sobre Animado 3D Inicial:**
   - Textura de papel artesanal marfil, bordes dorados y profundidad tridimensional.
   - Sello de cera con monograma en relieve **"E & R"**.
   - Animación fluida de apertura (desvanecimiento del sello, apertura de la solapa superior en 3D y tarjeta emergiendo).
   - Opción para saltar la animación y soporte para usuarios con `prefers-reduced-motion`.

2. **Tarjeta de Invitación Digital:**
   - Tipografía serif de lujo (*Cormorant Garamond* y *Cinzel*).
   - Ornamentos de cruz católica sutil y filigrana dorada en esquinas.
   - Bendición matrimonial y nombres con especial protagonismo visual.

3. **Cuenta Regresiva en Tiempo Real:**
   - Días, Horas, Minutos y Segundos calculados en vivo respecto a la zona horaria de Santo Domingo.
   - Mensajes conmemorativos el día de la boda y posterior a la fecha.

4. **Ubicación y Google Maps:**
   - Enlace directo con búsqueda real: *Iglesia Nuestra Señora de Las Mercedes, Ciudad Colonial, Santo Domingo*.

5. **Calendario y Recordatorios:**
   - Botón directo para **Google Calendar** con horario exacto en UTC.
   - Botón de descarga de archivo **`.ics`** para usuarios de iPhone (Apple Calendar) y Outlook.

6. **Música Instrumental Romántica:**
   - Reproductor flotante discreto.
   - Síntesis acústica de arpa y acordes de campanas clásicas mediante Web Audio API (funciona sin depender de archivos externos o problemas de derechos de autor).

7. **Sistema Real de Confirmación de Asistencia (RSVP):**
   - Formulario elegante con validación en cliente y servidor.
   - Control de acompañantes y límite de pases.
   - Registro de restricciones alimentarias, teléfono y mensaje personal.
   - Prevención de doble envío y feedback con confeti dorado.

8. **Panel Administrativo Privado (`/admin`):**
   - Protegido por contraseña y sesión segura (HttpOnly cookie).
   - Resumen visual con tarjetas KPI: Total personas, Asistirán, No asistirán, Total respuestas, Alergias reportadas.
   - Buscador en tiempo real por nombre, teléfono o acompañante.
   - Filtros rápidos por estado.
   - Modal de detalle completo de cada respuesta.
   - **Exportación a CSV en 1 clic** con codificación UTF-8 BOM para Excel.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) (App Router) con TypeScript
- **Estilos:** Tailwind CSS y Vanilla CSS con paleta nupcial (marfil, beige, champagne, dorado tenue)
- **Tipografías:** Cormorant Garamond, Cinzel, Montserrat, Pinyon Script (Google Fonts vía `next/font`)
- **Iconografía:** Lucide React
- **Base de datos:** [Supabase](https://supabase.com/) (PostgreSQL con Row Level Security) + Almacenamiento local de respaldo
- **Efectos:** Canvas Confetti y Web Audio API

---

## 🚀 Puesta en Marcha Local

### 1. Requisitos
- Node.js 18+ (recomendado v20 o v24)
- npm

### 2. Instalación de dependencias
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```
Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

### 4. Acceder al panel de administración
Ruta: [http://localhost:3000/admin](http://localhost:3000/admin)  
Contraseña por defecto en desarrollo: `EstefaniRicardo2026`

---

## 🗄️ Configuración de Supabase (Base de Datos en la Nube)

El proyecto funciona de inmediato en modo local sin configuración externa. Para conectar tu base de datos de producción en Supabase:

1. Crea un proyecto gratuito en [Supabase](https://supabase.com/).
2. Dirígete a la sección **SQL Editor** en tu panel de Supabase.
3. Copia y ejecuta el script de migración ubicado en:
   📂 **[`supabase/migrations/20261018_wedding_schema.sql`](supabase/migrations/20261018_wedding_schema.sql)**
4. En Supabase ve a **Project Settings > API** y copia tus credenciales.
5. Edita el archivo `.env.local` (o configúralas en tu plataforma de hosting como Vercel):

```env
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-clave-anonima-publica"
SUPABASE_SERVICE_ROLE_KEY="tu-clave-service-role-secreta"
ADMIN_SECRET_KEY="TuContraseñaSegura2026!"
NEXT_PUBLIC_SITE_URL="https://tu-dominio.com"
```

---

## 🌐 Publicación en Vercel (Paso a Paso)

1. Sube este repositorio a tu cuenta de GitHub / GitLab.
2. Ingresa a [Vercel](https://vercel.com/) y haz clic en **"Add New Project"**.
3. Importa el repositorio `boda-estefani-ricardo`.
4. En la sección **Environment Variables**, añade las variables de tu archivo `.env.local`.
5. Haz clic en **Deploy**.
6. ¡Listo! Vercel te entregará una URL pública segura (con HTTPS) ideal para compartir por WhatsApp.
