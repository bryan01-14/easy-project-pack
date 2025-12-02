import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const publicLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/verifier', label: 'Vérifier un Diplôme' },
  { href: '/arbre', label: 'Arbre de Merkle' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl",
      isAdminPage 
        ? "border-secondary/30 bg-secondary/5" 
        : "border-border/50 bg-background/80"
    )}>
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl shadow-md transition-all",
            isAdminPage 
              ? "bg-secondary shadow-secondary/20 group-hover:shadow-secondary/30" 
              : "bg-primary shadow-primary/20 group-hover:shadow-primary/30"
          )}>
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight">CertiCI</span>
            <span className={cn(
              "text-xs",
              isAdminPage ? "text-secondary" : "text-muted-foreground"
            )}>
              {isAdminPage ? "Mode Administration" : "Vérification des Diplômes"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {/* Public Links */}
          <div className="flex items-center gap-1 pr-3 border-r border-border">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Admin Link */}
          <div className="pl-3">
            <Link
              to="/admin"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                isAdminPage
                  ? "bg-secondary/10 text-secondary"
                  : "text-muted-foreground hover:text-secondary hover:bg-secondary/5"
              )}
            >
              <Settings className="h-4 w-4" />
              Administration
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-slide-up">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {/* Public Section */}
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2">
              Consultation
            </div>
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  location.pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Admin Section */}
            <div className="border-t border-border mt-2 pt-2">
              <div className="text-xs font-semibold text-secondary uppercase tracking-wider px-4 py-2">
                Administration
              </div>
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  isAdminPage
                    ? "bg-secondary/10 text-secondary"
                    : "text-muted-foreground hover:text-secondary hover:bg-secondary/5"
                )}
              >
                <Settings className="h-4 w-4" />
                Administration
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
