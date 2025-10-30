import { Card, CardContent } from "@/components/ui/card";

interface PanettonCardProps {
  name: string;
  price: string;
  imagePlaceholder: string;
  onClick: () => void;
  index: number;
}

const PanettonCard = ({ name, price, imagePlaceholder, onClick, index }: PanettonCardProps) => {
  const isEven = index % 2 === 0;
  
  return (
    <Card 
      className={`group cursor-pointer overflow-hidden border-border/50 bg-card hover:shadow-[var(--shadow-elegant)] transition-all duration-500 ${
        isEven ? 'md:translate-x-8' : 'md:-translate-x-8'
      } hover:scale-[1.02]`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div
          className="aspect-square bg-gradient-to-br from-muted/30 to-muted/60 flex items-center justify-center relative overflow-hidden"
          data-snow-anchor="panettone"
          data-snow-id={index}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 animate-float">
            🎄
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground/60 text-sm italic">{imagePlaceholder}</p>
          </div>
        </div>
        <div className="p-6 space-y-2">
          <h3 className="text-2xl font-elegant font-medium text-foreground group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
          <p className="text-xl text-primary font-semibold">{price}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PanettonCard;
