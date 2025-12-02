import { useEffect } from 'react';
import { Hash, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMerkle } from '@/context/MerkleContext';
import { MerkleTreeVisualization } from '@/components/MerkleTreeVisualization';
import { truncateHash, getAllLeaves } from '@/lib/merkle';
import { toast } from 'sonner';

export default function MerkleTree() {
  const { tree, merkleRoot, rebuildTree, isBuilding, diplomas } = useMerkle();

  useEffect(() => {
    if (!tree && diplomas.length > 0) {
      rebuildTree();
    }
  }, []);

  const leaves = tree ? getAllLeaves(tree) : [];

  const handleRebuild = async () => {
    await rebuildTree();
    toast.success('Arbre de Merkle reconstruit');
  };

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            <Hash className="h-4 w-4" />
            Visualisation
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Arbre de Merkle
          </h1>
          <p className="text-muted-foreground">
            Visualisez la structure de l'arbre de Merkle contenant tous les diplômes enregistrés.
            La racine (en haut) est la seule valeur nécessaire pour vérifier n'importe quel diplôme.
          </p>
        </div>

        {/* Merkle Root Card */}
        <Card className="max-w-2xl mx-auto mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary shadow-lg shadow-primary/30 flex items-center justify-center">
                  <Hash className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Racine Merkle (Merkle Root)</div>
                  <code className="text-sm md:text-base font-mono font-semibold text-primary break-all">
                    {merkleRoot ? merkleRoot : 'Non générée'}
                  </code>
                </div>
              </div>
              <Button 
                onClick={handleRebuild}
                disabled={isBuilding}
                variant="heroOutline"
              >
                {isBuilding ? (
                  <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Reconstruire
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="max-w-2xl mx-auto mb-8 border border-border/50">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">Comment ça marche ?</strong> Chaque diplôme est haché (feuille verte), 
                puis les hash sont combinés deux par deux jusqu'à obtenir une racine unique (orange).
                Modifier un seul diplôme changerait toute la chaîne jusqu'à la racine.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tree Visualization */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle>Structure de l'Arbre</CardTitle>
            <CardDescription>
              {leaves.length} feuille(s) • {diplomas.length} diplôme(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MerkleTreeVisualization tree={tree} />
          </CardContent>
        </Card>

        {/* Leaves List */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Feuilles (Diplômes Hachés)</CardTitle>
            <CardDescription>
              Liste de tous les hash de diplômes constituant les feuilles de l'arbre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {leaves.map((leaf, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 border border-border/50"
                >
                  <div className="h-8 w-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-secondary">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {leaf.data?.prenom} {leaf.data?.nom}
                    </div>
                    <code className="text-xs text-muted-foreground font-mono">
                      {truncateHash(leaf.hash, 16)}
                    </code>
                  </div>
                  <div className="text-xs text-muted-foreground hidden md:block">
                    {leaf.data?.typeDiplome}
                  </div>
                </div>
              ))}
              
              {leaves.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun diplôme dans l'arbre. Construisez l'arbre depuis l'administration.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
