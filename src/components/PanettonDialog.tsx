import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Panettone {
  name: string;
  price: string;
  ingredients: string[];
  description: string;
  allergens: string[];
  nutrition: {
    energyKcal: string;
    protein: string;
    fat: string;
    saturatedFat: string;
    carbs: string;
    sugars: string;
    fiber?: string;
    salt?: string;
  };
}

interface PanettonDialogProps {
  panettone: Panettone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PanettonDialog = ({ panettone, open, onOpenChange }: PanettonDialogProps) => {
  if (!panettone) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border/50">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-3xl font-elegant text-foreground">
            {panettone.name}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground italic">
            {panettone.description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="text-lg font-elegant font-semibold text-foreground mb-3">
              Ingredienti
            </h4>
            <ul className="space-y-2">
              {panettone.ingredients.map((ingredient, index) => (
                <li 
                  key={index} 
                  className="text-muted-foreground flex items-start animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-primary mr-2">•</span>
                  <span className="italic">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-elegant font-semibold text-foreground mb-3">
              Allergeni
            </h4>
            <ul className="space-y-2">
              {panettone.allergens.map((allergen, index) => (
                <li
                  key={index}
                  className="text-muted-foreground flex items-start animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-primary mr-2">•</span>
                  <span className="italic">{allergen}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-elegant font-semibold text-foreground mb-3">
              Valori nutrizionali medi per 100 g
            </h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="italic">Energia: {panettone.nutrition.energyKcal}</span></li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="italic">Proteine: {panettone.nutrition.protein}</span></li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="italic">Grassi: {panettone.nutrition.fat}</span></li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="italic">di cui saturi: {panettone.nutrition.saturatedFat}</span></li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="italic">Carboidrati: {panettone.nutrition.carbs}</span></li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="italic">di cui zuccheri: {panettone.nutrition.sugars}</span></li>
              {panettone.nutrition.fiber && (
                <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="italic">Fibre: {panettone.nutrition.fiber}</span></li>
              )}
              {panettone.nutrition.salt && (
                <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="italic">Sale: {panettone.nutrition.salt}</span></li>
              )}
            </ul>
          </div>
          <div className="pt-4 border-t border-border/30">
            <p className="text-2xl font-elegant text-primary font-semibold">
              {panettone.price}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PanettonDialog;
