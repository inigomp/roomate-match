# Desplegar Roomatch en GitHub Pages

## Pasos para el Deployment

### 1. Preparar el Repositorio

Asegúrate de que tu repositorio esté en GitHub:

```bash
# Si aún no has inicializado git
git init
git add .
git commit -m "Preparar para deployment en GitHub Pages"

# Conectar con GitHub (reemplaza con tu usuario)
git remote add origin https://github.com/<tu-usuario>/roommate-match.git
git branch -M main
git push -u origin main
```

### 2. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub: `https://github.com/<tu-usuario>/roommate-match`
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona **Deploy from a branch**
5. En **Branch**, selecciona **gh-pages** y carpeta **/ (root)**
6. Click en **Save**

> **Importante:** Cuando usas `gh-pages` (el comando npm), debes seleccionar la rama `gh-pages`, NO "GitHub Actions".

### 3. Hacer Push para Activar el Deployment

```bash
# Cualquier push a la rama main activará el deployment automático
git add .
git commit -m "Activar GitHub Pages deployment"
git push
```

### 4. Verificar el Deployment

1. Ve a la pestaña **Actions** en tu repositorio
2. Verás el workflow "Deploy to GitHub Pages" ejecutándose
3. Espera a que termine (tarda ~2-3 minutos)
4. Una vez completado, tu app estará disponible en:
   ```
   https://<tu-usuario>.github.io/roommate-match/
   ```

## Verificación Post-Deployment

Prueba las siguientes funcionalidades en la URL desplegada:

- ✅ Login con `seeker1@test.com` / `password123`
- ✅ Navegación entre páginas (Swipe, Profile, Matches)
- ✅ Cambio entre roles Seeker/Host
- ✅ Visualización del mapa (Leaflet)
- ✅ Guardado de cambios en el perfil

## Troubleshooting

### El sitio muestra 404
- Verifica que GitHub Pages esté configurado en **Settings > Pages**
- Asegúrate de que la fuente sea **GitHub Actions**
- Espera unos minutos después del primer deployment

### Los assets no cargan (404 en CSS/JS)
- Verifica que `vite.config.ts` tenga `base: '/roommate-match/'`
- El nombre debe coincidir exactamente con el nombre del repositorio

### La app no se conecta a Supabase
- Las credenciales de `.env` ya están embebidas en el build
- Verifica que las políticas RLS en Supabase permitan acceso público

## Deployment Manual (Método Actual)

Este es el método que estás usando actualmente:

```bash
# 1. Asegúrate de tener gh-pages instalado
npm install -D gh-pages

# 2. Construye la aplicación
npm run build

# 3. Crea el archivo .nojekyll (importante para GitHub Pages)
New-Item -ItemType File -Path dist/.nojekyll -Force

# 4. Despliega a la rama gh-pages
npx gh-pages -d dist
```

**Configuración en GitHub:**
- Ve a Settings > Pages
- Source: **Deploy from a branch**
- Branch: **gh-pages** / **(root)**

## Deployment con GitHub Actions (Alternativa Automática)

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

El workflow de GitHub Actions se ejecutará automáticamente y actualizará el sitio.
