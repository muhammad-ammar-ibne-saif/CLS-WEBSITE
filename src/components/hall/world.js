import * as THREE from "three";
import {
  makeWoodTexture,
  makePlasterTexture,
  makeDoorPlaque,
  makeInscription,
  makeEventPoster,
  makePresidentCard,
  paletteHex,
} from "./canvasTextures";

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function boxCollider(x, z, w, d) {
  return {
    minX: x - w / 2,
    maxX: x + w / 2,
    minZ: z - d / 2,
    maxZ: z + d / 2,
  };
}

function wallBox(x, y, z, w, h, d, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addLamp(parent, x, y, z, color, intensity = 4) {
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xffe6b0 }),
  );
  bulb.position.set(x, y, z);
  parent.add(bulb);
  const light = new THREE.PointLight(color, intensity, 14, 2);
  light.position.set(x, y, z);
  parent.add(light);
}

export function disposeObject(root) {
  root.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    const materials = child.material
      ? Array.isArray(child.material)
        ? child.material
        : [child.material]
      : [];
    for (const material of materials) {
      for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && value.isTexture) value.dispose();
      }
      material.dispose();
    }
  });
}

export function resolveMove(x, z, boxes, radius = 0.42) {
  let px = x;
  let pz = z;
  for (let i = 0; i < 3; i++) {
    for (const box of boxes) {
      const nx = Math.max(box.minX, Math.min(px, box.maxX));
      const nz = Math.max(box.minZ, Math.min(pz, box.maxZ));
      let dx = px - nx;
      let dz = pz - nz;
      const d2 = dx * dx + dz * dz;
      if (d2 < radius * radius) {
        const d = Math.sqrt(d2);
        if (d < 1e-6) {
          dx = 1;
          dz = 0;
        } else {
          dx /= d;
          dz /= d;
        }
        const push = radius - d;
        px += dx * push;
        pz += dz * push;
      }
    }
  }
  return { x: px, z: pz };
}

