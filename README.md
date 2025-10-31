# Dolce Desire Landing - Panettoni Artigianali

Landing page elegante per panettoni artigianali da Mattia Spadavecchia. Un sito web moderno e raffinato che presenta una selezione premium di panettoni prodotti con lievitazione naturale di 48 ore.

## 🎨 Caratteristiche

- **Design Elegante**: Interfaccia raffinata con palette colori natalizia e animazioni fluide
- **Responsive**: Ottimizzato per dispositivi mobile, tablet e desktop
- **Effetti Speciali**: 
  - Neve animata sullo sfondo
  - 7 immagini di panettoni posizionate dinamicamente sullo sfondo
  - Maschere radiali per effetti visivi sofisticati
- **Performance**: Caricamento lazy delle immagini e ottimizzazioni per prestazioni elevate
- **Accessibilità**: Supporto per screen reader e navigazione keyboard

## 🚀 Tecnologie

- **React 18** - Libreria UI moderna
- **TypeScript** - Tipizzazione statica
- **Vite** - Build tool veloce
- **Tailwind CSS** - Styling utility-first
- **shadcn/ui** - Componenti UI accessibili
- **React Router** - Routing client-side
- **React Query** - Gestione dello stato server

## 📦 Installazione

### Prerequisiti

- Node.js 18+ e npm (o bun)
- Git

### Setup

```bash
# 1. Clona il repository
git clone https://github.com/jiortry/dolce-desire-landing.git

# 2. Naviga nella directory del progetto
cd dolce-desire-landing

# 3. Installa le dipendenze
npm install
# oppure
bun install

# 4. Avvia il server di sviluppo
npm run dev
# oppure
bun dev
```

Il sito sarà disponibile su `http://localhost:5173`

## 🛠️ Script Disponibili

```bash
# Sviluppo con hot-reload
npm run dev

# Build di produzione
npm run build

# Build di sviluppo
npm run build:dev

# Anteprima della build di produzione
npm run preview

# Linting del codice
npm run lint
```

## 📱 Struttura del Progetto

```
dolce-desire-landing/
├── public/                 # Asset statici
│   ├── panettoni*.png     # Immagini dei panettoni
│   └── favicon.ico
├── src/
│   ├── components/         # Componenti React
│   │   ├── BackgroundPhotoPlaceholders.tsx  # Immagini di sfondo
│   │   ├── PanettonCard.tsx                 # Card prodotto
│   │   ├── PanettonDialog.tsx               # Dialog dettagli
│   │   ├── Snowfall.tsx                     # Effetto neve
│   │   └── ui/             # Componenti shadcn/ui
│   ├── pages/             # Pagine dell'applicazione
│   │   ├── Index.tsx      # Homepage
│   │   └── NotFound.tsx   # 404 page
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility e helpers
│   ├── App.tsx            # Componente principale
│   ├── main.tsx           # Entry point
│   └── index.css          # Stili globali
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vite.config.ts
```

## 🎯 Componenti Principali

### BackgroundPhotoPlaceholders
Gestisce le 7 immagini di panettoni sullo sfondo con layout responsive:
- **Mobile**: Distribuzione uniforme verticale con offset personalizzati
- **Tablet**: Layout intermedio ottimizzato
- **Desktop**: Layout completo con posizionamento preciso

### Snowfall
Effetto neve animato con:
- Collision detection con elementi della pagina
- Performance ottimizzate per mobile
- Animazione fluida a 60fps

### PanettonCard & PanettonDialog
Presentazione dei prodotti con:
- Informazioni complete (ingredienti, allergeni, valori nutrizionali)
- Sistema di prezzi flessibile (1kg / mezzo)
- Design elegante con animazioni

## 🎨 Design System

Il progetto utilizza un design system personalizzato con:

- **Palette Colori**: Tema natalizio caldo con arancioni, rossi e sfumature scure
- **Tipografia**: Cormorant Garamond per un aspetto elegante e raffinato
- **Animazioni**: Transizioni fluide e animazioni CSS personalizzate
- **Breakpoints**: 
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

## 📝 Contenuto

Il sito presenta 6 varietà di panettoni:

1. **Pistacchio** - Con pasta di pistacchio siciliana
2. **Tradizionale** - Classico con uvetta e arancia candita
3. **Cioccolato Bianco e Limone** - Equilibrio dolcezza e freschezza
4. **Caffè e Arancia** - Note intense di caffè
5. **Cioccolato Fondente** - Variante golosa con scaglie di cioccolato
6. **Arancia, Cioccolato Fondente e Caramello** - Contrasto goloso

Ogni panettone include:
- Lista ingredienti completa
- Informazioni allergeni
- Valori nutrizionali
- Prezzi per formato (1kg / mezzo)

## 🌐 Contatti

Il sito include integrazione con:
- **Instagram**: Link diretto al profilo @m.spd_
- **WhatsApp**: Contatto diretto per ordini e informazioni

## 🚢 Deploy

### Build per Produzione

```bash
npm run build
```

I file ottimizzati saranno nella cartella `dist/`, pronti per essere deployati su qualsiasi hosting statico.

### Opzioni di Deploy

- **Vercel**: Connessione automatica con GitHub
- **Netlify**: Drag & drop della cartella `dist`
- **GitHub Pages**: Usa GitHub Actions per deploy automatico
- **Lovable**: Pubblicazione diretta dalla piattaforma

## 🔧 Configurazione

### Variabili d'Ambiente

Il progetto attualmente non richiede variabili d'ambiente. Per personalizzazioni future, crea un file `.env`:

```env
VITE_INSTAGRAM_URL=https://instagram.com/m.spd_
VITE_WHATSAPP_NUMBER=+39...
```

### Personalizzazione Colori

I colori possono essere modificati in `src/index.css` nelle variabili CSS custom properties.

## 📄 Licenza

Questo progetto è privato e riservato.

## 👨‍💻 Sviluppatore

Sviluppato per Mattia Spadavecchia - Panettoni Artigianali

---

**Nota**: Questo progetto è stato inizialmente creato con [Lovable](https://lovable.dev) e poi personalizzato ulteriormente.
