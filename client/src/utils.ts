export function hexToRgb(hexList: string[]) {
  const list: number[][] = [];
  hexList.forEach((hex) => {
    const clearedHex = hex.replace(/^#/, "");
    let r = parseInt(clearedHex.substring(0, 2), 16);
    let g = parseInt(clearedHex.substring(2, 4), 16);
    let b = parseInt(clearedHex.substring(4, 6), 16);
    list.push([r, g, b]);
  });
  return list;
}
