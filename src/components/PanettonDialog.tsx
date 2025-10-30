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
