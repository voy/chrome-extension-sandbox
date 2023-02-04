export const groupBy = <T>(
  arr: T[],
  keyFn: (item: T) => string | undefined
): Map<string, T[]> => {
  const groups = new Map();
  arr.forEach((item) => {
    const key = keyFn(item);
    if (key) {
      groups.set(key, (groups.get(key) || []).concat([item]));
    }
  });
  return groups;
};
