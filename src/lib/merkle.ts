// Merkle Tree implementation for diploma verification

export interface Diploma {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  typeDiplome: string;
  etablissement: string;
  anneeObtention: string;
  numeroReference: string;
}

export interface MerkleNode {
  hash: string;
  left?: MerkleNode;
  right?: MerkleNode;
  data?: Diploma;
  isLeaf: boolean;
}

export interface MerkleProof {
  hash: string;
  position: 'left' | 'right';
}

// Simple hash function using Web Crypto API simulation
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Hash diploma data
export async function hashDiploma(diploma: Diploma): Promise<string> {
  const dataString = `${diploma.nom}|${diploma.prenom}|${diploma.dateNaissance}|${diploma.typeDiplome}|${diploma.etablissement}|${diploma.anneeObtention}|${diploma.numeroReference}`;
  return hashData(dataString);
}

// Build Merkle Tree
export async function buildMerkleTree(diplomas: Diploma[]): Promise<MerkleNode | null> {
  if (diplomas.length === 0) return null;

  // Create leaf nodes
  const leaves: MerkleNode[] = await Promise.all(
    diplomas.map(async (diploma) => ({
      hash: await hashDiploma(diploma),
      data: diploma,
      isLeaf: true,
    }))
  );

  // Build tree from leaves
  let currentLevel = leaves;

  while (currentLevel.length > 1) {
    const nextLevel: MerkleNode[] = [];

    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = currentLevel[i + 1] || left; // Duplicate last node if odd

      const combinedHash = await hashData(left.hash + right.hash);
      
      nextLevel.push({
        hash: combinedHash,
        left,
        right: currentLevel[i + 1] ? right : undefined,
        isLeaf: false,
      });
    }

    currentLevel = nextLevel;
  }

  return currentLevel[0];
}

// Get Merkle Root
export function getMerkleRoot(tree: MerkleNode | null): string {
  return tree?.hash || '';
}

// Generate Merkle Proof for a diploma
export async function generateMerkleProof(
  tree: MerkleNode | null,
  diplomaHash: string
): Promise<MerkleProof[]> {
  if (!tree) return [];

  const proof: MerkleProof[] = [];

  function findPath(node: MerkleNode, targetHash: string, currentProof: MerkleProof[]): boolean {
    if (node.isLeaf) {
      return node.hash === targetHash;
    }

    if (node.left && findPath(node.left, targetHash, currentProof)) {
      if (node.right) {
        currentProof.push({ hash: node.right.hash, position: 'right' });
      }
      return true;
    }

    if (node.right && findPath(node.right, targetHash, currentProof)) {
      if (node.left) {
        currentProof.push({ hash: node.left.hash, position: 'left' });
      }
      return true;
    }

    return false;
  }

  findPath(tree, diplomaHash, proof);
  return proof;
}

// Verify diploma using Merkle Proof
export async function verifyDiploma(
  diplomaHash: string,
  proof: MerkleProof[],
  merkleRoot: string
): Promise<boolean> {
  let currentHash = diplomaHash;

  for (const { hash, position } of proof) {
    if (position === 'left') {
      currentHash = await hashData(hash + currentHash);
    } else {
      currentHash = await hashData(currentHash + hash);
    }
  }

  return currentHash === merkleRoot;
}

// Get all leaf nodes (diplomas) from tree
export function getAllLeaves(tree: MerkleNode | null): MerkleNode[] {
  if (!tree) return [];
  if (tree.isLeaf) return [tree];

  const leaves: MerkleNode[] = [];
  if (tree.left) leaves.push(...getAllLeaves(tree.left));
  if (tree.right) leaves.push(...getAllLeaves(tree.right));

  return leaves;
}

// Truncate hash for display
export function truncateHash(hash: string, length: number = 8): string {
  if (hash.length <= length * 2) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}
