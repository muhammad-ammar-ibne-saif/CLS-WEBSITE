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
import { createFilm } from "./films";

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

function addLamp(parent, x, y, z, color, intensity = 3) {
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffe6b0 }),
  );
  bulb.position.set(x, y, z);
  parent.add(bulb);
  const light = new THREE.PointLight(color, intensity, 7, 2);
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

export function resolveMove(x, z, boxes, radius = 0.32) {
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

function mushairaOf(room) {
  return (
    room.events.find((event) => /mushaira|ghazal|sukhan|recital|nazm/i.test(event.name)) ||
    room.events[0]
  );
}

function addDoor(root, { x, z, yaw, room, doorW, doorH, darkWood, gold, inward }) {
  const frame = new THREE.Group();
  frame.position.set(x, 0, z);
  frame.rotation.y = yaw;

  const left = wallBox(-doorW / 2 - 0.06, doorH / 2, 0, 0.12, doorH, 0.16, darkWood);
  const right = wallBox(doorW / 2 + 0.06, doorH / 2, 0, 0.12, doorH, 0.16, darkWood);
  const top = wallBox(0, doorH + 0.06, 0, doorW + 0.28, 0.14, 0.18, darkWood);
  frame.add(left, right, top);

  const leaf = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH - 0.06, 0.05), darkWood);
  leaf.position.set(0, doorH / 2, 0.02);
  leaf.userData.kind = "door";
  leaf.userData.roomId = room.id;
  frame.add(leaf);

  const handle = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), gold);
  handle.position.set(doorW * 0.3, doorH * 0.48, 0.06);
  frame.add(handle);

  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(0.82, 0.5),
    new THREE.MeshBasicMaterial({ map: makeDoorPlaque(room.yearLabel, room.plaque) }),
  );
  plaque.position.set(0, doorH + 0.38, 0.1);
  plaque.userData.kind = "door";
  plaque.userData.roomId = room.id;
  frame.add(plaque);

  root.add(frame);
  const facing = new THREE.Vector3(0, 0, inward);
  facing.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  return {
    roomId: room.id,
    position: new THREE.Vector3(x + facing.x * 0.7, 1.3, z + facing.z * 0.7),
    mesh: leaf,
  };
}

