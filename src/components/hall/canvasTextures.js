import * as THREE from "three";

function wrapText(ctx, text, maxWidth) {
  const words = String(text).split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function fromCanvas(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

export function makeWoodTexture(color = "#5c4a2e") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 40; i++) {
    const y = i * 13 + Math.sin(i) * 4;
    ctx.strokeStyle = `rgba(0,0,0,${0.06 + (i % 5) * 0.02})`;
    ctx.lineWidth = 2 + (i % 3);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(160, y + 8, 320, y - 6, 512, y + 4);
    ctx.stroke();
  }
  const texture = fromCanvas(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 14);
  return texture;
}

export function makePlasterTexture(color = "#efe4c8") {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 600; i++) {
    ctx.fillStyle = `rgba(80,60,30,${Math.random() * 0.045})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  const texture = fromCanvas(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 4);
  return texture;
}

export function makeDoorPlaque(yearLabel, subtitle) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#2a2418";
  ctx.fillRect(0, 0, 512, 320);
  ctx.strokeStyle = "#c4a35a";
  ctx.lineWidth = 10;
  ctx.strokeRect(18, 18, 476, 284);
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 32, 448, 256);
  ctx.fillStyle = "#c4a35a";
  ctx.font = "700 84px 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.fillText(yearLabel, 256, 148);
  ctx.fillStyle = "#e8dcc0";
  ctx.font = "22px 'Times New Roman', serif";
  wrapText(ctx, subtitle, 400)
    .slice(0, 2)
    .forEach((line, i) => ctx.fillText(line, 256, 208 + i * 28));
  return fromCanvas(canvas);
}

export function makeInscription(title, subtitle) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 384;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f4ead0";
  ctx.font = "400 70px 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.fillText(title, 512, 150);
  ctx.font = "22px Helvetica, Arial, sans-serif";
  ctx.fillStyle = "rgba(244,234,208,0.8)";
  ctx.fillText(subtitle, 512, 214);
  ctx.strokeStyle = "#c4a35a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(260, 252);
  ctx.lineTo(764, 252);
  ctx.stroke();
  return fromCanvas(canvas);
}

export function makeEventPoster(event, yearLabel, paletteHex) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f7f1dc";
  ctx.fillRect(0, 0, 512, 768);
  ctx.fillStyle = paletteHex;
  ctx.fillRect(0, 0, 512, 88);
  ctx.fillRect(0, 680, 512, 88);
  ctx.strokeStyle = "#6a673b";
  ctx.lineWidth = 14;
  ctx.strokeRect(18, 18, 476, 732);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#c4a35a";
  ctx.strokeRect(36, 36, 440, 696);

  ctx.fillStyle = "#f7f1dc";
  ctx.font = "16px Helvetica, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("COMSATS LITERARY SOCIETY", 256, 56);
  ctx.fillText(yearLabel, 256, 732);

  ctx.fillStyle = "#111111";
  ctx.font = "400 40px 'Times New Roman', serif";
  wrapText(ctx, event.name, 380)
    .slice(0, 4)
    .forEach((line, i) => ctx.fillText(line, 256, 260 + i * 50));

  ctx.strokeStyle = "#6a673b";
  ctx.beginPath();
  ctx.moveTo(140, 470);
  ctx.lineTo(372, 470);
  ctx.stroke();

  ctx.fillStyle = "rgba(17,17,17,0.72)";
  ctx.font = "20px Helvetica, Arial, sans-serif";
  wrapText(ctx, event.note || "From the CLS archive.", 380)
    .slice(0, 6)
    .forEach((line, i) => ctx.fillText(line, 256, 520 + i * 26));

  return fromCanvas(canvas);
}

export function makePresidentCard(name, role) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#1e1a12";
  ctx.fillRect(0, 0, 512, 640);
  ctx.strokeStyle = "#c4a35a";
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 472, 600);
  ctx.fillStyle = "#3a3428";
  ctx.fillRect(80, 70, 352, 260);
  ctx.fillStyle = "#8a7a55";
  ctx.beginPath();
  ctx.arc(256, 190, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c4a35a";
  ctx.font = "16px Helvetica, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PRESIDENT", 256, 380);
  ctx.fillStyle = "#f4ead0";
  ctx.font = "400 30px 'Times New Roman', serif";
  wrapText(ctx, name, 400).forEach((line, i) => ctx.fillText(line, 256, 430 + i * 36));
  ctx.fillStyle = "rgba(244,234,208,0.65)";
  ctx.font = "18px Helvetica, Arial, sans-serif";
  wrapText(ctx, role, 400).forEach((line, i) => ctx.fillText(line, 256, 530 + i * 24));
  return fromCanvas(canvas);
}

export function paletteHex(color) {
  return `#${color.toString(16).padStart(6, "0")}`;
}
