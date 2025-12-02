import { useState } from 'react';
import { Search, CheckCircle2, XCircle, AlertCircle, FileText, Hash, Building, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useMerkle } from '@/context/MerkleContext';
import { Diploma, truncateHash } from '@/lib/merkle';
import { toast } from 'sonner';

type VerificationResult = {
  status: 'valid' | 'invalid' | 'not_found';
  diploma?: Diploma;
  hash?: string;
  proofLength?: number;
};

export default function Verify() {
  const { findDiplomaByReference, verifyDiplomaByData, merkleRoot, tree } = useMerkle();
  const [reference, setReference] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!reference.trim()) {
      toast.error('Veuillez entrer un numéro de référence');
      return;
    }

    if (!tree || !merkleRoot) {
      toast.error('L\'arbre de Merkle n\'est pas encore construit. Allez dans Administration pour le construire.');
      return;
    }

    setIsVerifying(true);
    setResult(null);

    try {
      const diploma = findDiplomaByReference(reference.trim());

      if (!diploma) {
        setResult({ status: 'not_found' });
        return;
      }

      const { isValid, hash, proof } = await verifyDiplomaByData(diploma);

      if (isValid) {
        setResult({
          status: 'valid',
          diploma,
          hash,
          proofLength: proof.length,
        });
        toast.success('Diplôme vérifié avec succès !');
      } else {
        setResult({
          status: 'invalid',
          diploma,
          hash,
        });
        toast.error('Le diplôme n\'a pas pu être vérifié');
      }
    } catch (error) {
      toast.error('Erreur lors de la vérification');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            <Search className="h-4 w-4" />
            Vérification de Diplôme
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Vérifier l'Authenticité d'un Diplôme
          </h1>
          <p className="text-muted-foreground">
            Entrez le numéro de référence du diplôme pour vérifier son authenticité 
            contre la racine Merkle publiée.
          </p>
        </div>

        {/* Search Card */}
        <Card className="max-w-xl mx-auto mb-8 border-2">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reference">Numéro de Référence</Label>
                <div className="flex gap-3">
                  <Input
                    id="reference"
                    placeholder="Ex: UFHB-2022-INF-001"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleVerify} 
                    disabled={isVerifying}
                    variant="hero"
                  >
                    {isVerifying ? (
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Vérifier
                  </Button>
                </div>
              </div>

              {merkleRoot && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    Racine Merkle actuelle:
                  </div>
                  <code className="text-xs font-mono text-primary break-all">
                    {truncateHash(merkleRoot, 16)}
                  </code>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <div className="max-w-xl mx-auto animate-slide-up">
            {result.status === 'valid' && result.diploma && (
              <Card className="border-2 border-success/30 bg-success/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <CardTitle className="text-success">Diplôme Authentique</CardTitle>
                      <CardDescription>Vérifié contre la racine Merkle</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">
                          {result.diploma.prenom} {result.diploma.nom}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Né(e) le {new Date(result.diploma.dateNaissance).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                      <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">{result.diploma.typeDiplome}</div>
                        <div className="text-xs text-muted-foreground">{result.diploma.etablissement}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Année {result.diploma.anneeObtention}</div>
                        <div className="text-xs text-muted-foreground">Réf: {result.diploma.numeroReference}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-success/20 text-xs text-muted-foreground">
                    <div>Hash: <code className="text-success">{truncateHash(result.hash || '', 12)}</code></div>
                    <div>Preuve Merkle: {result.proofLength} étape(s)</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {result.status === 'invalid' && (
              <Card className="border-2 border-destructive/30 bg-destructive/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center">
                      <XCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <div className="font-semibold text-destructive">Vérification Échouée</div>
                      <div className="text-sm text-muted-foreground">
                        Ce diplôme ne peut pas être authentifié contre la racine Merkle actuelle.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {result.status === 'not_found' && (
              <Card className="border-2 border-warning/30 bg-warning/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <div className="font-semibold text-warning">Diplôme Non Trouvé</div>
                      <div className="text-sm text-muted-foreground">
                        Aucun diplôme avec cette référence n'a été trouvé dans le système.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Sample References */}
        <div className="max-w-xl mx-auto mt-8">
          <div className="text-center text-sm text-muted-foreground mb-3">
            Références de test disponibles:
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['UFHB-2022-INF-001', 'UAO-2023-ECO-042', 'ESCAE-2021-CPT-115', 'LCA-2020-BAC-789'].map((ref) => (
              <button
                key={ref}
                onClick={() => setReference(ref)}
                className="px-3 py-1 rounded-full bg-muted text-xs font-mono hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {ref}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