export function buildHall(rooms) {
  const root = new THREE.Group();
  const colliders = [];
  const doors = [];
  const floaters = [];
  const films = [];
  const rng = mulberry32(2016);

  const W = 7.2;
  const L = 7.2;
  const H = 3.45;
  const halfW = W / 2;
  const halfL = L / 2;
  const doorW = 1.05;
  const doorH = 2.25;

  const wood = new THREE.MeshStandardMaterial({
    map: makeWoodTexture("#5a4428"),
    roughness: 0.85,
  });
  const plaster = new THREE.MeshStandardMaterial({
    map: makePlasterTexture("#cbb89a"),
    roughness: 0.96,
  });
  const darkWood = new THREE.MeshStandardMaterial({ color: 0x2c2418, roughness: 0.7 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xc4a35a, roughness: 0.4, metalness: 0.45 });

  const floor = new THREE.Mesh(new THREE.BoxGeometry(W, 0.16, L), wood);
  floor.position.y = -0.08;
  floor.receiveShadow = true;
  root.add(floor);

  const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(W, 0.14, L),
    new THREE.MeshStandardMaterial({ color: 0x1a1510, roughness: 1 }),
  );
  ceiling.position.y = H;
  root.add(ceiling);

  const walls = [
    { x: 0, z: -halfL, w: W, d: 0.22 },
    { x: 0, z: halfL, w: W, d: 0.22 },
    { x: -halfW, z: 0, w: 0.22, d: L },
    { x: halfW, z: 0, w: 0.22, d: L },
  ];
  for (const wall of walls) {
    root.add(wallBox(wall.x, H / 2, wall.z, wall.w, H, wall.d, plaster));
    colliders.push(boxCollider(wall.x, wall.z, wall.w + 0.25, wall.d + 0.25));
  }

  const inscription = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 1.1),
    new THREE.MeshBasicMaterial({
      map: makeInscription("THE YEARS SPEAK", "A small room. Every door still talking."),
      transparent: true,
    }),
  );
  inscription.position.set(0, H - 0.55, -halfL + 0.14);
  root.add(inscription);

  const slots = [
    { room: rooms[0], x: -2.05, z: -halfL + 0.12, yaw: 0, inward: 1 },
    { room: rooms[1], x: 0, z: -halfL + 0.12, yaw: 0, inward: 1 },
    { room: rooms[2], x: 2.05, z: -halfL + 0.12, yaw: 0, inward: 1 },
    { room: rooms[3], x: -halfW + 0.12, z: -1.7, yaw: Math.PI / 2, inward: 1 },
    { room: rooms[4], x: -halfW + 0.12, z: 0.15, yaw: Math.PI / 2, inward: 1 },
    { room: rooms[5], x: -halfW + 0.12, z: 1.95, yaw: Math.PI / 2, inward: 1 },
    { room: rooms[6], x: halfW - 0.12, z: -1.7, yaw: -Math.PI / 2, inward: 1 },
    { room: rooms[7], x: halfW - 0.12, z: 0.15, yaw: -Math.PI / 2, inward: 1 },
    { room: rooms[8], x: halfW - 0.12, z: 1.95, yaw: -Math.PI / 2, inward: 1 },
    { room: rooms[9], x: -1.15, z: halfL - 0.12, yaw: Math.PI, inward: 1 },
    { room: rooms[10], x: 1.15, z: halfL - 0.12, yaw: Math.PI, inward: 1 },
  ].filter((slot) => slot.room);

  for (const slot of slots) {
    doors.push(addDoor(root, { ...slot, doorW, doorH, darkWood, gold, inward: slot.inward }));

    const leak = mushairaOf(slot.room);
    const film = createFilm({
      title: leak.name,
      year: slot.room.yearLabel,
      kind: "clip",
      tint: slot.room.palette.accent,
      seed: slot.room.yearLabel.length * 9,
    });
    films.push(film);
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.72, 0.46),
      new THREE.MeshBasicMaterial({ map: film.texture }),
    );
    const inward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), slot.yaw);
    screen.position.set(slot.x + inward.x * 0.2, 2.58, slot.z + inward.z * 0.2);
    screen.rotation.y = slot.yaw;
    screen.userData.kind = "door";
    screen.userData.roomId = slot.room.id;
    root.add(screen);
  }

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    const ghost = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 0.32),
      new THREE.MeshBasicMaterial({
        map: makeInscription(room.yearLabel, room.plaque),
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    const a = (i / rooms.length) * Math.PI * 2;
    ghost.position.set(Math.cos(a) * 1.15, 2.05 + (i % 3) * 0.22, Math.sin(a) * 1.15);
    ghost.rotation.y = a + Math.PI / 2;
    root.add(ghost);
    floaters.push({
      mesh: ghost,
      phase: i,
      speed: 0.45 + rng() * 0.3,
      amp: 0.08,
      baseY: ghost.position.y,
    });
  }

  for (let i = 0; i < 36; i++) {
    const paper = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 0.22),
      new THREE.MeshStandardMaterial({
        color: rng() > 0.5 ? 0xf4ead0 : 0xe0d0b0,
        side: THREE.DoubleSide,
        roughness: 1,
      }),
    );
    paper.position.set((rng() - 0.5) * 5.6, 0.7 + rng() * 2.2, (rng() - 0.5) * 5.6);
    paper.rotation.set(rng() * 1.4, rng() * Math.PI, rng() * 1.2);
    root.add(paper);
    floaters.push({
      mesh: paper,
      phase: rng() * 6,
      speed: 0.5 + rng() * 0.8,
      amp: 0.12 + rng() * 0.16,
      baseY: paper.position.y,
    });
  }

  addLamp(root, 0, H - 0.35, 0, 0xffd9a0, 4.2);
  addLamp(root, -2.1, H - 0.4, -2.1, 0xe8c080, 2.2);
  addLamp(root, 2.1, H - 0.4, 2.1, 0xe8c080, 2.2);

  return {
    root,
    colliders,
    doors,
    floaters,
    films,
    spawn: { x: 0, z: 0.25, yaw: 0 },
    bounds: { minX: -halfW + 0.45, maxX: halfW - 0.45, minZ: -halfL + 0.45, maxZ: halfL - 0.45 },
    fog: 0x140f0a,
    fogDensity: 0.085,
    ambience: "hall",
  };
}

