export function zeroDivisors(number: number) {
  let dev = [];
  for (let i = 2; i < number; i++) {
    for (let j = 2; j < number; j++) {
      if ((i * j) % number === 0) {
        dev.push(i);
        dev.push(j);
      }
    }
  }
  return [...new Set(dev)].sort((a, b) => a - b);
}

export function getDivisors(number: number) {
  let dev = [];
  for (let i = 2; i < number; i++) {
    for (let j = 2; j < number; j++) {
      if (number % (i * j) === 0) {
        dev.push(i);
        dev.push(j);
      }
    }
  }
  return [...new Set(dev)].sort((a, b) => a - b);
}

export function getGCD(a: number, b: number) {
  let i = a;
  while (i >= 2) {
    if (a % i === 0 && b % i === 0) {
      return i;
    }
    i--;
  }
  return 1;
}

export function isPrime(num: number): boolean {
  if (num <= 1) return false; // numbers less than or equal to 1 are not prime numbers
  if (num <= 3) return true;  // 2 and 3 are prime numbers

  // This is checked so that we can skip middle five numbers in below loop
  if (num % 2 === 0 || num % 3 === 0) return false;

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }

  return true;
}

export function arraysEqual(arr1: any, arr2: any) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

export function toSubscript(num: number): string {
  const subscriptMap: { [key: string]: string } = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉'
  };
  return num.toString().split('').map(digit => subscriptMap[digit]).join('');
}

export function getClassMembersOfDivisor(divisor: number, vertices: number[]){
  const n = vertices.length;
  const classMembers = [];
  for (let vertex of vertices){
  if (vertex === divisor) continue;
    if (getGCD(n, vertex) === divisor) {
    classMembers.push(vertex);
  }
  }
  return classMembers;
}
