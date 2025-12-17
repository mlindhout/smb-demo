# Quote Manager - Offerte Beheer App

Een moderne, mobile-first web applicatie voor kleine ondernemers om klanten, offertes, opdrachten en facturen te beheren.

## Functionaliteit

### 1. Klantbeheer
- Klantgegevens vastleggen (naam, adres, woonplaats, e-mail, telefoonnummer)
- Klanten toevoegen, bewerken en verwijderen
- Overzichtelijke lijst met alle klanten

### 2. Offertebeheer
- Offertes aanmaken voor klanten
- Korte opdrachtomschrijving
- Offerte regels met:
  - Aantal
  - Omschrijving
  - Stukprijs
  - BTW percentage
  - Automatisch berekend regeltotaal
- Automatische berekening van subtotaal, BTW en totaalbedrag
- Offertes versturen via e-mail (mock)
- Status bijhouden (concept, verzonden, geaccepteerd, afgewezen)

### 3. Opdrachtenbeheer
- Automatische conversie van geaccepteerde offertes naar opdrachten
- Status bijhouden (in behandeling, in uitvoering, voltooid)
- Opdrachten markeren als voltooid

### 4. Facturatiebeheer
- Automatisch facturen genereren vanuit voltooide opdrachten
- Facturen versturen via e-mail (mock)
- Status bijhouden (concept, verzonden, betaald, verlopen)
- Facturen markeren als betaald

## Technologie Stack

- **Frontend Framework**: Angular 21
- **Styling**: Tailwind CSS v4
- **Design**: Mobile-first responsive design
- **Data Storage**: LocalStorage (browser-based)
- **Architecture**: SOLID principles

## SOLID Principes

De applicatie is gebouwd volgens de SOLID principes:

- **Single Responsibility**: Elk service heeft één verantwoordelijkheid
- **Open/Closed**: Services zijn open voor uitbreiding maar gesloten voor aanpassing
- **Liskov Substitution**: Consistente interface patterns
- **Interface Segregation**: Specifieke interfaces per domein
- **Dependency Inversion**: Gebruik van dependency injection

## Installatie en Gebruik

### Vereisten
- Node.js 18+
- npm

### Development server

```bash
npm install
npm start
```

Open browser op `http://localhost:4200`

### Build voor productie

```bash
npm run build
```

Output in `dist/quote-app/`

## Gebruik van de App

1. **Inloggen**: Gebruik een willekeurig e-mailadres en wachtwoord (fake login)
2. **Dashboard**: Overzicht van alle data
3. **Klanten toevoegen**: Navigeer naar Klanten > Nieuwe klant
4. **Offerte maken**: Selecteer klant, voeg regels toe met berekeningen
5. **Offerte versturen**: Via e-mail versturen (mock)
6. **Offerte accepteren**: Maakt automatisch een opdracht
7. **Opdracht voltooien**: Markeer opdracht als voltooid
8. **Factuur maken**: Genereer factuur vanuit voltooide opdracht
9. **Factuur versturen**: Verstuur en markeer als betaald

## Features

- Mobile-first responsive design
- Card layout voor mobiel, table layout voor desktop
- Real-time berekeningen
- Status badges met kleurcodering
- LocalStorage data persistentie
- Fake login voor demo doeleinden

## Project Structuur

```
quote-app/
├── src/app/
│   ├── components/     # UI componenten
│   ├── models/         # Data modellen
│   ├── services/       # Business logic
│   └── guards/         # Route guards
```

## Browser Compatibiliteit

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Deployment

De app kan automatisch gedeployd worden naar GitHub Pages via GitHub Actions.

Zie [../DEPLOYMENT.md](../DEPLOYMENT.md) voor volledige deployment instructies.

### Quick Deploy naar GitHub Pages

1. Enable GitHub Pages in repository settings (Source: GitHub Actions)
2. Push naar main branch
3. App wordt automatisch gebouwd en gedeployd

Live URL: `https://<username>.github.io/smb-demo/`
