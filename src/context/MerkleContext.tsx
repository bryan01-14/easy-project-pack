import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Diploma, MerkleNode, buildMerkleTree, getMerkleRoot, hashDiploma, generateMerkleProof, verifyDiploma, MerkleProof } from '@/lib/merkle';

interface MerkleContextType {
  diplomas: Diploma[];
  tree: MerkleNode | null;
  merkleRoot: string;
  addDiploma: (diploma: Diploma) => void;
  addMultipleDiplomas: (diplomas: Diploma[]) => void;
  rebuildTree: () => Promise<void>;
  verifyDiplomaByData: (diploma: Diploma) => Promise<{
    isValid: boolean;
    hash: string;
    proof: MerkleProof[];
  }>;
  findDiplomaByReference: (reference: string) => Diploma | undefined;
  isBuilding: boolean;
}

const MerkleContext = createContext<MerkleContextType | undefined>(undefined);

// Sample diplomas for demonstration
const sampleDiplomas: Diploma[] = [
  {
    id: '1',
    nom: 'KOUASSI',
    prenom: 'Jean-Baptiste',
    dateNaissance: '1998-05-15',
    typeDiplome: 'Licence en Informatique',
    etablissement: 'Université Félix Houphouët-Boigny',
    anneeObtention: '2022',
    numeroReference: 'UFHB-2022-INF-001',
  },
  {
    id: '2',
    nom: 'TRAORE',
    prenom: 'Aminata',
    dateNaissance: '1999-08-22',
    typeDiplome: 'Master en Économie',
    etablissement: 'Université Alassane Ouattara',
    anneeObtention: '2023',
    numeroReference: 'UAO-2023-ECO-042',
  },
  {
    id: '3',
    nom: 'KONE',
    prenom: 'Moussa',
    dateNaissance: '1997-03-10',
    typeDiplome: 'BTS Comptabilité',
    etablissement: 'ESCAE Abidjan',
    anneeObtention: '2021',
    numeroReference: 'ESCAE-2021-CPT-115',
  },
  {
    id: '4',
    nom: 'BAMBA',
    prenom: 'Fatou',
    dateNaissance: '2000-11-28',
    typeDiplome: 'BAC Série D',
    etablissement: 'Lycée Classique Abidjan',
    anneeObtention: '2020',
    numeroReference: 'LCA-2020-BAC-789',
  },
];

export function MerkleProvider({ children }: { children: ReactNode }) {
  const [diplomas, setDiplomas] = useState<Diploma[]>(sampleDiplomas);
  const [tree, setTree] = useState<MerkleNode | null>(null);
  const [merkleRoot, setMerkleRoot] = useState<string>('');
  const [isBuilding, setIsBuilding] = useState(false);

  const addDiploma = useCallback((diploma: Diploma) => {
    setDiplomas((prev) => [...prev, diploma]);
  }, []);

  const addMultipleDiplomas = useCallback((newDiplomas: Diploma[]) => {
    setDiplomas((prev) => [...prev, ...newDiplomas]);
  }, []);

  const rebuildTree = useCallback(async () => {
    setIsBuilding(true);
    try {
      const newTree = await buildMerkleTree(diplomas);
      setTree(newTree);
      setMerkleRoot(getMerkleRoot(newTree));
    } finally {
      setIsBuilding(false);
    }
  }, [diplomas]);

  const verifyDiplomaByData = useCallback(
    async (diploma: Diploma) => {
      const hash = await hashDiploma(diploma);
      const proof = await generateMerkleProof(tree, hash);
      const isValid = await verifyDiploma(hash, proof, merkleRoot);
      return { isValid, hash, proof };
    },
    [tree, merkleRoot]
  );

  const findDiplomaByReference = useCallback(
    (reference: string) => {
      return diplomas.find((d) => d.numeroReference.toLowerCase() === reference.toLowerCase());
    },
    [diplomas]
  );

  return (
    <MerkleContext.Provider
      value={{
        diplomas,
        tree,
        merkleRoot,
        addDiploma,
        addMultipleDiplomas,
        rebuildTree,
        verifyDiplomaByData,
        findDiplomaByReference,
        isBuilding,
      }}
    >
      {children}
    </MerkleContext.Provider>
  );
}

export function useMerkle() {
  const context = useContext(MerkleContext);
  if (context === undefined) {
    throw new Error('useMerkle must be used within a MerkleProvider');
  }
  return context;
}
