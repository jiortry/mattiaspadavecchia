import { useState } from "react";
import { Instagram } from "lucide-react";
import PanettonCard from "@/components/PanettonCard";
import PanettonDialog from "@/components/PanettonDialog";
import { Button } from "@/components/ui/button";

interface Panettone {
  name: string;
  price: string;
  ingredients: string[];
  description: string;
  imagePlaceholder: string;
}

const panettoni: Panettone[] = [
  {
    name: "Classico",
    price: "€28,00",
    ingredients: [
      "Farina di grano tenero tipo 0",
      "Burro fresco",
      "Uova fresche da galline allevate a terra",
      "Uvetta sultanina",
      "Scorze di arancia candita",
      "Lievito madre naturale",
      "Miele millefiori",
      "Vaniglia Bourbon del Madagascar",
    ],
    description: "Il nostro panettone tradizionale, preparato secondo l'antica ricetta milanese con lievitazione naturale di 48 ore.",
    imagePlaceholder: "Foto panettone classico",
  },
  {
    name: "Ciocc Bianco e Limone",
    price: "€32,00",
    ingredients: [
      "Farina di grano tenero tipo 0",
      "Burro fresco",
      "Uova fresche da galline allevate a terra",
      "Gocce di cioccolato bianco",
      "Scorze di limone candite",
      "Lievito madre naturale",
      "Miele di agrumi",
      "Vaniglia naturale",
    ],
    description: "L'armonia perfetta tra la dolcezza del cioccolato bianco e la freschezza del limone.",
    imagePlaceholder: "Foto panettone cioccolato bianco e limone",
  },
  {
    name: "Ciocc Fondente",
    price: "€32,00",
    ingredients: [
      "Farina di grano tenero tipo 0",
      "Burro fresco",
      "Uova fresche da galline allevate a terra",
      "Gocce di cioccolato fondente 70%",
      "Cacao in polvere",
      "Lievito madre naturale",
      "Miele di acacia",
      "Vaniglia Tahiti",
    ],
    description: "Una deliziosa variante con cioccolato fondente di alta qualità, per gli amanti dei sapori intensi.",
    imagePlaceholder: "Foto panettone cioccolato fondente",
  },
  {
    name: "Caffè e Arancia",
    price: "€30,00",
    ingredients: [
      "Farina di grano tenero tipo 0",
      "Burro fresco",
      "Uova fresche da galline allevate a terra",
      "Caffè espresso",
      "Scorze di arancia candita",
      "Lievito madre naturale",
      "Miele di agrumi",
      "Vaniglia naturale",
    ],
    description: "Un incontro sorprendente tra l'intensità del caffè e le note agrumate dell'arancia.",
    imagePlaceholder: "Foto panettone caffè e arancia",
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
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

      {/* Panettoni Grid */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          {panettoni.map((panettone, index) => (
            <div
              key={panettone.name}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <PanettonCard
                name={panettone.name}
                price={panettone.price}
                imagePlaceholder={panettone.imagePlaceholder}
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
