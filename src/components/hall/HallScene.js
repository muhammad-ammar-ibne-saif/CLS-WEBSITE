"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildHall, buildYearRoom, disposeObject, resolveMove } from "./world";

const EYE = 1.62;
const WALK = 4.4;
const TURN = 1.55;

export default function HallScene({ rooms, inputRef, onHud, onReady }) {
  const mountRef = useRef(null);
  const hudRef = useRef(onHud);
  const readyRef = useRef(onReady);
  hudRef.current = onHud;
  readyRef.current = onReady;

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.className = "hall-webgl";
    renderer.domElement.tabIndex = 0;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x120e0a);
    scene.fog = new THREE.FogExp2(0x1a140c, 0.03);

    const camera = new THREE.PerspectiveCamera(
      70,
      host.clientWidth / Math.max(host.clientHeight, 1),
      0.08,
      80,
    );
    camera.rotation.order = "YXZ";

    const hemi = new THREE.HemisphereLight(0xffe6c4, 0x2a2014, 0.55);
    scene.add(hemi);
    const ambient = new THREE.AmbientLight(0xffe6c0, 0.28);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffe2b8, 0.28);
    sun.position.set(6, 12, 4);
    scene.add(sun);

    const keys = new Set();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const clock = new THREE.Clock();

    let world = null;
    let location = "hall";
    let x = 0;
    let z = 20;
    let yaw = 0;
    let pitch = 0;
    let grace = 0;
    let locked = false;
    let running = true;
    let lastHud = "";

    const roomById = Object.fromEntries(rooms.map((room) => [room.id, room]));

    function emit(extra = {}) {
      const room = location === "hall" ? null : roomById[location];
      const payload = {
        location,
        title: room ? room.title : "Hall of Years",
        subtitle: room ? `President: ${room.president}` : "Wall of Heroes · CLS archive",
        yearLabel: room?.yearLabel || "CLS",
        ...extra,
      };
      const key = JSON.stringify(payload);
      if (key === lastHud) return;
      lastHud = key;
      hudRef.current?.(payload);
    }

    function mountWorld(next, nextLocation) {
      if (world) {
        scene.remove(world.root);
        disposeObject(world.root);
      }
      world = next;
      location = nextLocation;
      scene.add(world.root);
      scene.fog = new THREE.FogExp2(world.fog, location === "hall" ? 0.028 : 0.022);
      scene.background = new THREE.Color(world.fog);
      x = world.spawn.x;
      z = world.spawn.z;
      yaw = world.spawn.yaw;
      pitch = 0;
      grace = 0.9;
      emit({ prompt: null, event: null, looking: null, flash: true });
    }

    function enterHall() {
      mountWorld(buildHall(rooms), "hall");
    }

    function enterRoom(id) {
      const room = roomById[id];
      if (!room) return;
      mountWorld(buildYearRoom(room), id);
    }

    enterHall();
    readyRef.current?.();
    renderer.domElement.focus();

    function hitFromPointer(clientX, clientY) {
      if (!world) return [];
      const rect = renderer.domElement.getBoundingClientRect();
      if (locked) {
        pointer.set(0, 0);
      } else {
        pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      }
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(world.root.children, true);
    }

    function useHit(hits) {
      for (const hit of hits) {
        let obj = hit.object;
        while (obj) {
          if (obj.userData?.kind === "door" && obj.userData.roomId) {
            enterRoom(obj.userData.roomId);
            return true;
          }
          if (obj.userData?.kind === "exit") {
            enterHall();
            return true;
          }
          if (obj.userData?.kind === "event") {
            const exhibit = world.exhibits?.[obj.userData.eventIndex];
            if (exhibit) emit({ event: exhibit.event, looking: "event" });
            return true;
          }
          obj = obj.parent;
        }
      }
      return false;
    }

    function onPointerDown(e) {
      renderer.domElement.focus();
      const hits = hitFromPointer(e.clientX, e.clientY);
      if (useHit(hits)) return;
      if (e.button === 0 && !locked && e.pointerType === "mouse") {
        renderer.domElement.requestPointerLock?.();
      }
    }

    function onMouseMove(e) {
      if (!locked) return;
      yaw -= e.movementX * 0.0022;
      pitch -= e.movementY * 0.0022;
      pitch = Math.max(-1.15, Math.min(1.15, pitch));
    }

    let touchX = 0;
    let touchY = 0;
    function onTouchStart(e) {
      const t = e.changedTouches[0];
      touchX = t.clientX;
      touchY = t.clientY;
    }
    function onTouchMove(e) {
      const t = e.changedTouches[0];
      yaw -= (t.clientX - touchX) * 0.005;
      pitch -= (t.clientY - touchY) * 0.005;
      pitch = Math.max(-1.15, Math.min(1.15, pitch));
      touchX = t.clientX;
      touchY = t.clientY;
    }

    function onKeyDown(e) {
      const codes = new Set([
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "KeyW",
        "KeyA",
        "KeyS",
        "KeyD",
        "Space",
      ]);
      if (codes.has(e.code)) e.preventDefault();
      keys.add(e.code);
      if (e.code === "Enter" || e.code === "KeyE") {
        if (location === "hall") {
          const near = nearestDoor();
          if (near) enterRoom(near.door.roomId);
        } else if (nearExit() < 2.4) {
          enterHall();
        }
      }
      if (e.code === "Escape" && location !== "hall") {
        e.preventDefault();
        enterHall();
      }
    }
    function onKeyUp(e) {
      keys.delete(e.code);
    }

    function onLockChange() {
      locked = document.pointerLockElement === renderer.domElement;
    }

    function nearestDoor(limit = 2.25) {
      if (!world?.doors?.length) return null;
      let best = null;
      let bestD = limit;
      for (const door of world.doors) {
        const d = Math.hypot(door.position.x - x, door.position.z - z);
        if (d < bestD) {
          bestD = d;
          best = door;
        }
      }
      return best ? { door: best, distance: bestD } : null;
    }

    function nearExit() {
      if (!world?.exit) return Infinity;
      return Math.hypot(world.exit.position.x - x, world.exit.position.z - z);
    }

    function nearestExhibit() {
      if (!world?.exhibits?.length) return null;
      let best = null;
      let bestD = 2.55;
      for (const exhibit of world.exhibits) {
        const d = Math.hypot(exhibit.position.x - x, exhibit.position.z - z);
        if (d < bestD) {
          bestD = d;
          best = exhibit;
        }
      }
      return best;
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: true });
    renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    document.addEventListener("pointerlockchange", onLockChange);

    const resize = () => {
      const w = host.clientWidth;
      const h = Math.max(host.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    function pad() {
      return inputRef?.current || {};
    }

    function tick() {
      if (!running) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      grace = Math.max(0, grace - dt);
      const held = pad();

      const forward =
        keys.has("ArrowUp") || keys.has("KeyW") || held.forward;
      const back = keys.has("ArrowDown") || keys.has("KeyS") || held.back;
      const turnL = keys.has("ArrowLeft") || held.left;
      const turnR = keys.has("ArrowRight") || held.right;
      const strafeL = keys.has("KeyA");
      const strafeR = keys.has("KeyD");

      if (turnL) yaw += TURN * dt;
      if (turnR) yaw -= TURN * dt;

      let mx = 0;
      let mz = 0;
      if (forward) {
        mx -= Math.sin(yaw);
        mz -= Math.cos(yaw);
      }
      if (back) {
        mx += Math.sin(yaw);
        mz += Math.cos(yaw);
      }
      if (strafeL) {
        mx -= Math.cos(yaw);
        mz += Math.sin(yaw);
      }
      if (strafeR) {
        mx += Math.cos(yaw);
        mz -= Math.sin(yaw);
      }
      const len = Math.hypot(mx, mz);
      if (len > 0 && world) {
        mx /= len;
        mz /= len;
        const speed = keys.has("ShiftLeft") ? WALK * 1.55 : WALK;
        const next = resolveMove(x + mx * speed * dt, z + mz * speed * dt, world.colliders);
        x = THREE.MathUtils.clamp(next.x, world.bounds.minX, world.bounds.maxX);
        z = THREE.MathUtils.clamp(next.z, world.bounds.minZ, world.bounds.maxZ);
      }

      camera.position.set(x, EYE, z);
      camera.rotation.y = yaw;
      camera.rotation.x = pitch;

      const t = clock.elapsedTime;
      for (const floater of world?.floaters || []) {
        floater.mesh.position.y = floater.baseY + Math.sin(t * floater.speed + floater.phase) * floater.amp;
        floater.mesh.rotation.y += dt * 0.35;
        floater.mesh.rotation.z += dt * 0.12;
      }

      if (grace <= 0 && location === "hall") {
        const near = nearestDoor();
        if (near && near.distance < 1.2) {
          enterRoom(near.door.roomId);
        } else {
          const room = near ? roomById[near.door.roomId] : null;
          emit({
            event: null,
            looking: near ? "door" : null,
            prompt: near
              ? `Enter ${room.yearLabel} — ${room.plaque}. Press Enter or walk in.`
              : "Walk the hall. Face a year. Press Enter or walk through the door.",
          });
        }
      } else if (location !== "hall") {
        const exhibit = nearestExhibit();
        const exitDist = nearExit();
        if (exitDist < 1.08 && grace <= 0) {
          enterHall();
        } else {
          emit({
            event: exhibit?.event || null,
            looking: exitDist < 1.7 ? "exit" : exhibit ? "event" : null,
            prompt: exitDist < 1.7
              ? "Walk through to return to the Hall of Years"
              : exhibit
                ? exhibit.event.name
                : "The year is scattered. Walk toward a frame.",
          });
        }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    let raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("touchstart", onTouchStart);
      renderer.domElement.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("pointerlockchange", onLockChange);
      if (document.pointerLockElement === renderer.domElement) document.exitPointerLock?.();
      if (world) disposeObject(world.root);
      renderer.dispose();
      host.innerHTML = "";
    };
  }, [rooms, inputRef]);

  return <div ref={mountRef} className="hall-canvas" />;
}
