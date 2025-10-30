import { useState } from "react";
import { Instagram } from "lucide-react";
import PanettonCard from "@/components/PanettonCard";
import PanettonDialog from "@/components/PanettonDialog";
import SnowEffect from "@/components/SnowEffect";
import { Button } from "@/components/ui/button";
import BackgroundPhotoPlaceholders from "@/components/BackgroundPhotoPlaceholders";

interface Panettone {
  name: string;
  price: string;
  ingredients: string[];
  description: string;
  imagePlaceholder: string;
}

const panettoni: Panettone[] = [
  {
    name: "Pistacchio",
    price: "€34,00",
    ingredients: [
      "Farina di frumento tenero tipo \"0\"",
      "Burro da panna",
      "Zucchero",
      "Tuorlo d’uovo di categoria \"A\"",
      "Acqua",
      "Lievito madre vivo (farina di grano tenero, acqua)",
      "Pasta di pistacchio siciliana",
      "Cioccolato bianco",
      "Farina di pistacchio",
      "Farina di mandorle",
      "Miele",
      "Sale",
    ],
    description: "Impasto soffice e profumato con ricca pasta di pistacchio e granella croccante.",
    imagePlaceholder: "Foto panettone pistacchio",
  },
  {
    name: "Artigianale",
    price: "€28,00",
    ingredients: [
      "Farina di frumento tenero tipo \"0\"",
      "Burro da panna",
      "Zucchero",
      "Tuorlo d’uovo di categoria \"A\"",
      "Acqua",
      "Lievito madre vivo (farina di grano tenero, acqua)",
      "Uvetta e arancia candita (scorza d’arancia, sciroppo di glucosio, zucchero)",
      "Aromi naturali",
      "Sale",
    ],
    description: "Panettone tradizionale artigianale con lunga lievitazione naturale e aromi genuini.",
    imagePlaceholder: "Foto panettone artigianale",
  },
  {
    name: "Cioccolato Bianco e Limone",
    price: "€32,00",
    ingredients: [
      "Farina di frumento tenero tipo \"0\"",
      "Burro da panna",
      "Zucchero",
      "Tuorlo d’uovo di categoria \"A\"",
      "Acqua",
      "Lievito madre vivo (farina di grano tenero, acqua)",
      "Limone candito (scorza di limone, sciroppo di glucosio, zucchero)",
      "Cioccolato bianco",
      "Miele",
      "Aromi naturali",
      "Sale",
    ],
    description: "Equilibrio tra la dolcezza del cioccolato bianco e la freschezza del limone.",
    imagePlaceholder: "Foto panettone cioccolato bianco e limone",
  },
  {
    name: "Caffè e Arancia",
    price: "€30,00",
    ingredients: [
      "Farina di frumento tenero tipo \"0\"",
      "Burro da panna",
      "Zucchero",
      "Tuorlo d’uovo di categoria \"A\"",
      "Acqua",
      "Lievito madre vivo (farina di grano tenero, acqua)",
      "Arancia candita (scorza d’arancia, sciroppo di glucosio, zucchero)",
      "Zucchero di canna",
      "Pasta di caffè",
      "Polvere di caffè",
      "Miele",
      "Aromi naturali",
      "Sale",
    ],
    description: "Note intense di caffè incontrano l’arancia candita in un impasto soffice.",
    imagePlaceholder: "Foto panettone caffè e arancia",
  },
  {
    name: "Cioccolato Fondente",
    price: "€32,00",
    ingredients: [
      "Farina di frumento tenero tipo \"0\"",
      "Burro da panna",
      "Zucchero",
      "Tuorlo d’uovo di categoria \"A\"",
      "Acqua",
      "Lievito madre vivo (farina di grano tenero, acqua)",
      "Massa di cacao",
      "Cioccolato fondente",
      "Pasta d’arancia",
      "Miele",
      "Sale",
    ],
    description: "Variante golosa con scaglie di cioccolato fondente e profumo di cacao.",
    imagePlaceholder: "Foto panettone cioccolato fondente",
  },
];

const Index = () => {
  const [selectedPanettone, setSelectedPanettone] = useState<Panettone | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePanettonClick = (panettone: Panettone) => {
    setSelectedPanettone(panettone);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 relative">
      <BackgroundPhotoPlaceholders />
      <SnowEffect />
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-elegant font-light text-foreground leading-tight">
            Panettoni
            <span className="block text-primary italic font-normal mt-2">Artigianali</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground italic max-w-2xl mx-auto">
            Tradizione e passione in ogni fetta. Lievitati naturalmente per 48 ore.
          </p>
        </div>
      </header>

      {/* Panettoni Premium List */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-8 md:space-y-10">
          {panettoni.map((panettone, index) => (
            <div
              key={panettone.name}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <PanettonCard
                name={panettone.name}
                price={panettone.price}
                onClick={() => handlePanettonClick(panettone)}
                index={index}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Instagram Contact */}
      <footer className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-elegant font-light text-foreground">
              Seguici su Instagram
            </h2>
            <p className="text-muted-foreground italic">
              Per ordini e informazioni
            </p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-elegant text-lg px-8 py-6 rounded-full shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-105"
            data-snow-anchor="instagram"
            onClick={() => window.open('https://instagram.com/m.spd_', '_blank')}
          >
            <Instagram className="mr-2 h-5 w-5" />
            @m.spd_
          </Button>
        </div>
      </footer>

      <PanettonDialog
        panettone={selectedPanettone}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Index;
