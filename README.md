# Simon Web App

Proyecto base con React 19, TypeScript, Vite, Tailwind CSS 4 y Material-UI.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** versión 20.18.0 (recomendado: LTS)
- **npm** (viene incluido con Node.js) o **yarn/pnpm**

### Verificar instalación

Abre una terminal y ejecuta:

```bash
node --version
npm --version
```

Deberías ver algo como:

```
v20.x.x
10.x.x
```

### Paso 1: Clonar o descargar el proyecto

```bash
git clone <url-del-repositorio>
cd simon-web-refactor
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Iniciar el servidor de desarrollo

```bash
npm run dev
```

## Tecnologías Utilizadas

- **React 19** - Biblioteca para construir interfaces de usuario
- **TypeScript** - Superset de JavaScript con tipado estático
- **Vite** - Herramienta de construcción y servidor de desarrollo
- **Tailwind CSS 4** - Framework de CSS utility-first
- **Material-UI (MUI)** - Librería de componentes UI
- **ESLint** - Linter para mantener calidad de código

---

## Despliegue en CloudFront

Este microfrontend se publica en S3 + CloudFront y es consumido desde otro frontend vía Module Federation.

Antes del primer despliegue, asegúrate de tener en la raíz estos archivos de infraestructura:

- `oac-config.json`
- `dist-config.json`
- `policy.json`
- `response-headers-policy.json`

La policy `response-headers-policy.json` es obligatoria para servir con CORS `remoteEntry.js`, los chunks expuestos y los assets bajo `assets/`.

Creación de la policy:

```bash
aws cloudfront create-response-headers-policy \
	--response-headers-policy-config file://response-headers-policy.json
```

Si la distribución ya existe, debes asociar el `ResponseHeadersPolicy.Id` al `DefaultCacheBehavior` y luego invalidar CloudFront.
