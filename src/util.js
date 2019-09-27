export function sortBy(arr, property) {
  return arr.sort((a, b) => {
    return a[property].localeCompare(b[property]);
  });
}
