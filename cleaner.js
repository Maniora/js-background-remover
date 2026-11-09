import sharp from "sharp";

/**
 * Removes white/light halos and tightens edges on cutouts
 */
export async function cleanEdges(buffer, options = {}) {
  const threshold = options.threshold ?? 100; // Drops alpha below this (cuts hazy halo)
  const defringeAmount = options.defringe ?? 0.8; // Clamps edge colors back to foreground

  const { data, info } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.from(data);

  for (let i = 0; i < out.length; i += 4) {
    let r = out[i];
    let g = out[i + 1];
    let b = out[i + 2];
    let a = out[i + 3];

    if (a === 0) continue;

    // 1. Cut off faint outer haze (removes 2-4px white ghosting)
    if (a < threshold) {
      out[i + 3] = 0;
      continue;
    }

    // 2. Normalize and sharpen alpha curve
    const normalized = (a - threshold) / (255 - threshold);
    const sharpenedAlpha = Math.min(255, Math.max(0, Math.round(Math.pow(normalized, 1.15) * 255)));
    out[i + 3] = sharpenedAlpha;

    // 3. Defringe: if edge pixel is contaminated by bright background, reduce brightness
    if (a < 240) {
      const alphaRatio = a / 255;
      const bgBleed = (1 - alphaRatio) * defringeAmount;

      // Darken edge RGB if it has background bleed
      out[i] = Math.max(0, Math.round(r * (1 - bgBleed * 0.7)));
      out[i + 1] = Math.max(0, Math.round(g * (1 - bgBleed * 0.7)));
      out[i + 2] = Math.max(0, Math.round(b * (1 - bgBleed * 0.7)));
    }
  }

  return await sharp(out, { raw: { width, height, channels } }).png().toBuffer();
}