export function buildHall(rooms) {
  const root = new THREE.Group();
  const colliders = [];
  const doors = [];
  const floaters = [];

  const W = 10;
  const L = 48;
  const H = 5.2;
  const halfW = W / 2;
  const halfL = L / 2;
  const doorW = 1.85;
  const doorH = 2.9;

  const wood = new THREE.MeshStandardMaterial({
    map: makeWoodTexture("#6a5533"),
    roughness: 0.82,
    metalness: 0.04,
  });
  const plaster = new THREE.MeshStandardMaterial({
    map: makePlasterTexture("#efe6d0"),
    roughness: 0.95,
    metalness: 0,
  });
  const darkWood = new THREE.MeshStandardMaterial({
    color: 0x3a301e,
    roughness: 0.7,
    metalness: 0.08,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xc4a35a,
    roughness: 0.35,
    metalness: 0.55,
  });
  const carpet = new THREE.MeshStandardMaterial({
    color: 0x6a673b,
    roughness: 0.9,
    metalness: 0,
  });

  const floor = new THREE.Mesh(new THREE.BoxGeometry(W, 0.2, L), wood);
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  root.add(floor);

  const runner = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.03, L - 4), carpet);
  runner.position.y = 0.02;
  runner.receiveShadow = true;
  root.add(runner);

  const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(W, 0.2, L),
    new THREE.MeshStandardMaterial({ color: 0x2a241c, roughness: 1 }),
  );
  ceiling.position.y = H;
  root.add(ceiling);

  const endWalls = [
    { z: -halfL, rot: 0 },
    { z: halfL, rot: Math.PI },
  ];
  for (const end of endWalls) {
    const wall = wallBox(0, H / 2, end.z, W, H, 0.28, plaster);
    wall.rotation.y = end.rot;
    root.add(wall);
    colliders.push(boxCollider(0, end.z, W, 0.5));
  }

  const inscription = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 2.4),
    new THREE.MeshBasicMaterial({
      map: makeInscription("WALL OF HEROES", "Walk to a year. Step through. The archive opens."),
      transparent: true,
    }),
  );
  inscription.position.set(0, 3.1, -halfL + 0.2);
  root.add(inscription);

  const leftCount = Math.ceil(rooms.length / 2);
  const rightCount = Math.floor(rooms.length / 2);
  const placeDoors = (count, x, startZ, spacing) => {
    const list = [];
    for (let i = 0; i < count; i++) list.push({ x, z: startZ - i * spacing });
    return list;
  };

  const leftSlots = placeDoors(leftCount, -halfW, 16, 6.2);
  const rightSlots = placeDoors(rightCount, halfW, 13, 6.2);
  const slots = [];
  rooms.forEach((room, i) => {
    const slot = i % 2 === 0 ? leftSlots[Math.floor(i / 2)] : rightSlots[Math.floor(i / 2)];
    if (slot) slots.push({ room, ...slot, side: slot.x < 0 ? -1 : 1 });
  });

  const addSideWall = (x, slotsOnSide) => {
    const doorZs = slotsOnSide.map((s) => s.z).sort((a, b) => a - b);
    let cursor = -halfL;
    for (const doorZ of doorZs) {
      const gapStart = doorZ - doorW / 2;
      const span = gapStart - cursor;
      if (span > 0.12) {
        const z = cursor + span / 2;
        root.add(wallBox(x, H / 2, z, 0.28, H, span, plaster));
        colliders.push(boxCollider(x, z, 0.55, span));
      }
      const lintelH = H - doorH;
      root.add(wallBox(x, doorH + lintelH / 2, doorZ, 0.28, lintelH, doorW + 0.08, plaster));
      cursor = doorZ + doorW / 2;
    }
    const span = halfL - cursor;
    if (span > 0.12) {
      const z = cursor + span / 2;
      root.add(wallBox(x, H / 2, z, 0.28, H, span, plaster));
      colliders.push(boxCollider(x, z, 0.55, span));
    }
  };

  addSideWall(-halfW, leftSlots);
  addSideWall(halfW, rightSlots);

  for (const slot of slots) {
    const facing = -slot.side;
    const frame = new THREE.Group();
    frame.position.set(slot.x + facing * 0.02, 0, slot.z);
    frame.rotation.y = slot.side < 0 ? Math.PI / 2 : -Math.PI / 2;

    const left = wallBox(-doorW / 2 - 0.08, doorH / 2, 0, 0.16, doorH, 0.22, darkWood);
    const right = wallBox(doorW / 2 + 0.08, doorH / 2, 0, 0.16, doorH, 0.22, darkWood);
    const top = wallBox(0, doorH + 0.08, 0, doorW + 0.4, 0.18, 0.24, darkWood);
    frame.add(left, right, top);

    const leaf = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH - 0.08, 0.08), darkWood);
    leaf.position.set(0, doorH / 2, 0.02);
    leaf.userData.kind = "door";
    leaf.userData.roomId = slot.room.id;
    frame.add(leaf);

    const handle = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), gold);
    handle.position.set(doorW * 0.32, doorH * 0.48, 0.08);
    frame.add(handle);

    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(1.15, 0.72),
      new THREE.MeshBasicMaterial({ map: makeDoorPlaque(slot.room.yearLabel, slot.room.plaque) }),
    );
    plaque.position.set(0, doorH + 0.55, 0.14);
    plaque.userData.kind = "door";
    plaque.userData.roomId = slot.room.id;
    frame.add(plaque);

    root.add(frame);
    doors.push({
      roomId: slot.room.id,
      position: new THREE.Vector3(slot.x + facing * 1.1, 1.4, slot.z),
      mesh: leaf,
    });
  }

  for (let i = 0; i < 6; i++) {
    const z = 18 - i * 7.2;
    addLamp(root, 0, H - 0.45, z, 0xffe2b8, 5.5);
    const beam = wallBox(0, H - 0.15, z, W - 0.4, 0.12, 0.18, darkWood);
    root.add(beam);
  }

  return {
    root,
    colliders,
    doors,
    floaters,
    spawn: { x: 0, z: 20, yaw: 0 },
    bounds: { minX: -halfW + 0.4, maxX: halfW - 0.4, minZ: -halfL + 0.6, maxZ: halfL - 0.6 },
    fog: 0x1a140c,
    ambient: 0xffe6c0,
  };
}

