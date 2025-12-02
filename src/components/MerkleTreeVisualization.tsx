import { MerkleNode, truncateHash } from '@/lib/merkle';
import { cn } from '@/lib/utils';

interface TreeVisualizationProps {
  tree: MerkleNode | null;
  highlightedHash?: string;
}

export function MerkleTreeVisualization({ tree, highlightedHash }: TreeVisualizationProps) {
  if (!tree) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Construisez l'arbre pour le visualiser
      </div>
    );
  }

  // Get all levels of the tree
  const getLevels = (node: MerkleNode): MerkleNode[][] => {
    const levels: MerkleNode[][] = [];
    let currentLevel = [node];

    while (currentLevel.length > 0) {
      levels.push(currentLevel);
      const nextLevel: MerkleNode[] = [];
      for (const n of currentLevel) {
        if (n.left) nextLevel.push(n.left);
        if (n.right) nextLevel.push(n.right);
      }
      currentLevel = nextLevel;
    }

    return levels;
  };

  const levels = getLevels(tree);

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[600px] flex flex-col items-center gap-8 py-6">
        {levels.map((level, levelIndex) => (
          <div key={levelIndex} className="flex items-center justify-center gap-4 w-full">
            {level.map((node, nodeIndex) => (
              <div
                key={`${levelIndex}-${nodeIndex}`}
                className={cn(
                  "merkle-node flex flex-col items-center",
                  levelIndex === 0 ? "scale-110" : ""
                )}
              >
                <div
                  className={cn(
                    "px-3 py-2 rounded-lg font-mono text-xs border-2 transition-all duration-300",
                    levelIndex === 0
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30"
                      : node.isLeaf
                      ? "bg-secondary/10 text-secondary border-secondary"
                      : "bg-card border-border",
                    node.hash === highlightedHash && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <div className="text-center">
                    {levelIndex === 0 && (
                      <div className="text-[10px] uppercase tracking-wider opacity-80 mb-1">
                        Racine Merkle
                      </div>
                    )}
                    {truncateHash(node.hash, 6)}
                  </div>
                  {node.data && (
                    <div className="mt-1 text-[10px] text-center opacity-70 max-w-[100px] truncate">
                      {node.data.nom} {node.data.prenom}
                    </div>
                  )}
                </div>
                
                {/* Connection lines */}
                {!node.isLeaf && (node.left || node.right) && (
                  <svg className="h-8 w-24" viewBox="0 0 100 32">
                    <line
                      x1="50"
                      y1="0"
                      x2="25"
                      y2="32"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                      className="merkle-line"
                    />
                    {node.right && (
                      <line
                        x1="50"
                        y1="0"
                        x2="75"
                        y2="32"
                        stroke="hsl(var(--border))"
                        strokeWidth="2"
                        className="merkle-line"
                        style={{ animationDelay: '0.1s' }}
                      />
                    )}
                  </svg>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
