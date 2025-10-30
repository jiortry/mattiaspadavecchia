import { Card, CardContent } from "@/components/ui/card";

interface PanettonCardProps {
  name: string;
  price: string;
  onClick: () => void;
  index: number;
}

const PanettonCard = ({ name, price, onClick, index }: PanettonCardProps) => {
  const isEven = index % 2 === 0;

  return (
    <Card
      className={`group cursor-pointer overflow-hidden border-border/50 bg-card hover:shadow-[var(--shadow-elegant)] transition-all duration-500 ${
        isEven ? "md:translate-x-8" : "md:-translate-x-8"
      } hover:scale-[1.02]`}
      onClick={onClick}
    >
      <CardContent className="p-0">
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
