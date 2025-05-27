/**
 * Search params are held as an array of two elements arrays where member 0 is the key and member 1 is value
 * This function extracts the values from the array and returns an object with the key as the property name and the value as the property value
 * Where a key has multiple values, the value is an array of values
 * 
 * @param {URLSearchParams} searchParams 
 */
export function extractExistingParams(searchParams: URLSearchParams) {
  const entries = Array.from(searchParams.entries());
  return entries.reduce((acc: any, a: any) => ((acc[a[0]] = acc[a[0]] || []).push(a[1]), acc), {});
}