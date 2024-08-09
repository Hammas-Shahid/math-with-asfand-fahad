/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const { n, table } = data;
  console.log('Start: ', new Date());
  let allFound = false;
  let iterationMinimumResolvingNumber = undefined;
  let resolvingSets = [];
  let metricDimension = n;
  let previousResolvingSetsCount = 0;

  while (!allFound) {
    const calculateResolvingSetsRes = calculateResolvingSets(n, table, iterationMinimumResolvingNumber);
    allFound = calculateResolvingSetsRes.allFound;
    resolvingSets = calculateResolvingSetsRes.resolvingSets;
    metricDimension = calculateResolvingSetsRes.metricDimension;

    if (resolvingSets.length === previousResolvingSetsCount) {
      // No new resolving sets found, stop the loop
      allFound = true;
    } else {
      previousResolvingSetsCount = resolvingSets.length;
      iterationMinimumResolvingNumber = metricDimension;
    }
  }

  console.log('End: ', new Date());
  postMessage({ resolvingSets, metricDimension });
});

function calculateResolvingSets(n: number, table: (number | null)[][], maxSubsetLength?: number) {
  const vertices = Array.from({ length: n }, (_, i) => i + 1);
  const getSubsets = getUpto20LacSubsets(vertices, maxSubsetLength);
  const allSubsets = getSubsets.subsets;
  let metricDimension = n;

  let resolvingSets: string[][] = [];

  for (const subset of allSubsets) {
    if (isResolvingSet(subset, table)) {
      metricDimension = Math.min(metricDimension, subset.length);
      resolvingSets.push(subset.map(v => `v${v}`).sort());
    }
  }

  return { resolvingSets, allFound: getSubsets.allFound, metricDimension };
}

function getUpto20LacSubsets(arr: number[], maxSubsetLength?: number) {
  let subsets: number[][] = [[]]; // Start with an empty subset
  let allFound = false;

  for (const value of arr) {
    const newSubsets = [];
    for (const subset of subsets) {
      const subsetToCreate = [...subset, value];
      if (!maxSubsetLength || subsetToCreate.length <= maxSubsetLength) {
        newSubsets.push(subsetToCreate);
      }
      if (subsets.length + newSubsets.length >= 1000000) {
        return { subsets: subsets.concat(newSubsets.slice(0, 1000000 - subsets.length)), allFound: true };
      }
    }
    subsets = subsets.concat(newSubsets);
    // Check if all possible subsets have been generated
    if (newSubsets.length === 0) {
      allFound = true;
    }
  }

  return { subsets, allFound };
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
