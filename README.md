# SMB Demo - Quote Manager

Een moderne, mobile-first web applicatie voor kleine ondernemers (SMB - Small and Medium Business) om klanten, offertes, opdrachten en facturen te beheren.

![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-blue?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Demo

**Live Demo**: [https://mlindhout.github.io/smb-demo/](https://mlindhout.github.io/smb-demo/)

> **Note**: Gebruik een willekeurig e-mailadres en wachtwoord om in te loggen (fake authentication voor demo doeleinden)

## 📋 Overzicht

Quote Manager is een complete offertebeheer applicatie die speciaal is ontwikkeld voor kleine ondernemers. De applicatie biedt een intuïtieve interface voor het beheren van de volledige workflow van klant tot betaling.

### Belangrijkste Features

- 👥 **Klantbeheer** - Beheer klantgegevens en contactinformatie
- 📝 **Offertes** - Maak professionele offertes met automatische berekeningen
- 📦 **Opdrachten** - Converteer geaccepteerde offertes naar opdrachten
- 💰 **Facturen** - Genereer facturen vanuit voltooide opdrachten
- 📧 **E-mail** - Verstuur offertes en facturen direct naar klanten (mock)
- 📱 **Mobile-First** - Optimaal weergegeven op alle apparaten

## 🏗️ Technische Stack

- **Framework**: Angular 21 (standalone components)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript 5.9
- **Architecture**: SOLID principles
- **Data Storage**: Browser LocalStorage
- **CI/CD**: GitHub Actions
- **Hosting**: GitHub Pages

## 📦 Project Structuur

```
smb-demo/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # Production deployment naar GitHub Pages
│       └── test.yml            # Build verificatie voor PR's
├── quote-app/                  # Angular applicatie
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # UI componenten
│   │   │   ├── models/        # Data modellen en interfaces
│   │   │   ├── services/      # Business logic services
│   │   │   └── guards/        # Route guards voor authenticatie
│   │   └── styles.css         # Tailwind CSS configuratie
│   ├── package.json
│   └── README.md
├── DEPLOYMENT.md              # Uitgebreide deployment guide
└── README.md                  # Dit bestand
```

## 🚀 Quick Start

### Vereisten

- Node.js 18 of hoger
- npm

### Lokale Development

```bash
# Clone de repository
git clone https://github.com/mlindhout/smb-demo.git
cd smb-demo/quote-app

# Installeer dependencies
npm install

# Start development server
npm start

# Open browser op http://localhost:4200
```

### Build voor Productie

```bash
cd quote-app
npm run build

# Output in dist/quote-app/browser/
```

## 📚 Applicatie Features

### 1. Klantbeheer
- Klanten toevoegen, bewerken en verwijderen
- Vastleggen van: naam, adres, woonplaats, e-mail, telefoonnummer
- Overzichtelijke lijst met zoek- en filtermogelijkheden
- Mobile: card view, Desktop: table view

### 2. Offertebeheer
- Offertes maken met meerdere regelitems
- Per regel: aantal, omschrijving, stukprijs, BTW percentage
- Automatische berekening van subtotaal, BTW en totaal
- Status tracking: concept → verzonden → geaccepteerd/afgewezen
- E-mail verzenden naar klanten (mock)

### 3. Opdrachtenbeheer
- Automatische conversie van geaccepteerde offertes
- Status tracking: in behandeling → in uitvoering → voltooid
- Opdrachten markeren als voltooid

### 4. Facturatiebeheer
- Facturen genereren vanuit voltooide opdrachten
- Automatische factuurnummering (INV-JAAR-0001)
- Status tracking: concept → verzonden → betaald/verlopen
- Vervaldatum tracking (standaard 30 dagen)
- E-mail verzenden naar klanten (mock)

## 🏛️ SOLID Principes

De applicatie is gebouwd volgens SOLID ontwerpprincipes:

- **Single Responsibility**: Elke service heeft één specifieke verantwoordelijkheid
- **Open/Closed**: Services zijn open voor uitbreiding, gesloten voor modificatie
- **Liskov Substitution**: Consistente interfaces en patterns
- **Interface Segregation**: Specifieke interfaces per domein (Customer, Quote, Order, Invoice)
- **Dependency Inversion**: Volledige gebruik van Angular dependency injection

## 🔄 Workflow

```
Klant toevoegen
    ↓
Offerte maken
    ↓
Offerte versturen (e-mail)
    ↓
Offerte accepteren
    ↓
Opdracht aanmaken (automatisch)
    ↓
Opdracht voltooien
    ↓
Factuur genereren
    ↓
Factuur versturen (e-mail)
    ↓
Factuur betaald markeren
```

## 🚀 Deployment

De applicatie wordt automatisch gedeployed naar GitHub Pages via GitHub Actions wanneer er naar de `main` branch wordt gepusht.

Zie [DEPLOYMENT.md](DEPLOYMENT.md) voor gedetailleerde deployment instructies.

### Automatische Deployment Setup

1. Enable GitHub Pages in repository settings
2. Selecteer "GitHub Actions" als source
3. Push naar main branch
4. Workflow bouwt en deployt automatisch

## 🧪 Testing

```bash
cd quote-app

# Run tests
npm test

# Run tests met coverage
npm test -- --coverage
```

## 📱 Responsive Design

De applicatie is volledig responsive en mobile-first:

- **Mobile** (<768px): Card-based layout, hamburger menu
- **Tablet** (768px-1024px): Hybrid layout
- **Desktop** (>1024px): Full table view met sidebar

## 🔒 Security

- ✅ HTTPS via GitHub Pages
- ✅ Input validatie in alle formulieren
- ✅ XSS preventie via Angular sanitization
- ✅ CSRF tokens niet nodig (geen server-side state)
- ⚠️ Demo gebruikt fake authentication (productie vereist echte auth)
- ⚠️ Data opgeslagen in LocalStorage (productie vereist backend)

## 📊 Browser Support

| Browser | Versie |
|---------|--------|
| Chrome  | 90+    |
| Firefox | 88+    |
| Safari  | 14+    |
| Edge    | 90+    |

## 🤝 Contributing

1. Fork de repository
2. Create een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je wijzigingen (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📝 Roadmap

- [ ] Echte backend integratie (REST API)
- [ ] Gebruikersauthenticatie met JWT
- [ ] PDF generatie voor offertes en facturen
- [ ] Excel export functionaliteit
- [ ] Dashboard met grafieken en statistieken
- [ ] Multi-tenancy support
- [ ] Notificaties en reminders
- [ ] Integratie met boekhoudpakketten

## 📄 License

Dit project is gelicenseerd onder de MIT License - zie het LICENSE bestand voor details.

## 👤 Auteur

Gemaakt met ❤️ voor kleine ondernemers

## 🙏 Acknowledgements

- [Angular](https://angular.dev) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [GitHub Pages](https://pages.github.com) - Hosting
- [GitHub Actions](https://github.com/features/actions) - CI/CD

---

**Note**: Dit is een demo applicatie. Voor productie gebruik wordt aangeraden om:
- Een echte backend toe te voegen
- Authentie en autorisatie te implementeren
- Data encryptie toe te voegen
- Rate limiting in te stellen
- Monitoring en logging op te zetten