function coverWallWithClips(root, films, exhibits, events, allEvents, yearLabel, tint, { x, z, rotY, cols, rows, w, h }) {
  events.forEach((event, i) => {
    const index = Math.max(0, allEvents.indexOf(event));
    const col = i % cols;
    const row = Math.floor(i / cols) % rows;
    const film = createFilm({
      title: event.name,
      year: yearLabel,
      kind: "clip",
      tint,
      seed: index * 13 + yearLabel.length,
    });
    films.push(film);
    const gapX = w / cols;
    const gapY = h / rows;
    const localX = -w / 2 + gapX * (col + 0.5);
    const localY = 0.55 + gapY * (row + 0.5);
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(gapX * 0.92, gapY * 0.88),
      new THREE.MeshBasicMaterial({ map: film.texture }),
    );
    const pos = new THREE.Vector3(localX, localY, 0.04);
    pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
    screen.position.set(x + pos.x, pos.y, z + pos.z);
    screen.rotation.y = rotY;
    screen.rotation.z = (index % 2 === 0 ? -1 : 1) * 0.03;
    screen.userData.kind = "event";
    screen.userData.eventIndex = index;
    root.add(screen);
    exhibits.push({
      index,
      event,
      position: screen.position.clone(),
      radius: 1.35,
    });
  });
}

