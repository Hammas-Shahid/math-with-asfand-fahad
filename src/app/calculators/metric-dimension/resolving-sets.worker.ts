/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const { n, table } = data;
  const resolvingSets = calculateResolvingSets(n, table);
  postMessage({ resolvingSets });
});

function calculateResolvingSets(n: number, table: (number | null)[][]): string[][] {
  const vertices = Array.from({ length: n }, (_, i) => i + 1);
  const allSubsets = getAllSubsets(vertices);
  const resolvingSets: string[][] = [];

  for (const subset of allSubsets) {
    if (isResolvingSet(subset, table)) {
      resolvingSets.push(subset.map(v => `v${v}`).sort());
    }
  }

  return resolvingSets;
}

function getAllSubsets(arr: number[]): number[][] {
  return arr.reduce<number[][]>(
    (subsets, value) => subsets.concat(subsets.map(set => [value, ...set])),
    [[]]
  );
}

function isResolvingSet(subset: number[], table: (number | null)[][]): boolean {
  const distances = new Set<string>();

  for (let i = 0; i < table.length; i++) {
    const distanceVector = subset.map(j => table[i][j - 1]).join(',');
    if (distances.has(distanceVector)) {
      return false;
    }
    distances.add(distanceVector);
  }

  return true;
}
