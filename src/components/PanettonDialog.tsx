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
      <DialogContent className="w-[92vw] sm:max-w-[560px] md:max-w-[640px] max-h-[88vh] md:max-h-[90vh] overflow-y-auto bg-card border-border/50 p-6 md:p-8 rounded-xl scrollbar-elegant">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-3xl font-elegant text-foreground">
            {panettone.name}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground italic">
            {panettone.description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-6">
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
            <p className="text-muted-foreground animate-fade-in">
              {panettone.allergens.join(", ")}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-elegant font-semibold text-foreground mb-3">
              Valori nutrizionali medi per 100 g
            </h4>
            <div className="rounded-lg border border-border/40 overflow-hidden bg-muted/20">
              <table className="w-full text-sm text-foreground">
                <tbody>
                  <tr className="border-b border-border/30">
                    <td className="px-4 py-3 text-muted-foreground">Energia</td>
                    <td className="px-4 py-3 text-right font-medium">{panettone.nutrition.energyKcal}</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="px-4 py-3 text-muted-foreground">Proteine</td>
                    <td className="px-4 py-3 text-right font-medium">{panettone.nutrition.protein}</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="px-4 py-3 text-muted-foreground">Grassi</td>
                    <td className="px-4 py-3 text-right font-medium">{panettone.nutrition.fat}</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="px-4 py-3 text-muted-foreground">di cui saturi</td>
                    <td className="px-4 py-3 text-right font-medium">{panettone.nutrition.saturatedFat}</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="px-4 py-3 text-muted-foreground">Carboidrati</td>
                    <td className="px-4 py-3 text-right font-medium">{panettone.nutrition.carbs}</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="px-4 py-3 text-muted-foreground">di cui zuccheri</td>
                    <td className="px-4 py-3 text-right font-medium">{panettone.nutrition.sugars}</td>
                  </tr>
                  {panettone.nutrition.fiber && (
                    <tr className="border-b border-border/30">
                      <td className="px-4 py-3 text-muted-foreground">Fibre</td>
                      <td className="px-4 py-3 text-right font-medium">{panettone.nutrition.fiber}</td>
                    </tr>
                  )}
                  {panettone.nutrition.salt && (
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">Sale</td>
                      <td className="px-4 py-3 text-right font-medium">{panettone.nutrition.salt}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
