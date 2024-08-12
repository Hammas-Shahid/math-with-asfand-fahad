/// <reference lib="webworker" />

function bucketSortByLength(arr: any[][], maxLength: number): any[][] {
  // Create an array of empty buckets
  const buckets: any[][][] = Array.from({ length: maxLength + 1 }, () => []);

  // Distribute the sets into the buckets based on their length
  for (let i = 0; i < arr.length; i++) {
    buckets[arr[i].length].push(arr[i]);
  }

  // Concatenate all buckets to get the sorted array
  return [].concat(...buckets);
}

addEventListener('message', ({ data }) => {
  const { n, table } = data;
  console.log('Start: ', new Date());

  let allFound = false;
  const vertices = getVertices(n);

  let minimalResolvingSetsAtStep0 = getUptoXResolvingSubsets(vertices, table);

  while (!allFound) {
    console.log('Iteration started');
    let { filteredRefinedResolvingSets, allFound: currentAllFound } = getUptoXResolvingSubsetsForIterations(vertices, minimalResolvingSetsAtStep0, table);

    minimalResolvingSetsAtStep0.push(...filteredRefinedResolvingSets);
    allFound = currentAllFound;
    console.log('Iteration completed, found:', filteredRefinedResolvingSets.length);
  }

  console.log('Final Result', minimalResolvingSetsAtStep0);

  postMessage({
    resolvingSets: minimalResolvingSetsAtStep0,
    metricDimension: minimalResolvingSetsAtStep0[0].length,
  });

  console.log('End: ', new Date());

  function getVertices(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }

  function* subsetGenerator<T>(array: T[]): Generator<T[], void, unknown> {
    const subsets: T[][] = [[]]; // Start with the empty subset

    for (const value of array) {
      const currentLength = subsets.length;
      for (let i = 0; i < currentLength; i++) {
        const newSubset = [...subsets[i], value];
        yield newSubset;
        subsets.push(newSubset);
      }
    }
  }

  function getUptoXResolvingSubsetsForIterations(array: any[], resolvingSets: any[][], table: (number | null)[][], x: number = 100000) {
    const filteredSets: any[][] = []; // Start with an empty array to collect resolving sets
    const filteredResolvingSets: any[][] = [];
    const filteredRefinedResolvingSets: any[][] = [];

    const generator = subsetGenerator(array);

    console.log(resolvingSets.length)

    let count = 0; // Track the number of resolving sets found
    let allFound = true; // Assume all subsets will be found unless broken early

    for (let subset of generator) {
      if (count >= x) {
        allFound = false; // Subsets were limited by x
        break;
      }
      if (!isSupersetOfAny(subset, resolvingSets)) {
        filteredSets.push(subset);
        count++;
      }
    }

    console.log('All resolving sets before filtering:', filteredSets);

    for (let set of filteredSets) {
      if (!isResolvingSet(set, table)) {
        filteredResolvingSets.push(set);
      }
    }

    const sortedResolvingSets = bucketSortByLength(filteredResolvingSets, array.length);

    for (let set of sortedResolvingSets) {
      if (!isSupersetOfAny(set, filteredRefinedResolvingSets)) {
        filteredRefinedResolvingSets.push(set);
      }
    }

    console.log('Minimal resolving sets after filtering:', filteredRefinedResolvingSets);

    return { filteredRefinedResolvingSets, allFound };
  }

  function getUptoXResolvingSubsets(array: any[], table: (number | null)[][], x: number = 1000000) {
    const resolvingSets: any[][] = []; // Start with an empty array to collect resolving sets

    const generator = subsetGenerator(array);

    let count = 0; // Track the number of resolving sets found
    for (let subset of generator) {
      if (count >= x) break;
      if (isResolvingSet(subset, table)) {
        resolvingSets.push(subset);
        count++;
      }
    }

    console.log('All resolving sets before filtering at 0:', resolvingSets);

    // Use bucket sort by length to sort the resolving sets
    const sortedResolvingSets = bucketSortByLength(resolvingSets, n);

    // Build the set of minimal resolving sets
    const minimalResolvingSets: any[][] = [];

    for (let set of sortedResolvingSets) {
      if (!isSupersetOfAny(set, minimalResolvingSets)) {
        minimalResolvingSets.push(set);
      }
    }

    console.log('Minimal resolving sets after filtering at 0:', minimalResolvingSets);

    return minimalResolvingSets;
  }

  function isResolvingSet(subset: number[], table: (number | null)[][]): boolean {
    const distances = new Set<string>();

    for (let i = 0; i < table.length; i++) {
      const distanceVector = subset.map(j => table[i][j - 1]).join(',');
      if (distances.has(distanceVector)) {
        return false; // Early termination if a conflict is detected
      }
      distances.add(distanceVector);
    }

    return true;
  }

  function isSupersetOfAny(set: any[], sets: any[][]): boolean {
    for (let otherSet of sets) {
      if (isSuperset(set, otherSet)) {
        return true;
      }
    }
    return false;
  }

  function isSuperset(superset: any[], subset: any[]): boolean {
    return subset.every(value => superset.includes(value));
  }
});
///////////////////////////////////////////////////////////////
//   let isAllFound = false;
//   let iterationMinimumResolvingNumber = undefined;
//   let resolvingSets: string[][] = [];
//   let metricDimension = n;
//   let previousResolvingSetsCount = 0;
//
//   while (!isAllFound) {
//     const { resolvingSets: newResolvingSets, allFound: currentAllFound, metricDimension: currentMetricDimension } =
//       calculateResolvingSets(n, table);
//
//     isAllFound = currentAllFound;
//     metricDimension = currentMetricDimension;
//
//     if (newResolvingSets.length === previousResolvingSetsCount) {
//       isAllFound = true;
//     } else {
//       previousResolvingSetsCount = newResolvingSets.length;
//       // iterationMinimumResolvingNumber = metricDimension;
//     }
//
//     resolvingSets = [...resolvingSets, ...newResolvingSets];
//   }
//
//   const finalResolvingSets = findMinimalCardinalitySets(resolvingSets, metricDimension);
//
//   // console.log('End: ', new Date());
//   postMessage({ resolvingSets:
//     finalResolvingSets, metricDimension });
// });
//
// function calculateResolvingSets(n: number, table: (number | null)[][], maxSubsetLength?: number) {
//   const vertices = Array.from({ length: n }, (_, i) => i + 1);
//   const { subsets: allSubsets, allFound } = getUpto5LacSubsets(vertices);
//
//   let resolvingSets: string[][] = [];
//   let metricDimension = n;
//
//   for (const subset of allSubsets) {
//     if (isResolvingSet(subset, table)) {
//       // metricDimension = Math.min(metricDimension, subset.length);
//       resolvingSets.push(subset.map(v => `v${v}`).sort());
//     }
//   }
//
//   return { resolvingSets, allFound, metricDimension };
// }
//
// function getUpto5LacSubsets(arr: number[], maxSubsetLength?: number) {
//   let subsets: number[][] = [[]]; // Start with an empty subset
//   let allFound = false;
//
//   for (const value of arr) {
//     const newSubsets = [];
//     for (const subset of subsets) {
//       const subsetToCreate = [...subset, value];
//       // if (!maxSubsetLength || subsetToCreate.length <= maxSubsetLength) {
//         newSubsets.push(subsetToCreate);
//       // }
//       if (subsets.length + newSubsets.length >= 100000) {
//         return { subsets: subsets.concat(newSubsets.slice(0, 100000 - subsets.length)), allFound: true };
//       }
//     }
//     subsets = subsets.concat(newSubsets);
//     if (newSubsets.length === 0 || subsets.length < 100000) {
//       allFound = true;
//     }
//   }
//
//   return { subsets, allFound };
// }
//
// function isResolvingSet(subset: number[], table: (number | null)[][]): boolean {
//   const distances = new Set<string>();
//
//   for (let i = 0; i < table.length; i++) {
//     const distanceVector = subset.map(j => table[i][j - 1]).join(',');
//     if (distances.has(distanceVector)) {
//       return false;
//     }
//     distances.add(distanceVector);
//   }
//
//   return true;
// }

