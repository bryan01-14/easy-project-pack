import { useState, useEffect } from 'react';
import { Plus, RefreshCw, FileText, Hash, Building, Calendar, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMerkle } from '@/context/MerkleContext';
import { Diploma, truncateHash } from '@/lib/merkle';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const diplomaTypes = [
  'BAC Série A',
  'BAC Série C',
  'BAC Série D',
  'BTS Comptabilité',
  'BTS Informatique',
  'Licence en Informatique',
  'Licence en Droit',
  'Licence en Économie',
  'Master en Informatique',
  'Master en Économie',
  'Doctorat',
];

const etablissements = [
  'Université Félix Houphouët-Boigny',
  'Université Alassane Ouattara',
  'Université Nangui Abrogoua',
  'ESCAE Abidjan',
  'INP-HB',
  'Lycée Classique Abidjan',
  'Lycée Technique Abidjan',
  'Collège Moderne de Cocody',
];

export default function Admin() {
  const { diplomas, addDiploma, rebuildTree, merkleRoot, isBuilding, tree } = useMerkle();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Diploma>>({});

  // Build tree on mount if not built
  useEffect(() => {
    if (!tree && diplomas.length > 0) {
      rebuildTree();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.prenom || !formData.typeDiplome || !formData.etablissement || !formData.anneeObtention) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newDiploma: Diploma = {
      id: Date.now().toString(),
      nom: formData.nom,
      prenom: formData.prenom,
      dateNaissance: formData.dateNaissance || '',
      typeDiplome: formData.typeDiplome,
      etablissement: formData.etablissement,
      anneeObtention: formData.anneeObtention,
      numeroReference: formData.numeroReference || `REF-${Date.now().toString().slice(-8)}`,
    };

    addDiploma(newDiploma);
    setFormData({});
    setShowForm(false);
    toast.success('Diplôme ajouté avec succès');
  };

  const handleRebuild = async () => {
    await rebuildTree();
    toast.success('Arbre de Merkle reconstruit avec succès');
  };

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Administration</h1>
            <p className="text-muted-foreground">
              Gérez les diplômes et reconstruisez l'arbre de Merkle
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="heroOutline" 
              onClick={() => setShowForm(!showForm)}
            >
              <Plus className="h-4 w-4" />
              Ajouter un Diplôme
            </Button>
            <Button 
              variant="hero" 
              onClick={handleRebuild}
              disabled={isBuilding}
            >
              {isBuilding ? (
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Reconstruire l'Arbre
            </Button>
          </div>
        </div>

        {/* Merkle Root Card */}
        <Card className="mb-8 border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Hash className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Racine Merkle Actuelle</div>
                  <code className="text-lg font-mono font-semibold text-primary">
                    {merkleRoot ? truncateHash(merkleRoot, 20) : 'Non générée'}
                  </code>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {diplomas.length} diplôme(s) dans l'arbre
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Diploma Form */}
        {showForm && (
          <Card className="mb-8 border-2 animate-slide-up">
            <CardHeader>
              <CardTitle>Nouveau Diplôme</CardTitle>
              <CardDescription>Remplissez les informations du diplôme à ajouter</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom || ''}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value.toUpperCase() })}
                    placeholder="KOUASSI"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom || ''}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    placeholder="Jean-Baptiste"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateNaissance">Date de Naissance</Label>
                  <Input
                    id="dateNaissance"
                    type="date"
                    value={formData.dateNaissance || ''}
                    onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="typeDiplome">Type de Diplôme *</Label>
                  <Select
                    value={formData.typeDiplome}
                    onValueChange={(value) => setFormData({ ...formData, typeDiplome: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {diplomaTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="etablissement">Établissement *</Label>
                  <Select
                    value={formData.etablissement}
                    onValueChange={(value) => setFormData({ ...formData, etablissement: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {etablissements.map((etab) => (
                        <SelectItem key={etab} value={etab}>{etab}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anneeObtention">Année d'Obtention *</Label>
                  <Input
                    id="anneeObtention"
                    value={formData.anneeObtention || ''}
                    onChange={(e) => setFormData({ ...formData, anneeObtention: e.target.value })}
                    placeholder="2023"
                    maxLength={4}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" variant="success">
                    <Plus className="h-4 w-4" />
                    Ajouter le Diplôme
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Diplomas Table */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Liste des Diplômes</CardTitle>
            <CardDescription>
              {diplomas.length} diplôme(s) enregistré(s) dans le système
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom & Prénom</TableHead>
                    <TableHead>Diplôme</TableHead>
                    <TableHead>Établissement</TableHead>
                    <TableHead>Année</TableHead>
                    <TableHead>Référence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {diplomas.map((diploma) => (
                    <TableRow key={diploma.id}>
                      <TableCell className="font-medium">
                        {diploma.prenom} {diploma.nom}
                      </TableCell>
                      <TableCell>{diploma.typeDiplome}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {diploma.etablissement}
                      </TableCell>
                      <TableCell>{diploma.anneeObtention}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {diploma.numeroReference}
                        </code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
