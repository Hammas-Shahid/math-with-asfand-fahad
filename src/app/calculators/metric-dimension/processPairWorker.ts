/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const { distinctSetsAgainstOrderedPairs, i, j } = data;

  const zero = zerothIteration(distinctSetsAgainstOrderedPairs[i][1], distinctSetsAgainstOrderedPairs[j][1]);
  let intersection = zero.intersectionZero;
  let cartesian = zero.cartesianZero;

  for (let k = 0; k < distinctSetsAgainstOrderedPairs.length; k++) {
    if (k !== i && k !== j) {
      const iterationResult = iterations(intersection, cartesian, distinctSetsAgainstOrderedPairs[k][1]);
      intersection = iterationResult.nextIntersection;
      cartesian = iterationResult.nextCartesianProduct;
    }
  }

  const minimalResolvingSets = [...intersection.map(e => [e]), ...cartesian];
  postMessage(minimalResolvingSets);
});

function zerothIteration(setA: number[], setB: number[]) {
  let cartesianProd: number[][] = [];
  const A_intersection_B = arrayIntersection(setA, setB);

  const A_minus_A_intersection_B = arrayDifference(setA, A_intersection_B);
  if (A_minus_A_intersection_B.length) {
    A_minus_A_intersection_B.forEach(e => {
      setB.forEach(el => cartesianProd.push([e, el]));
    });
  }

  const B_minus_A_intersection_B = arrayDifference(setB, A_intersection_B);
  if (B_minus_A_intersection_B.length) {
    B_minus_A_intersection_B.forEach(e => {
      setA.forEach(el => cartesianProd.push([e, el]));
    });
  }

  cartesianProd = getDistinctArrays(cartesianProd);
  return { intersectionZero: A_intersection_B, cartesianZero: cartesianProd };
}

function iterations(previousIntersection: number[], previousCartesianProduct: number[][], nextSet: number[]) {
  const nextIntersection = previousIntersection.filter(e => nextSet.includes(e));
  let nextCartesianProduct: number[][] = [];
  const differenceOfNextSetAndNextIntersection = arrayDifference(nextSet, nextIntersection);

  for (let set of previousCartesianProduct) {
    const intersect = arrayIntersection(set, differenceOfNextSetAndNextIntersection);

    const differenceOfNextSetAndNextIntersection_minus_intersect = arrayDifference(differenceOfNextSetAndNextIntersection, intersect);

    if (!differenceOfNextSetAndNextIntersection_minus_intersect.length || arrayIntersection(set, nextSet).length) {
      nextCartesianProduct.push(set);
    } else {
      differenceOfNextSetAndNextIntersection_minus_intersect.forEach(e => {
        const unionResult = arrayUnion([e], set);
        nextCartesianProduct.push(unionResult);
      });
    }
  }

  nextCartesianProduct = nextCartesianProduct.filter(e => !isProperSupersetOfAny(e, nextCartesianProduct));
  return { nextIntersection, nextCartesianProduct };
}

function arrayUnion(arr1: number[], arr2: number[]) {
  return Array.from(new Set([...arr1, ...arr2]));
}

function isProperSupersetOfAny(subset: number[], resolvingSets: number[][]) {
  return resolvingSets.some(set => isProperSuperset(subset, set));
}

function isProperSuperset(superset: number[], subset: number[]) {
  return superset.length > subset.length && subset.every(value => superset.includes(value));
}

function arrayIntersection(arr1: number[], arr2: number[]) {
  return arr1.filter(value => arr2.includes(value));
}

function arrayDifference(arr1: number[], arr2: number[]) {
  return arr1.filter(value => !arr2.includes(value));
}

function getDistinctArrays(arrays: number[][]) {
  const distinctArrays: number[][] = [];

  arrays.forEach(array => {
    if (!distinctArrays.some(distinctArray => arraysAreEqual(array, distinctArray))) {
      distinctArrays.push(array);
    }
  });

  return distinctArrays;
}

function arraysAreEqual(arr1: number[], arr2: number[]) {
  if (arr1.length !== arr2.length) return false;
  const sortedArr1 = [...arr1].sort((a, b) => a - b);
  const sortedArr2 = [...arr2].sort((a, b) => a - b);
  return sortedArr1.every((value, index) => value === sortedArr2[index]);
}
