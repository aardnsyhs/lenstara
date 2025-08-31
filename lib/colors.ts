export async function dominantColorFromUrl(
  url: string
): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      const x = c.getContext("2d")!;
      c.width = img.width;
      c.height = img.height;
      x.drawImage(img, 0, 0, 50, 50);
      const data = x.getImageData(0, 0, 50, 50).data;
      let r = 0,
        g = 0,
        b = 0,
        n = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        n++;
      }
      r = Math.round(r / n);
      g = Math.round(g / n);
      b = Math.round(b / n);
      resolve(
        `#${r.toString(16).padStart(2, "0")}${g
          .toString(16)
          .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
      );
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}
