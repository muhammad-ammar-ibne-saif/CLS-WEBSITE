import * as THREE from "three";

function wrap(ctx, text, maxWidth) {
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

function hexToRgb(hex) {
  const n = typeof hex === "number" ? hex : parseInt(String(hex).replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function silhouette(ctx, x, y, scale, t, reciter = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#0a0806";
  if (reciter) {
    const sway = Math.sin(t * 1.4) * 6;
    ctx.rotate(sway * 0.004);
    ctx.beginPath();
    ctx.ellipse(0, -78, 16, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-14, -58, 28, 70);
    ctx.save();
    ctx.rotate(-0.4 + Math.sin(t * 2.2) * 0.15);
    ctx.fillRect(10, -40, 36, 6);
    ctx.restore();
    ctx.fillRect(-22, 10, 16, 50);
    ctx.fillRect(4, 10, 16, 50);
  } else {
    ctx.beginPath();
    ctx.ellipse(0, -18, 11, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-16, -6, 32, 28);
  }
  ctx.restore();
}

export function createFilm({
  title,
  year,
  kind = "clip",
  tint = 0xc4a35a,
  seed = 1,
}) {
  const wide = kind === "mushaira";
  const canvas = document.createElement("canvas");
  canvas.width = wide ? 640 : 320;
  canvas.height = wide ? 360 : 200;
  const ctx = canvas.getContext("2d", { alpha: false });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  const rgb = hexToRgb(tint);
  let last = -1;

  function tick(time) {
    const frame = Math.floor(time * (wide ? 12 : 9));
    if (frame === last) return;
    last = frame;
    const t = time + seed;
    const w = canvas.width;
    const h = canvas.height;
    const flicker = 0.86 + Math.sin(t * 17) * 0.06 + (Math.random() * 0.04);
    ctx.fillStyle = `rgb(${Math.floor(rgb.r * 0.12 * flicker)}, ${Math.floor(rgb.g * 0.08 * flicker)}, ${Math.floor(rgb.b * 0.05 * flicker)})`;
    ctx.fillRect(0, 0, w, h);

    const g = ctx.createRadialGradient(w * 0.5, h * 0.42, 10, w * 0.5, h * 0.5, w * 0.62);
    g.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${wide ? 0.55 : 0.4})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    if (wide) {
      ctx.fillStyle = "#1a120c";
      ctx.fillRect(0, h * 0.62, w, h * 0.38);
      for (let i = 0; i < 14; i++) {
        const ax = 18 + i * (w / 13);
        silhouette(ctx, ax, h * 0.92, 0.55 + (i % 3) * 0.08, t + i, false);
      }
      silhouette(ctx, w * 0.5 + Math.sin(t) * 8, h * 0.58, 1.35, t, true);
      ctx.fillStyle = "rgba(255, 214, 140, 0.18)";
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.4, 90, 28, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const cut = Math.floor(t / 2.4) % 3;
      if (cut === 0) silhouette(ctx, w * 0.5, h * 0.7, 1.1, t, true);
      else if (cut === 1) {
        silhouette(ctx, w * 0.35, h * 0.78, 0.7, t, false);
        silhouette(ctx, w * 0.62, h * 0.72, 0.95, t + 1, true);
      } else {
        for (let i = 0; i < 6; i++) silhouette(ctx, 30 + i * 48, h * 0.86, 0.45, t + i, false);
      }
    }

    ctx.fillStyle = "rgba(255,255,255,0.045)";
    for (let i = 0; i < (wide ? 80 : 40); i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 1);
    }
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, h - 36, w, 36);
    ctx.fillStyle = "#f4ead0";
    ctx.font = wide ? "600 18px Times New Roman, serif" : "600 13px Times New Roman, serif";
    ctx.textAlign = "left";
    ctx.fillText(wrap(ctx, title, w - 24)[0] || title, 12, h - 14);
    ctx.fillStyle = "#c4a35a";
    ctx.font = "12px Helvetica, Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(year, w - 12, h - 14);

    texture.needsUpdate = true;
  }

  tick(0);
  return { texture, tick, canvas };
}

export function createEchoAudio() {
  let ctx = null;
  let master = null;
  let hallGain = null;
  let roomGain = null;
  let yearOsc = null;
  let yearGain = null;
  let noiseSrc = null;
  let mode = "hall";

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.2;

    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.48;
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.55;
    const delay2 = ctx.createDelay(1.5);
    delay2.delayTime.value = 0.91;
    const delay2Gain = ctx.createGain();
    delay2Gain.gain.value = 0.28;

    hallGain = ctx.createGain();
    hallGain.gain.value = 0.7;
    roomGain = ctx.createGain();
    roomGain.gain.value = 0;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;

    hallGain.connect(filter);
    roomGain.connect(filter);
    filter.connect(master);
    filter.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(delay);
    delayGain.connect(master);
    delay.connect(delay2);
    delay2.connect(delay2Gain);
    delay2Gain.connect(master);
    master.connect(ctx.destination);

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
    noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = buffer;
    noiseSrc.loop = true;
    const crowd = ctx.createGain();
    crowd.gain.value = 0.35;
    noiseSrc.connect(crowd);
    crowd.connect(hallGain);
    crowd.connect(roomGain);
    noiseSrc.start();

    yearOsc = ctx.createOscillator();
    yearOsc.type = "sine";
    yearOsc.frequency.value = 196;
    yearGain = ctx.createGain();
    yearGain.gain.value = 0;
    const yearFilter = ctx.createBiquadFilter();
    yearFilter.type = "bandpass";
    yearFilter.frequency.value = 420;
    yearOsc.connect(yearFilter);
    yearFilter.connect(yearGain);
    yearGain.connect(delay);
    yearGain.connect(hallGain);
    yearOsc.start();

    return ctx;
  }

  function pulseYears(time) {
    if (!ctx || !yearGain) return;
    const beat = Math.sin(time * 0.7) > 0.92;
    const now = ctx.currentTime;
    if (beat) {
      yearOsc.frequency.setValueAtTime(180 + (Math.floor(time) % 7) * 18, now);
      yearGain.gain.cancelScheduledValues(now);
      yearGain.gain.setValueAtTime(0.0001, now);
      yearGain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
      yearGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
    }
  }

  return {
    resume() {
      const first = !ctx;
      const audio = ensure();
      audio?.resume?.();
      if (first) this.setMode(mode);
    },
    setMode(next) {
      mode = next;
      if (!ctx) return;
      const now = ctx.currentTime;
      const toHall = mode === "hall" ? 0.75 : 0.12;
      const toRoom = mode === "hall" ? 0.08 : 0.85;
      hallGain.gain.linearRampToValueAtTime(toHall, now + 0.4);
      roomGain.gain.linearRampToValueAtTime(toRoom, now + 0.4);
    },
    pulseYears,
    dispose() {
      try {
        noiseSrc?.stop();
        yearOsc?.stop();
        ctx?.close();
      } catch {
        /* already closed */
      }
      ctx = null;
    },
  };
}
