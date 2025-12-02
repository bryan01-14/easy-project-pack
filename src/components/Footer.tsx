import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">CertiCI</p>
              <p className="text-xs text-muted-foreground">
                Système National de Vérification des Diplômes
              </p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              République de Côte d'Ivoire
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} - Sécurisé par Arbres de Merkle
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
