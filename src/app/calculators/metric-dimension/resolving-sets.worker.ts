/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const { n, table } = data;
  // const resolvingSets = calculateResolvingSets(n, table);
  const distinctSetsAgainstOrderedPairs = findEntriesOfDiscernibilityMatrix(n, table);
  let cartesianProd1stIndex = -1;
  let cartesianProd2ndIndex = -1;
  // const resolvingSets = conjunctionDisjunction(n, table);
  const zero = zerothIteration(distinctSetsAgainstOrderedPairs[0][1], distinctSetsAgainstOrderedPairs[1][1]);
  // const zero: {intersectionZero: number[], cartesianZero: number[][]} = {} as any
  // for (let i=0; i<distinctSetsAgainstOrderedPairs.length; i++){
  //   let doBreak = false;
  //   for (let j=i+1; j<distinctSetsAgainstOrderedPairs.length; j++){
  //     const currentZero = zerothIteration(distinctSetsAgainstOrderedPairs[i][1], distinctSetsAgainstOrderedPairs[j][1]);
  //     console.log(currentZero.cartesianZero)
  //     if (currentZero.cartesianZero.length){
  //       zero.cartesianZero = currentZero.cartesianZero;
  //       zero.intersectionZero = currentZero.intersectionZero;
  //       doBreak = true;
  //       cartesianProd1stIndex = i;
  //       cartesianProd2ndIndex = j;
  //       j = distinctSetsAgainstOrderedPairs.length
  //     }
  //   }
  //   console.log(zero.cartesianZero)
  //   if (doBreak) break;
  // }

  // console.log('distinctSetsAgainstOrderedPairs-Before', structuredClone(distinctSetsAgainstOrderedPairs))
  //
  // distinctSetsAgainstOrderedPairs.splice(cartesianProd1stIndex, 1);
  // distinctSetsAgainstOrderedPairs.splice(cartesianProd2ndIndex, 1);
  //
  // console.log('distinctSetsAgainstOrderedPairs-After', distinctSetsAgainstOrderedPairs)

  let intersection = zero.intersectionZero;
  let cartesian = zero.cartesianZero;
  console.log('zero intersection', intersection)
  console.log('zero cartesian', cartesian)
  for (let i= 2; i< distinctSetsAgainstOrderedPairs.length; i++){
    console.log(`iteration no. ${i-1}`)
  const iterationResult = iterations(intersection, cartesian, distinctSetsAgainstOrderedPairs[i][1]);
  intersection = iterationResult.nextIntersection;
  cartesian = iterationResult.nextCartesianProduct;
  }

  const minimalResolvingSets = [...intersection.map(e=> [e]), ...cartesian.map(e=> [e])];











  console.log(minimalResolvingSets)
  postMessage({ resolvingSets: distinctSetsAgainstOrderedPairs });
});

function findEntriesOfDiscernibilityMatrix(n: number, table: any[][]){
  const resolvants = [];

  for (let i = 1; i < n; i++){

    for (let j = i+1; j <= n; j++){
      const orderPair = [i, j];

      const resolvent = [];

      for (let [index, row] of table.entries()){
        if (row[i-1] !== row[j-1]){
          resolvent.push(index+1);
        }
      }

      resolvants.push([`(${orderPair[0]}, ${orderPair[1]})`, resolvent])
    }

  }

  return getDistinctPairs(resolvants);
}

