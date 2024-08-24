// /// <reference lib="webworker" />
//
//
// addEventListener('message', async ({ data }) => {
//   const { n, table } = data;
//   console.log('Start: ', new Date());
//
//   const distinctSetsAgainstOrderedPairs = findEntriesOfDiscernibilityMatrix(n, table);
//
//   let allMinimalResolvingSets = [];
//   const chunkSize = 1; // You can adjust this based on your needs
//   const pairPromises = [];
//
//   // Iterate over pairs in chunks
//   // for (let i = 0; i < distinctSetsAgainstOrderedPairs.length; i++) {
//   //   for (let j = i + 1; j < distinctSetsAgainstOrderedPairs.length; j++) {
//   //     // Add the pair processing to the promise array
//   //     pairPromises.push(
//   //       processPair(distinctSetsAgainstOrderedPairs, i, j)
//   //     );
//   //
//   //     // When the chunk size is reached, process the chunk
//   //     if (pairPromises.length >= chunkSize) {
//   //       console.log(new Date())
//   //       const chunkResults = await Promise.all(pairPromises);
//   //       console.log(new Date())
//   //       allMinimalResolvingSets.push(...chunkResults.flat());
//   //       console.log(allMinimalResolvingSets.length)
//   //       pairPromises.length = 0; // Clear the array for the next chunk
//   //     }
//   //   }
//   // }
//
//   pairPromises.push(processPair(distinctSetsAgainstOrderedPairs, distinctSetsAgainstOrderedPairs.length-1, 0));
//
//   for (let i = 0; i < distinctSetsAgainstOrderedPairs.length - 1; i++) {
//     // for (let j = i + 1; j < distinctSetsAgainstOrderedPairs.length; j++) {
//       // Add the pair processing to the promise array
//       pairPromises.push(
//         processPair(distinctSetsAgainstOrderedPairs, i, i+1)
//       );
//
//       // When the chunk size is reached, process the chunk
//       if (pairPromises.length >= chunkSize) {
//         console.log(new Date())
//         const chunkResults = await Promise.all(pairPromises);
//         console.log(new Date())
//         allMinimalResolvingSets.push(...chunkResults.flat());
//         console.log(allMinimalResolvingSets.length)
//         pairPromises.length = 0; // Clear the array for the next chunk
//       }
//     // }
//   }
//
//   // Process any remaining pairs
//   if (pairPromises.length > 0) {
//     const remainingResults = await Promise.all(pairPromises);
//     allMinimalResolvingSets.push(...remainingResults.flat());
//   }
//
//   // Filter out duplicates to get distinct minimal resolving sets
//   const distinctMinimalResolvingSets = getDistinctArrays(allMinimalResolvingSets);
//   const filteredDistinctMinimalResolvingSets = distinctMinimalResolvingSets.filter(e => !isProperSupersetOfAny(e, distinctMinimalResolvingSets));
//
//   console.log('Final Minimal Resolving Sets (Distinct):', filteredDistinctMinimalResolvingSets);
//   console.log('End: ', new Date());
//
//   postMessage({ resolvingSets: filteredDistinctMinimalResolvingSets });
// });
//
// async function processPair(distinctSetsAgainstOrderedPairs, i, j) {
//   // Compute the zeroth iteration for each pair
//   console.log(i,j)
//   const zero = zerothIteration(distinctSetsAgainstOrderedPairs[i][1], distinctSetsAgainstOrderedPairs[j][1]);
//   let intersection = zero.intersectionZero;
//   let cartesian = zero.cartesianZero;
//
//   // Now, iterate over all remaining sets to refine the resolving sets
//   for (let k = 0; k < distinctSetsAgainstOrderedPairs.length; k++) {
//     if (k !== i && k !== j) { // Skip the sets that are already considered
//       const iterationResult = iterations(intersection, cartesian, distinctSetsAgainstOrderedPairs[k][1]);
//       intersection = iterationResult.nextIntersection;
//       cartesian = iterationResult.nextCartesianProduct;
//     }
//   }
//
//   // Combine intersection and Cartesian products as minimal resolving sets
//   const minimalResolvingSets = [...intersection.map(e => [e]), ...cartesian];
//   return minimalResolvingSets;
// }
//
// function findEntriesOfDiscernibilityMatrix(n, table) {
//   const resolvants = [];
//   const resolvantsAgainstPairs = [];
//
//   for (let i = 1; i < n; i++) {
//     for (let j = i + 1; j <= n; j++) {
//       const resolvent = [];
//       for (let [index, row] of table.entries()) {
//         if (row[i - 1] !== row[j - 1]) {
//           resolvent.push(index + 1);
//         }
//       }
//       resolvantsAgainstPairs.push([`(${i}, ${j})`, resolvent]);
//       resolvants.push(resolvent);
//     }
//   }
//
//   const distinctPairs = getDistinctPairs(resolvantsAgainstPairs);
//   console.log(distinctPairs.length)
//   const filteredDistinctPairs = [];
//   for (let pair of distinctPairs) {
//     if (!isProperSupersetOfAny(pair[1], resolvants)){
//       filteredDistinctPairs.push(pair);
//     }
//   }
//   console.log(filteredDistinctPairs.length)
//   return filteredDistinctPairs;
// }
//
// function getDistinctPairs(arr) {
//   const distinctPairs = [];
//   for (const pair of arr) {
//     const [, value] = pair;
//     if (!distinctPairs.some(([_, v]) => arraysAreEqual(v, value))) {
//       distinctPairs.push(pair);
//     }
//   }
//   return distinctPairs;
// }
//
// function zerothIteration(setA, setB) {
//   let cartesianProd = [];
//   // console.log('zerothIteration: Input Sets:', { setA, setB });
//
//   const A_intersection_B = arrayIntersection(setA, setB);
//   // console.log('Intersection of A and B:', A_intersection_B);
//
//   const A_minus_A_intersection_B = arrayDifference(setA, A_intersection_B);
//   // console.log('A minus Intersection:', A_minus_A_intersection_B);
//   if (A_minus_A_intersection_B.length){
//     A_minus_A_intersection_B.forEach(e=> {
//       setB.forEach(el=> cartesianProd.push([e, el]));
//     })
//   }
//
//   const B_minus_A_intersection_B = arrayDifference(setB, A_intersection_B);
//   // console.log('B minus Intersection:', B_minus_A_intersection_B);
//
//   if (B_minus_A_intersection_B.length){
//     B_minus_A_intersection_B.forEach(e=> {
//       setA.forEach(el=> cartesianProd.push([e, el]));
//     })
//   }
//
//
//   // if (!B_minus_A_intersection_B.length) {
//   //   cartesianProd = A_minus_A_intersection_B.map(e => [e]);
//   //   console.log('Cartesian Product when B - Intersection is empty:', cartesianProd);
//   // }
//   // if (!A_minus_A_intersection_B.length) {
//   //   cartesianProd = B_minus_A_intersection_B.map(e => [e]);
//   //   console.log('Cartesian Product when A - Intersection is empty:', cartesianProd);
//   // }
//   // if (B_minus_A_intersection_B.length && A_minus_A_intersection_B.length) {
//   //   A_minus_A_intersection_B.forEach(e =>
//   //     B_minus_A_intersection_B.forEach(el => {
//   //       const union = arrayUnion([e], [el]);
//   //       cartesianProd.push(union);
//   //       console.log('Adding to Cartesian Product:', union);
//   //     })
//   //   );
//   // }
//
//   cartesianProd = getDistinctArrays(cartesianProd);
//   // console.log('Final Cartesian Product after Deduplication:', cartesianProd);
//
//   return { intersectionZero: A_intersection_B, cartesianZero: cartesianProd };
// }
//
// function iterations(previousIntersection, previousCartesianProduct, nextSet) {
//   // console.log('iterations: Input:', { previousIntersection, previousCartesianProduct, nextSet });
//
//   const nextIntersection = previousIntersection.filter(e => nextSet.includes(e));
//   // console.log('Next Intersection:', nextIntersection);
//
//   let nextCartesianProduct = [];
//   const differenceOfNextSetAndNextIntersection = arrayDifference(nextSet, nextIntersection);
//   // console.log('Next Set minus Next Intersection:', differenceOfNextSetAndNextIntersection);
//
//   for (let set of previousCartesianProduct) {
//     const intersect = arrayIntersection(set, differenceOfNextSetAndNextIntersection);
//     // console.log('Intersection with Previous Cartesian Set:', intersect);
//
//     const differenceOfNextSetAndNextIntersection_minus_intersect = arrayDifference(differenceOfNextSetAndNextIntersection, intersect);
//     // console.log('Difference after Intersection:', differenceOfNextSetAndNextIntersection_minus_intersect);
//
//     if (!differenceOfNextSetAndNextIntersection_minus_intersect.length || arrayIntersection(set, nextSet).length) {
//       nextCartesianProduct.push(set);
//       // console.log('Pushing entire set to Next Cartesian Product:', set);
//     } else {
//       differenceOfNextSetAndNextIntersection_minus_intersect.forEach(e => {
//         const unionResult = arrayUnion([e], set);
//         nextCartesianProduct.push(unionResult);
//         // console.log('Pushing Union Result to Next Cartesian Product:', unionResult);
//       });
//     }
//   }
//
//   nextCartesianProduct = nextCartesianProduct.filter(e => !isProperSupersetOfAny(e, nextCartesianProduct));
//   // console.log('Final Cartesian Product after Superset Filtering:', nextCartesianProduct);
//
//   return { nextIntersection, nextCartesianProduct };
// }
//
// function arrayUnion(arr1, arr2) {
//   return Array.from(new Set([...arr1, ...arr2]));
// }
//
// function isProperSupersetOfAny(subset, resolvingSets) {
//   return resolvingSets.some(set => isProperSuperset(subset, set));
// }
//
// function isProperSuperset(superset, subset) {
//   return superset.length > subset.length && subset.every(value => superset.includes(value));
// }
//
// function cartesianProduct(arr1, arr2) {
//   const result = [];
//   const seen = new Set();
//
//   arr1.forEach(num1 => {
//     arr2.forEach(num2 => {
//       const pair = [num1, num2].sort((a, b) => a - b);
//       const pairKey = pair.join(',');
//
//       if (!seen.has(pairKey)) {
//         seen.add(pairKey);
//         result.push(pair);
//       }
//     });
//   });
//
//   return result;
// }
//
// function arrayIntersection(arr1, arr2) {
//   return arr1.filter(value => arr2.includes(value));
// }
//
// function arrayDifference(arr1, arr2) {
//   return arr1.filter(value => !arr2.includes(value));
// }
//
// function getDistinctArrays(arrays) {
//   const distinctArrays = [];
//
//   arrays.forEach(array => {
//     if (!distinctArrays.some(distinctArray => arraysAreEqual(array, distinctArray))) {
//       distinctArrays.push(array);
//     }
//   });
//
//   return distinctArrays;
// }
//
// function arraysAreEqual(arr1, arr2) {
//   if (arr1.length !== arr2.length) return false;
//   const sortedArr1 = [...arr1].sort((a, b) => a - b);
//   const sortedArr2 = [...arr2].sort((a, b) => a - b);
//   return sortedArr1.every((value, index) => value === sortedArr2[index]);
// }