export function buildYearRoom(room) {
  const root = new THREE.Group();
  const colliders = [];
  const exhibits = [];
  const floaters = [];
  const rng = mulberry32(
    room.yearLabel.split("").reduce((n, ch) => n + ch.charCodeAt(0) * 13, 97),
  );

  const S = 22;
  const H = 6;
  const half = S / 2;
  const doorW = 1.9;
  const doorH = 2.9;
  const { palette } = room;

  const plaster = new THREE.MeshStandardMaterial({
    map: makePlasterTexture(paletteHex(palette.wall)),
    roughness: 0.96,
    color: palette.wall,
  });
  const wood = new THREE.MeshStandardMaterial({
    map: makeWoodTexture("#4a3a24"),
    roughness: 0.85,
  });
  const darkWood = new THREE.MeshStandardMaterial({
    color: 0x2c2418,
    roughness: 0.7,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xc4a35a,
    roughness: 0.4,
    metalness: 0.5,
  });

  const floor = new THREE.Mesh(new THREE.BoxGeometry(S, 0.2, S), wood);
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  root.add(floor);

  const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(S, 0.18, S),
    new THREE.MeshStandardMaterial({ color: 0x1c1812, roughness: 1 }),
  );
  ceiling.position.y = H;
  root.add(ceiling);

  const walls = [
    { x: 0, z: -half, w: S, d: 0.3 },
    { x: -half, z: 0, w: 0.3, d: S },
    { x: half, z: 0, w: 0.3, d: S },
  ];
  for (const wall of walls) {
    root.add(wallBox(wall.x, H / 2, wall.z, wall.w, H, wall.d, plaster));
    colliders.push(boxCollider(wall.x, wall.z, wall.w + 0.2, wall.d + 0.2));
  }

  const sideSpan = (S - doorW) / 2;
  root.add(wallBox(-(doorW / 2 + sideSpan / 2), H / 2, half, sideSpan, H, 0.3, plaster));
  root.add(wallBox(doorW / 2 + sideSpan / 2, H / 2, half, sideSpan, H, 0.3, plaster));
  root.add(wallBox(0, doorH + (H - doorH) / 2, half, doorW + 0.16, H - doorH, 0.3, plaster));
  colliders.push(boxCollider(-(doorW / 2 + sideSpan / 2), half, sideSpan, 0.55));
  colliders.push(boxCollider(doorW / 2 + sideSpan / 2, half, sideSpan, 0.55));

  const exitLeaf = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH - 0.1, 0.08), darkWood);
  exitLeaf.position.set(0, doorH / 2, half - 0.08);
  exitLeaf.userData.kind = "exit";
  root.add(exitLeaf);
  const exitPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 0.5),
    new THREE.MeshBasicMaterial({
      map: makeDoorPlaque("HALL", "Return to years"),
    }),
  );
  exitPlaque.position.set(0, doorH + 0.45, half - 0.2);
  exitPlaque.rotation.y = Math.PI;
  exitPlaque.userData.kind = "exit";
  root.add(exitPlaque);

  const title = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 2.2),
    new THREE.MeshBasicMaterial({
      map: makeInscription(room.yearLabel, room.plaque),
      transparent: true,
    }),
  );
  title.position.set(0, 4.4, -half + 0.2);
  root.add(title);

  const bust = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 2),
    new THREE.MeshBasicMaterial({ map: makePresidentCard(room.president, room.title) }),
  );
  bust.position.set(0, 1.7, -3.2);
  root.add(bust);
  const pedestal = wallBox(0, 0.35, -3.2, 1.1, 0.7, 0.7, darkWood);
  root.add(pedestal);

  addLamp(root, 0, H - 0.6, 0, palette.light, 8);
  addLamp(root, -6, H - 0.7, -5, palette.light, 5);
  addLamp(root, 6, H - 0.7, 4, palette.light, 5);

  const accent = new THREE.PointLight(palette.accent, 3.5, 16, 2);
  accent.position.set(0, 2.4, 0);
  root.add(accent);

  room.events.forEach((event, index) => {
    const angle = (index / room.events.length) * Math.PI * 2 + rng() * 0.5;
    const radius = 5.2 + rng() * 4.4;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius - 0.6;
    const y = 1.15 + rng() * 2.4;
    const lean = (rng() - 0.5) * 0.55;
    const yaw = angle + Math.PI + (rng() - 0.5) * 0.9;
    const scale = 0.85 + rng() * 0.55;

    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = yaw;

    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(1.55 * scale + 0.12, 2.25 * scale + 0.12, 0.1),
      gold,
    );
    frame.position.y = y;
    frame.rotation.z = lean;
    group.add(frame);

    const poster = new THREE.Mesh(
      new THREE.PlaneGeometry(1.55 * scale, 2.25 * scale),
      new THREE.MeshBasicMaterial({
        map: makeEventPoster(event, room.yearLabel, paletteHex(palette.accent)),
      }),
    );
    poster.position.set(0, y, 0.07);
    poster.rotation.z = lean;
    poster.userData.kind = "event";
    poster.userData.eventIndex = index;
    group.add(poster);

    if (rng() > 0.45) {
      const stack = 1 + Math.floor(rng() * 4);
      for (let b = 0; b < stack; b++) {
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 0.05, 0.2),
          new THREE.MeshStandardMaterial({
            color: rng() > 0.5 ? palette.accent : 0x4a3020,
            roughness: 0.8,
          }),
        );
        book.position.set((rng() - 0.5) * 0.8, 0.08 + b * 0.055, 0.55);
        book.rotation.y = rng() * 0.6;
        group.add(book);
      }
    }

    root.add(group);
    exhibits.push({
      index,
      event,
      position: new THREE.Vector3(x, y, z),
      radius: 2.4,
    });
  });

  for (let i = 0; i < 28; i++) {
    const paper = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 0.3),
      new THREE.MeshStandardMaterial({
        color: rng() > 0.3 ? 0xf6efd8 : 0xe8dcc0,
        side: THREE.DoubleSide,
        roughness: 1,
      }),
    );
    paper.position.set((rng() - 0.5) * 16, 0.8 + rng() * 3.8, (rng() - 0.5) * 16);
    paper.rotation.set(rng() * 1.2, rng() * Math.PI, rng() * 1.2);
    root.add(paper);
    floaters.push({
      mesh: paper,
      phase: rng() * Math.PI * 2,
      speed: 0.3 + rng() * 0.7,
      amp: 0.15 + rng() * 0.28,
      baseY: paper.position.y,
    });
  }

  return {
    root,
    colliders,
    exhibits,
    floaters,
    doors: [],
    spawn: { x: 0, z: 6.4, yaw: 0 },
    bounds: { minX: -half + 0.5, maxX: half - 0.5, minZ: -half + 0.5, maxZ: half - 0.5 },
    fog: palette.fog,
    ambient: palette.light,
    exit: { position: new THREE.Vector3(0, 1.4, half - 1.2) },
  };
}
