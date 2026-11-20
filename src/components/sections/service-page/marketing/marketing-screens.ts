import { CanvasTexture, SRGBColorSpace } from "three";

const ink = "#101225";

export function createScreen(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return { ctx, texture };
}

type Context = CanvasRenderingContext2D;

function text(ctx: Context, value: string, x: number, y: number, size: number, color = ink, weight = 600) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  ctx.fillText(value, x, y);
}

function panel(ctx: Context, x: number, y: number, w: number, h: number, radius: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();
}

export function drawScreenshot(
  ctx: Context,
  image: HTMLImageElement,
  phone = false,
  progress = 0,
  next?: { image: HTMLImageElement; opacity: number },
) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  if (phone) {
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 52);
    ctx.clip();
  }

  ctx.fillStyle = phone ? "#101519" : "#e8ecf0";
  ctx.fillRect(0, 0, width, height);

  const paint = (source: HTMLImageElement, opacity: number) => {
    const ratio = phone
      ? Math.max(width / source.naturalWidth, height / source.naturalHeight) * (1 + 0.045 * progress)
      : Math.min(width / source.naturalWidth, height / source.naturalHeight);
    const w = source.naturalWidth * ratio;
    const h = source.naturalHeight * ratio;
    ctx.globalAlpha = opacity;
    ctx.drawImage(source, (width - w) / 2, (height - h) * (phone ? progress : 0.5), w, h);
  };
  if (next?.opacity !== 1) paint(image, 1);
  if (next && next.opacity > 0) paint(next.image, next.opacity);
  ctx.globalAlpha = 1;
  if (phone) panel(ctx, width / 2 - 54, 11, 108, 27, 14, "#06070d");
  ctx.restore();
}

export function drawChip(ctx: Context, icon: string, label: string, tint: string, mono: string) {
  ctx.clearRect(0, 0, 356, 80);
  panel(ctx, 1, 1, 354, 78, 39, tint);
  text(ctx, icon, 24, 53, 34);
  ctx.font = `500 29px ${mono}, monospace`;
  ctx.fillText(label, 74, 51, 253);
}

export function drawHeart(ctx: Context) {
  panel(ctx, 2, 2, 76, 76, 38, "#ffd4e6");
  text(ctx, "♥", 20, 56, 43, "#d02358");
}
