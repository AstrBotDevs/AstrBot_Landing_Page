export function hashCode(token: string): number {
  let hash = 0;
  if (token.length === 0) return hash;
  for (let i = 0; i < token.length; i++) {
    hash = ((hash << 5) - hash) + token.charCodeAt(i);
    hash |= 0; 
  }
  return hash;
}

export function makeRandomBanner(token: string, width = 600, height = 140): string {
  if (typeof document === "undefined") return ""; // 仅在浏览器端生成

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 计算颜色
  const codes = token.split("").map((ch) => ch.charCodeAt(0));
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < codes.length; i++) {
    r = (r + codes[i] * 1) % 256;
    g = (g + codes[i] * 2) % 256;
    b = (b + codes[i] * 3) % 256;
  }

  const hash = hashCode(token);
  const cols = 5;
  const rows = 5;
  const cellW = Math.ceil(width / cols);
  const cellH = Math.ceil(height / rows);

  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

  for (let i = 0; i < 15; ++i) {
    const col = Math.floor(i / rows); 
    const row = i % rows;           
    const bit = (hash >> i) & 1;
    if (bit) {
      ctx.fillRect(col * cellW, row * cellH, cellW, cellH);
      if (i < 10) {
        const mirrorCol = (cols - 1) - col;
        ctx.fillRect(mirrorCol * cellW, row * cellH, cellW, cellH);
      }
    }
  }

  return canvas.toDataURL("image/png");
}