function getDistinctPairs(arr: [string, number[]][]): [string, number[]][] {
  const distinctPairs: [string, number[]][] = [];

  function arraysAreEqual(arr1: number[], arr2: number[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  for (const pair of arr) {
    const [, value] = pair;
    let isUnique = true;

    for (const distinctPair of distinctPairs) {
      const [, distinctValue] = distinctPair;

      if (arraysAreEqual(value, distinctValue)) {
        isUnique = false;
        break;
      }
    }

    if (isUnique) {
      distinctPairs.push(pair);
    }
  }

  return distinctPairs;
}

function zerothIteration(setA: number[], setB: number[]) {
  // Take intersection of A and B
  // const largerSet = setA.length >= setB.length ? setA : setB;
  const A_intersection_B = arrayIntersection(setA, setB);
  const A_minus_A_intersection_B = arrayDifference(setA, A_intersection_B);
  const B_minus_A_intersection_B = arrayDifference(setB, A_intersection_B);
  // const cartesianProd = cartesianProduct(A_minus_A_intersection_B, B_minus_A_intersection_B);
  let cartesianProd: number[][] = []
  console.log(setA)
  console.log(setB)
  console.log(A_intersection_B)
  console.log(A_minus_A_intersection_B)
  console.log(B_minus_A_intersection_B)
  if (!B_minus_A_intersection_B.length){
    cartesianProd = A_minus_A_intersection_B.map(e=> [e])
  }
  if (!A_minus_A_intersection_B.length){
    cartesianProd = B_minus_A_intersection_B.map(e=> [e])
  }

  if (B_minus_A_intersection_B.length && A_minus_A_intersection_B.length){
  A_minus_A_intersection_B.forEach(e=> B_minus_A_intersection_B.forEach(el=> cartesianProd.push(arrayUnion([e], [el]))))
  B_minus_A_intersection_B.forEach(e=> A_minus_A_intersection_B.forEach(el=> cartesianProd.push(arrayUnion([e], [el]))))
  }
  console.log('cartesianProd', cartesianProd)
  cartesianProd = getDistinctArrays(cartesianProd);
  console.log('cartesianProd', cartesianProd)

  return {intersectionZero: A_intersection_B, cartesianZero: cartesianProd};
}

function iterations(
  previousIntersection: number[],
  previousCartesianProduct: number[][],
  nextSet: number[]
) {
  console.log('next set', nextSet)
  // Calculate the next intersection
  const nextIntersection = previousIntersection.filter(e => nextSet.some(el => el == e));
  console.log('Next Intersection:', nextIntersection);

  let nextCartesianProduct: number[][] = [];

  // Calculate the difference between nextSet and the next intersection
  const differenceOfNextSetAndNextIntersection = arrayDifference(nextSet, nextIntersection); // A3Dash
  console.log('Next Set minus Next Intersection:', differenceOfNextSetAndNextIntersection);

  for (let set of previousCartesianProduct) {
    // Calculate the intersection between the set and the difference calculated above
    const intersect = arrayIntersection(set, differenceOfNextSetAndNextIntersection); // set int A3Dash
    console.log('Intersect:', intersect);

    // // Create singletons from the intersection
    // const singletons = intersect.map(i => [i]);
    // console.log('Singletons:', singletons);

    // Calculate differences needed for Cartesian product calculation
    const nextSet_minus_differenceOfNextSetAndNextIntersection = arrayDifference(differenceOfNextSetAndNextIntersection, intersect); //A3Dash - set int A3Dash
    // const set_minus_intersect = arrayDifference(set, intersect);
    // console.log('set_minus_intersect', set_minus_intersect)
    console.log(nextSet_minus_differenceOfNextSetAndNextIntersection)

    if (!nextSet_minus_differenceOfNextSetAndNextIntersection.length){
      nextCartesianProduct.push(set)
    }
    else {
      // Generate the next Cartesian product
      nextSet_minus_differenceOfNextSetAndNextIntersection.forEach(e => {
        const unionResult = arrayUnion([e], set);
        nextCartesianProduct.push(unionResult);
        console.log('Union Result:', unionResult);
      });

      // Filter out proper supersets
      nextCartesianProduct = nextCartesianProduct.filter(e => !isProperSupersetOfAny(e, nextCartesianProduct));
      console.log('Filtered Next Cartesian Product:', nextCartesianProduct);
    }

  }

  console.log(nextCartesianProduct)

  // Final filtering to ensure only proper supersets are retained
  nextCartesianProduct = nextCartesianProduct.filter(e => !isProperSupersetOfAny(e, nextCartesianProduct));
  console.log('Final Next Cartesian Product:', nextCartesianProduct);

  return { nextIntersection, nextCartesianProduct };
}
function arrayUnion(arr1: number[], arr2: number[]): number[] {
  return Array.from(new Set([...arr1, ...arr2]));
}

function isProperSupersetOfAny(subset: number[], resolvingSets: number[][]): boolean {
  for (const set of resolvingSets) {
    if (isProperSuperset(subset, set)) {
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
function cartesianProduct(arr1: number[], arr2: number[]): number[][] {
  const result: number[][] = [];
  const seen = new Set<string>();

  arr1.forEach(num1 => {
    arr2.forEach(num2 => {
      const pair = [num1, num2].sort((a, b) => a - b); // Sort the pair to ensure [1, 2] and [2, 1] are treated the same
      const pairKey = pair.join(','); // Create a unique string key for the pair

      if (!seen.has(pairKey)) {
        seen.add(pairKey);
        result.push(pair);
      }
    });
  });

  return result;
}

function arrayIntersection(arr1: number[], arr2: number[]): number[] {
  return arr1.filter(value => arr2.includes(value));
}

function arrayDifference(arr1: number[], arr2: number[]): number[] {
  return arr1.filter(value => !arr2.includes(value));
}

function getDistinctArrays<T>(arrays: T[][]): T[][] {
  const distinctArrays: T[][] = [];

  function arraysAreEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1[1].length !== arr2[1].length) {
      return false;
    }
    for (let i = 0; i < arr1[1].length; i++) {
      if (arr1[i][1] !== arr2[i][1]) {
        return false;
      }
    }
    return true;
  }

  for (const array of arrays) {
    let isUnique = true;
    for (const distinctArray of distinctArrays) {
      if (arraysAreEqual(array, distinctArray)) {
        isUnique = false;
        break;
      }
    }
    if (isUnique) {
      distinctArrays.push(array);
    }
  }

  return distinctArrays;
}

//////////////////////////////////////////////////////////////////////

// function conjunctionDisjunction(n: number, table: any[][]){
//   let discernibilityMatrixEntries = findEntriesOfDiscernibilityMatrix(n, table);
//
//   console.log(discernibilityMatrixEntries)
//
//   discernibilityMatrixEntries = getDistinctPairs(discernibilityMatrixEntries);
//
//   console.log(discernibilityMatrixEntries)
//
//   for (let i=0; i<discernibilityMatrixEntries.length; i++){
//     const currentElement = discernibilityMatrixEntries[i];
//
//
//   }
//
// }
//
//
// function getDistinctObjects<T>(objects: { [key: string]: T[] }[]): { [key: string]: T[] }[] {
//   const distinctObjects: { [key: string]: T[] }[] = [];
//
//   function arraysAreEqual(arr1: T[], arr2: T[]): boolean {
//     if (arr1.length !== arr2.length) {
//       return false;
//     }
//     for (let i = 0; i < arr1.length; i++) {
//       if (arr1[i] !== arr2[i]) {
//         return false;
//       }
//     }
//     return true;
//   }
//
//   for (const obj of objects) {
//     const objKey = Object.keys(obj)[0];
//     const objValue = obj[objKey];
//     let isUnique = true;
//
//     for (const distinctObj of distinctObjects) {
//       const distinctObjKey = Object.keys(distinctObj)[0];
//       const distinctObjValue = distinctObj[distinctObjKey];
//
//       if (arraysAreEqual(objValue, distinctObjValue)) {
//         isUnique = false;
//         break;
//       }
//     }
//
//     if (isUnique) {
//       distinctObjects.push(obj);
//     }
//   }
//
//   return distinctObjects;
// }
//
// function getDistinctArrays<T>(arrays: T[][]): T[][] {
//   const distinctArrays: T[][] = [];
//
//   function arraysAreEqual(arr1: any[], arr2: any[]): boolean {
//     if (arr1[1].length !== arr2[1].length) {
//       return false;
//     }
//     for (let i = 0; i < arr1[1].length; i++) {
//       if (arr1[i][1] !== arr2[i][1]) {
//         return false;
//       }
//     }
//     return true;
//   }
//
//   for (const array of arrays) {
//     let isUnique = true;
//     for (const distinctArray of distinctArrays) {
//       if (arraysAreEqual(array, distinctArray)) {
//         isUnique = false;
//         break;
//       }
//     }
//     if (isUnique) {
//       distinctArrays.push(array);
//     }
//   }
//
//   return distinctArrays;
// }
//
// function calculateResolvingSets(n: number, table: (number | null)[][]): string[][] {
//   const vertices = Array.from({ length: n }, (_, i) => i + 1);
//   const allSubsets = getAllSubsets(vertices);
//   const resolvingSets: string[][] = [];
//
//   for (const subset of allSubsets) {
//     if (isResolvingSet(subset, table)) {
//       resolvingSets.push(subset.map(v => `v${v}`).sort());
//     }
//   }
//
//   return resolvingSets;
// }
//
// function arraysAreEqual<T>(arr1: T[], arr2: T[]): boolean {
//   // Check if the lengths of the arrays are different
//   if (arr1.length !== arr2.length) {
//     return false;
//   }
//
//   // Check each element for equality
//   for (let i = 0; i < arr1.length; i++) {
//     if (arr1[i] !== arr2[i]) {
//       return false;
//     }
//   }
//
//   return true;
// }
//
// function getAllSubsets(arr: number[]): number[][] {
//   return arr.reduce<number[][]>(
//     (subsets, value) => subsets.concat(subsets.map(set => [value, ...set])),
//     [[]]
//   );
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