function findMinimalCardinalitySets(resolvingSets: string[][], metricDimension: number) {
  // Filter out only those resolving sets with the minimal cardinality (i.e., metricDimension)
  return resolvingSets.filter(set => set.length === metricDimension);
}

// function isSupersetOfAny(subset: number[], resolvingSets: any[][]): boolean {
//   for (const set of resolvingSets) {
//     // const setNumbers = set.map(s => parseInt(s.replace('v', ''), 10));
//     const setNumbers = set;
//     if (isSuperset(subset, setNumbers)) {
//       return true;
//     }
//   }
//   return false;
// }
//
// function isSuperset(set: number[], subset: number[]): boolean {
//   const setSet = new Set(set);
//   return subset.every(value => setSet.has(value));
// }

function isProperSupersetOfAny(subset: number[], resolvingSets: string[][]): boolean {
  for (const set of resolvingSets) {
    const setNumbers = set.map(s => parseInt(s.replace('v', ''), 10));
    if (isProperSuperset(subset, setNumbers)) {
      return true;
    }
  }
  return false;
}

function isProperSuperset(superset: number[], subset: number[]): boolean {
  if (superset.length <= subset.length) {
    return false;
  }
  const supersetSet = new Set(superset);
  return subset.every(value => supersetSet.has(value));
}
