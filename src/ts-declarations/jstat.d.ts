declare module 'jstat' {
  export function studentt(p: number, df: number): number;
  export function cdf(x: number, df: number, sides: number): number;
}
