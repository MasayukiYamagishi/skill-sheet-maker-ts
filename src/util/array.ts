/**
 * 任意の配列（mutableまたはreadonly）を指定した要素数ごとに分割して二次元配列として返す.
 *
 * @param array 分割対象の配列
 * @param size 何個ごとに分割するか（size≧1）
 * @return sizeごとに分割された配列の配列
 *
 * @example
 *  chunkArray([1,2,3,4,5,6,7], 3)
 *  // -> [[1,2,3], [4,5,6], [7]]
 */
export function chunkArray<T>(array: readonly T[], size: number): T[][] {
  if (size < 1) {
    throw new Error('chunkArray: size must be at least 1');
  }

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
