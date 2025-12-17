# Deployment Guide - Quote Manager op GitHub Pages

Deze guide legt uit hoe je de Quote Manager app deployt naar GitHub Pages.

## Automatische Deployment via GitHub Actions

De repository bevat een automatische deployment workflow die de app bouwt en publiceert naar GitHub Pages.

### Setup Instructies

#### 1. GitHub Pages Activeren

1. Ga naar je GitHub repository
2. Klik op **Settings**
3. Scroll naar **Pages** in het linker menu
4. Bij **Source** selecteer: **GitHub Actions**

#### 2. Eerste Deployment

De deployment wordt automatisch getriggerd wanneer je naar de `main` branch pusht.

```bash
# Voeg alle wijzigingen toe
git add .

# Commit de wijzigingen
git commit -m "Setup GitHub Pages deployment"

# Push naar main branch
git push origin main
```

#### 3. Workflow Monitoren

1. Ga naar de **Actions** tab in je repository
2. Klik op de workflow run "Deploy to GitHub Pages"
3. Wacht tot beide jobs (build en deploy) succesvol zijn voltooid
4. De app is nu beschikbaar op: `https://<username>.github.io/smb-demo/`

### Workflows

De repository bevat twee workflows:

#### `deploy.yml` - Production Deployment
- **Trigger**: Push naar `main` branch of handmatig via workflow_dispatch
- **Doel**: Bouwt en deployt de app naar GitHub Pages
- **Stappen**:
  1. Checkout code
  2. Setup Node.js 20
  3. Installeer dependencies
  4. Build Angular app met correcte base-href
  5. Voeg .nojekyll file toe (voorkomt Jekyll processing)
  6. Upload build artifact
  7. Deploy naar GitHub Pages

#### `test.yml` - Build Verificatie
- **Trigger**: Pull requests en pushes naar feature branches
- **Doel**: Verifieert dat de app succesvol bouwt
- **Stappen**:
  1. Checkout code
  2. Setup Node.js 20
  3. Installeer dependencies
  4. Build Angular app
  5. Verifieer build output

## Handmatige Deployment

Als je de app handmatig wilt deployen:

### Optie 1: Via npm script (aanbevolen voor lokaal testen)

```bash
cd quote-app

# Build met correcte base-href
npm run build -- --base-href /smb-demo/

# De build output staat in: dist/quote-app/browser
```

### Optie 2: Via gh-pages package

```bash
cd quote-app

# Installeer gh-pages
npm install -D gh-pages

# Voeg script toe aan package.json:
# "deploy": "ng build --base-href /smb-demo/ && gh-pages -d dist/quote-app/browser"

# Deploy
npm run deploy
```

## Configuratie Details

### Base HREF

De app wordt gebouwd met `--base-href /smb-demo/` omdat GitHub Pages de app host op:
```
https://<username>.github.io/smb-demo/
```

Als je repository anders heet, pas de base-href aan in `.github/workflows/deploy.yml`:
```yaml
npm run build -- --base-href /<repository-naam>/
```

### Output Directory

Angular 21 gebruikt standaard de volgende output structuur:
```
dist/
└── quote-app/
    └── browser/       # Dit is de directory die gedeployd wordt
        ├── index.html
        ├── main-*.js
        ├── styles-*.css
        └── ...
```

### .nojekyll File

De workflow voegt automatisch een `.nojekyll` file toe aan de root van de deployment. Dit zorgt ervoor dat GitHub de bestanden niet door Jekyll haalt, wat problemen kan veroorzaken met Angular's routing en assets.

## Troubleshooting

### App laadt niet op GitHub Pages

1. **Controleer de base-href**: Zorg dat deze overeenkomt met je repository naam
2. **Controleer de workflow logs**: Ga naar Actions tab en bekijk eventuele errors
3. **Controleer GitHub Pages instellingen**: Zorg dat "GitHub Actions" is geselecteerd als source

### Routing werkt niet (404 errors)

Dit is een bekend probleem met SPAs op GitHub Pages. Oplossing:

**Optie 1: HashLocationStrategy** (eenvoudigste)

Wijzig `quote-app/src/app/app.config.ts`:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation())  // Voeg withHashLocation() toe
  ]
};
```

URL's worden dan: `https://username.github.io/smb-demo/#/dashboard`

**Optie 2: 404 redirect trick**

Voeg een 404.html toe die redirect naar index.html met de path als query parameter.

### Build faalt

1. **Check Node.js versie**: Workflow gebruikt Node.js 20
2. **Check dependencies**: Zorg dat package-lock.json up-to-date is
3. **Test lokaal**: Run `npm run build` lokaal om errors te zien

### Permission errors

Als je "Permission denied" errors ziet:

1. Ga naar **Settings** > **Actions** > **General**
2. Scroll naar **Workflow permissions**
3. Selecteer **Read and write permissions**
4. Sla op en trigger de workflow opnieuw

## Custom Domain (Optioneel)

Als je een eigen domein wilt gebruiken:

1. Voeg een `CNAME` file toe aan de deployment:
   ```bash
   echo "jouw-domein.nl" > quote-app/dist/quote-app/browser/CNAME
   ```

2. Configureer DNS bij je domain provider:
   ```
   Type: CNAME
   Name: www (of @)
   Value: <username>.github.io
   ```

3. Pas base-href aan naar `/` in de workflow

## Development vs Production

### Development (lokaal)
```bash
cd quote-app
npm start
# Toegang via: http://localhost:4200
```

### Production (GitHub Pages)
```bash
# Automatisch via workflow bij push naar main
# OF handmatig:
cd quote-app
npm run build -- --base-href /smb-demo/
# Deploy dist/quote-app/browser naar GitHub Pages
```

## Cache Invalidatie

GitHub Pages kan assets cachen. Als updates niet direct zichtbaar zijn:

1. Hard refresh in browser: `Ctrl + Shift + R` (Windows/Linux) of `Cmd + Shift + R` (Mac)
2. Wacht enkele minuten voor CDN propagatie
3. Open in incognito mode om cache te omzeilen

## Monitoring

Je kunt de deployment status monitoren via:

1. **GitHub Actions**: Realtime logs van build en deployment
2. **Deployments tab**: Overzicht van alle deployments en hun status
3. **GitHub Pages settings**: Toont de huidige deployment URL en status

## Security

De app gebruikt LocalStorage voor data opslag. Voor productie gebruik overweeg:

1. **HTTPS**: GitHub Pages gebruikt automatisch HTTPS
2. **CSP Headers**: Configureer via `_headers` file (niet ondersteund op GitHub Pages, gebruik Netlify/Vercel)
3. **Data validatie**: Valideer alle input in de services

## Kosten

GitHub Pages is gratis voor publieke repositories met de volgende limieten:
- 100 GB bandwidth per maand
- 1 GB repository storage
- 10 builds per uur

Voor private repositories heb je GitHub Pro nodig.

## Alternatieven voor GitHub Pages

Als GitHub Pages niet aan je eisen voldoet:

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd quote-app
npm run build
netlify deploy --dir=dist/quote-app/browser --prod
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd quote-app
vercel --prod
```

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize
firebase init hosting

# Deploy
firebase deploy --only hosting
```

## Support

Voor vragen of problemen:
- Check de [GitHub Actions documentation](https://docs.github.com/en/actions)
- Check de [GitHub Pages documentation](https://docs.github.com/en/pages)
- Open een issue in de repository
