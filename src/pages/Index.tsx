import { Link } from 'react-router-dom';
import { Shield, CheckCircle2, Lock, Zap, Users, FileCheck, ArrowRight, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Lock,
    title: 'Sécurité Cryptographique',
    description: 'Chaque diplôme est transformé en hash unique via SHA-256, garantissant son intégrité.',
  },
  {
    icon: Zap,
    title: 'Vérification Instantanée',
    description: 'Grâce aux Merkle Proofs, la vérification prend quelques millisecondes.',
  },
  {
    icon: Users,
    title: 'Accessibilité Universelle',
    description: 'Employeurs et institutions peuvent vérifier les diplômes sans accès à la base complète.',
  },
  {
    icon: FileCheck,
    title: 'Immuabilité Totale',
    description: 'Une fois publiée, toute modification de la racine Merkle est immédiatement détectée.',
  },
];

const stats = [
  { value: '100%', label: 'Détection des falsifications' },
  { value: '<1s', label: 'Temps de vérification' },
  { value: '∞', label: 'Diplômes vérifiables' },
];

export default function Index() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Shield className="h-4 w-4" />
              Système National de Vérification
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Authentifiez les Diplômes{' '}
              <span className="text-gradient">Ivoiriens</span>{' '}
              en Toute Confiance
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              CertiCI utilise les arbres de Merkle pour garantir l'intégrité et l'authenticité 
              des diplômes en Côte d'Ivoire. Vérification rapide, sécurisée et transparente.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="hero" size="xl">
                <Link to="/verifier">
                  <CheckCircle2 className="h-5 w-5" />
                  Vérifier un Diplôme
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/arbre">
                  <Hash className="h-5 w-5" />
                  Explorer l'Arbre
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comment ça fonctionne ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les arbres de Merkle permettent de vérifier l'authenticité d'un diplôme 
              sans révéler les informations des autres diplômés.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Hachage',
                description: 'Chaque diplôme est converti en une empreinte numérique unique (hash)',
              },
              {
                step: '02',
                title: 'Construction',
                description: 'Les hash sont combinés pour former un arbre dont la racine est publique',
              },
              {
                step: '03',
                title: 'Vérification',
                description: 'La Merkle Proof permet de vérifier un diplôme contre la racine',
              },
            ].map((item, index) => (
              <div key={item.step} className="relative group">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="text-5xl font-bold text-primary/10 mb-4">{item.step}</div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
                {index < 2 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-muted-foreground/30 h-6 w-6" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Avantages du Système</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une solution moderne pour lutter contre la falsification des diplômes
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card 
                key={feature.title} 
                className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/20"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à vérifier un diplôme ?
            </h2>
            <p className="text-muted-foreground mb-8">
              Utilisez notre système pour authentifier instantanément n'importe quel diplôme ivoirien.
            </p>
            <Button asChild variant="hero" size="xl">
              <Link to="/verifier">
                Commencer la Vérification
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
