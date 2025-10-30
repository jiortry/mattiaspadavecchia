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
      className={`group cursor-pointer overflow-visible bg-transparent border-0 shadow-none transition-all duration-300 mx-auto ${
        isEven
          ? "md:ml-auto md:translate-x-8 md:text-right"
          : "md:mr-auto md:-translate-x-8 md:text-left"
      } max-w-sm md:max-w-md w-full`}
      onClick={onClick}
      style={{ marginTop: `${(index % 3) * 6}px` }}
    >
      <CardContent className="p-0">
        <div
          className={`p-5 md:p-6 space-y-2 ${isEven ? "md:text-right" : "md:text-left"}`}
        >
          <h3
            className="text-xl md:text-2xl font-elegant font-medium text-foreground group-hover:text-primary transition-colors duration-300"
            data-snow-obstacle="true"
          >
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