export function buildYearRoom(room) {
  const root = new THREE.Group();
  const colliders = [];
  const exhibits = [];
  const floaters = [];
  const films = [];
  const rng = mulberry32(room.yearLabel.split("").reduce((n, ch) => n + ch.charCodeAt(0), 11));

  const S = 6.1;
  const H = 3.35;
  const half = S / 2;
  const doorW = 1.05;
  const doorH = 2.2;
  const { palette } = room;
  const mushaira = mushairaOf(room);
  const otherEvents = room.events.filter((event) => event !== mushaira);
  const clipEvents = otherEvents.length ? otherEvents : room.events;

  const plaster = new THREE.MeshStandardMaterial({
    map: makePlasterTexture(paletteHex(palette.wall)),
    roughness: 0.97,
    color: palette.wall,
  });
  const wood = new THREE.MeshStandardMaterial({
    map: makeWoodTexture("#3f3220"),
    roughness: 0.88,
  });
  const darkWood = new THREE.MeshStandardMaterial({ color: 0x241c14, roughness: 0.72 });

  const floor = new THREE.Mesh(new THREE.BoxGeometry(S, 0.16, S), wood);
  floor.position.y = -0.08;
  floor.receiveShadow = true;
  root.add(floor);

  const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(S, 0.12, S),
    new THREE.MeshStandardMaterial({ color: 0x120e0a, roughness: 1 }),
  );
  ceiling.position.y = H;
  root.add(ceiling);

  const walls = [
    { x: 0, z: -half, w: S, d: 0.18 },
    { x: -half, z: 0, w: 0.18, d: S },
    { x: half, z: 0, w: 0.18, d: S },
  ];
  for (const wall of walls) {
    root.add(wallBox(wall.x, H / 2, wall.z, wall.w, H, wall.d, plaster));
    colliders.push(boxCollider(wall.x, wall.z, wall.w + 0.2, wall.d + 0.2));
  }

  const sideSpan = (S - doorW) / 2;
  root.add(wallBox(-(doorW / 2 + sideSpan / 2), H / 2, half, sideSpan, H, 0.18, plaster));
  root.add(wallBox(doorW / 2 + sideSpan / 2, H / 2, half, sideSpan, H, 0.18, plaster));
  root.add(wallBox(0, doorH + (H - doorH) / 2, half, doorW + 0.12, H - doorH, 0.18, plaster));
  colliders.push(boxCollider(-(doorW / 2 + sideSpan / 2), half, sideSpan, 0.4));
  colliders.push(boxCollider(doorW / 2 + sideSpan / 2, half, sideSpan, 0.4));

  const exitLeaf = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH - 0.08, 0.06), darkWood);
  exitLeaf.position.set(0, doorH / 2, half - 0.06);
  exitLeaf.userData.kind = "exit";
  root.add(exitLeaf);
  const exitPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 0.34),
    new THREE.MeshBasicMaterial({ map: makeDoorPlaque("HALL", "Step back") }),
  );
  exitPlaque.position.set(0, doorH + 0.32, half - 0.14);
  exitPlaque.rotation.y = Math.PI;
  exitPlaque.userData.kind = "exit";
  root.add(exitPlaque);

  const mushairaFilm = createFilm({
    title: mushaira.name,
    year: room.yearLabel,
    kind: "mushaira",
    tint: palette.light,
    seed: 4,
  });
  films.push(mushairaFilm);
  const cinema = new THREE.Mesh(
    new THREE.PlaneGeometry(S - 0.28, H - 0.2),
    new THREE.MeshBasicMaterial({ map: mushairaFilm.texture }),
  );
  cinema.position.set(0, H / 2, -half + 0.12);
  cinema.userData.kind = "event";
  cinema.userData.eventIndex = room.events.indexOf(mushaira);
  root.add(cinema);
  exhibits.push({
    index: room.events.indexOf(mushaira),
    event: mushaira,
    position: new THREE.Vector3(0, 1.5, -half + 0.4),
    radius: 2.2,
  });

  const leftClips = clipEvents.slice(0, Math.ceil(clipEvents.length / 2));
  const rightClips = clipEvents.slice(Math.ceil(clipEvents.length / 2));
  coverWallWithClips(root, films, exhibits, leftClips, room.events, room.yearLabel, palette.accent, {
    x: -half + 0.12,
    z: 0,
    rotY: Math.PI / 2,
    cols: 2,
    rows: Math.max(2, Math.ceil(leftClips.length / 2)),
    w: S - 0.5,
    h: H - 0.7,
  });
  coverWallWithClips(root, films, exhibits, rightClips.length ? rightClips : clipEvents, room.events, room.yearLabel, palette.accent, {
    x: half - 0.12,
    z: 0,
    rotY: -Math.PI / 2,
    cols: 2,
    rows: Math.max(2, Math.ceil((rightClips.length || clipEvents.length) / 2)),
    w: S - 0.5,
    h: H - 0.7,
  });

  const bust = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 0.9),
    new THREE.MeshBasicMaterial({ map: makePresidentCard(room.president, room.title) }),
  );
  bust.position.set(0, 1.15, half - 0.55);
  bust.rotation.y = Math.PI;
  root.add(bust);

  for (let i = 0; i < room.events.length; i++) {
    const poster = new THREE.Mesh(
      new THREE.PlaneGeometry(0.55, 0.8),
      new THREE.MeshBasicMaterial({
        map: makeEventPoster(room.events[i], room.yearLabel, paletteHex(palette.accent)),
        side: THREE.DoubleSide,
      }),
    );
    poster.position.set((rng() - 0.5) * 4.4, 0.55 + rng() * 1.8, (rng() - 0.5) * 3.2);
    poster.rotation.set((rng() - 0.5) * 0.5, rng() * Math.PI, (rng() - 0.5) * 0.35);
    poster.userData.kind = "event";
    poster.userData.eventIndex = i;
    root.add(poster);
    floaters.push({
      mesh: poster,
      phase: rng() * 6,
      speed: 0.25 + rng() * 0.4,
      amp: 0.05,
      baseY: poster.position.y,
      spin: false,
    });
  }

  for (let i = 0; i < 22; i++) {
    const paper = new THREE.Mesh(
      new THREE.PlaneGeometry(0.14, 0.2),
      new THREE.MeshStandardMaterial({
        color: rng() > 0.4 ? 0xf6efd8 : palette.accent,
        side: THREE.DoubleSide,
        roughness: 1,
      }),
    );
    paper.position.set((rng() - 0.5) * 4.8, 0.6 + rng() * 2.2, (rng() - 0.5) * 4.8);
    paper.rotation.set(rng(), rng() * Math.PI, rng());
    root.add(paper);
    floaters.push({
      mesh: paper,
      phase: rng() * 6,
      speed: 0.4 + rng() * 0.7,
      amp: 0.1 + rng() * 0.14,
      baseY: paper.position.y,
    });
  }

  addLamp(root, 0, H - 0.28, -1.4, palette.light, 5.5);
  addLamp(root, -1.6, H - 0.32, 0.6, palette.light, 2.4);
  addLamp(root, 1.6, H - 0.32, 0.6, palette.light, 2.4);

  return {
    root,
    colliders,
    exhibits,
    floaters,
    films,
    doors: [],
    spawn: { x: 0, z: 0.2, yaw: 0 },
    bounds: { minX: -half + 0.38, maxX: half - 0.38, minZ: -half + 0.38, maxZ: half - 0.38 },
    fog: palette.fog,
    fogDensity: 0.1,
    ambience: "room",
    exit: { position: new THREE.Vector3(0, 1.3, half - 0.85) },
  };
}
