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
        isEven ? "md:translate-x-8 ml-auto" : "md:-translate-x-8 mr-auto"
      } hover:scale-[1.01] max-w-sm md:max-w-md w-full`}
      onClick={onClick}
      data-snow-obstacle="true"
      style={{ marginTop: `${(index % 3) * 6}px` }}
    >
      <CardContent className="p-0">
        <div className="p-5 md:p-6 space-y-2">
          <h3 className="text-xl md:text-2xl font-elegant font-medium text-foreground group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground italic group-hover:text-primary transition-colors duration-300">
            Clicca per più info
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PanettonCard;
