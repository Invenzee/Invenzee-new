import {
  AmbientLight, Box3, CanvasTexture, Color, DirectionalLight, Group,
  MathUtils, Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry,
  Scene, SRGBColorSpace, Sprite, SpriteMaterial, WebGLRenderer,
  type Material, type Object3D, type Texture,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { createScreen, drawChip, drawScreenshot, drawHeart } from "./marketing-screens";

const assetRoot = "/models/marketing";
const pi = Math.PI;
const mix = MathUtils.lerp;

const blend = (value: number, start: number, end: number) => MathUtils.smootherstep(value, start, end);

function screen(texture: CanvasTexture, width: number, height: number, transparent = false) {
  return new Mesh(
    new PlaneGeometry(width, height),
    new MeshBasicMaterial({ map: texture, toneMapped: false, transparent, alphaTest: transparent ? 0.12 : 0 }),
  );
}

function wrapModel(model: Object3D, pivot: Group, scale: number, origin: [number, number, number]) {
  const holder = new Group();
  pivot.add(holder);
  holder.add(model);
  holder.scale.setScalar(scale);
  model.position.set(...origin);
  return holder;
}

function disposeScene(root: Object3D) {
  const geometries = new Set<PlaneGeometry>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  root.traverse((node) => {
    if (node instanceof Mesh) {
      geometries.add(node.geometry);
      for (const material of Array.isArray(node.material) ? node.material : [node.material]) materials.add(material);
    } else if (node instanceof Sprite) {
      materials.add(node.material);
    }
  });
  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) {
    for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    material.dispose();
  }
  for (const texture of textures) {
    if (texture.source.data instanceof ImageBitmap) texture.source.data.close();
    texture.dispose();
  }
}

async function loadModel(loader: GLTFLoader, name: string, signal: AbortSignal) {
  const response = await fetch(`${assetRoot}/${name}.glb`, { signal });
  if (!response.ok) throw new Error(`Could not load ${name}`);
  return (await loader.parseAsync(await response.arrayBuffer(), assetRoot + "/")).scene;
}

async function loadScreenshot(name: string) {
  const image = new Image();
  image.src = `${assetRoot}/${name}`;
  await image.decode();
  return image;
}

function makePhone(model: Group) {
  const feed = createScreen(480, 1024);
  const display = screen(feed.texture, 0.079, 0.164, true);
  // The screen faces -Z in the supplied model. The camera looks from +Z.
  display.position.z = -0.00445;
  display.rotation.y = pi;
  model.add(display);
  const root = new Group();
  const holder = wrapModel(model, root, 23, [0, 0, 0]);
  holder.rotation.y = pi;
  const bounds = new Box3().setFromObject(root);
  const surfaces = new Set<Material>();
  root.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    for (const material of materials) {
      material.transparent = true;
      surfaces.add(material);
    }
  });
  return { root, feed, bounds, surfaces };
}

function makeLaptop(model: Group) {
  const view = createScreen(960, 600);
  const display = screen(view.texture, 0.294, 0.183);
  display.position.set(0, 0.114, -0.107);
  model.add(display);

  const root = new Group();
  wrapModel(model, root, 13.2, [0, -0.092, 0]);
  return { root, view };
}

function makeSprite(texture: CanvasTexture) {
  const chip = new Sprite(new SpriteMaterial({ map: texture, transparent: true, depthWrite: false, depthTest: false, toneMapped: false }));
  chip.renderOrder = 2;
  return chip;
}

export async function mountMarketingScene(
  host: HTMLElement,
  signal: AbortSignal,
  connectScroll: (update: (progress: number) => void) => () => void,
  updateCopy: (socialOpacity: number, seoOpacity: number) => void,
) {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(new Color("#07081c"), 0);
  renderer.outputColorSpace = SRGBColorSpace;
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 60);
  camera.position.z = 16;
  const key = new DirectionalLight("#f5f7ff", 2.8);
  key.position.set(3, 5, 7);
  const rim = new DirectionalLight("#bce8e8", 2.6);
  rim.position.set(-3, 3, -5);
  scene.add(key, rim, new AmbientLight("#ffffff", 2.1));

  try {
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const mono = getComputedStyle(host).getPropertyValue("--font-dm-mono").split(",")[0].trim() || "monospace";
    const fontReady = document.fonts.load(`500 29px ${mono}`).catch(() => []);
    const screenshots = Promise.allSettled(
      ["instagram-office-camera.jpg", "instagram-salary-day.jpg", "search-console.png", "meta-business-suite.png", "gmail-inbox.png"].map(loadScreenshot),
    );
    const models = await Promise.allSettled(
      ["iphone_14_pro", "macbook"].map(async (name) => {
        const model = await loadModel(loader, name, signal);
        scene.add(model);
        return model;
      }),
    );
    const [phoneModel, laptopModel] = models;
    const [[heroPost, socialPost, searchConsole, meta, gmail]] = await Promise.all([screenshots, fontReady]);
    if (signal.aborted || phoneModel.status !== "fulfilled" || laptopModel.status !== "fulfilled"
      || heroPost.status !== "fulfilled" || socialPost.status !== "fulfilled" || searchConsole.status !== "fulfilled" || meta.status !== "fulfilled" || gmail.status !== "fulfilled") {
      throw new Error("Marketing scene assets unavailable");
    }

    const phone = makePhone(phoneModel.value);
    const laptop = makeLaptop(laptopModel.value);
    const engagement = createScreen(356, 80);
    const engagementChip = makeSprite(engagement.texture);
    const heart = createScreen(80, 80);
    drawHeart(heart.ctx);
    const hearts = Array.from({ length: 4 }, () => makeSprite(heart.texture));
    scene.add(phone.root, laptop.root, engagementChip, ...hearts);
    const phoneHeight = phone.bounds.max.y - phone.bounds.min.y;
    const phoneWidth = phone.bounds.max.x - phone.bounds.min.x;

    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    let width = 0;
    let height = 7;
    let compact = false;
    let target = 0;
    let progress = 0;
    let onscreen = true;
    let previousFeed = -1;
    let previousLaptopImage: HTMLImageElement | undefined;
    let previousEngagement = -1;
    let yaw = 0;
    let pitch = 0;
    let targetYaw = 0;
    let targetPitch = 0;
    let badgeOpacity = 1;
    let copyOpacity = 1;
    let seoOpacity = 0;
    let rendered = false;
    let lastTime = performance.now();

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      compact = w <= 760;
      height = compact ? 4.5 : 7;
      width = height * w / h;
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.setSize(w, h, false);
    };

    const position = (side: number) => compact ? 0 : width * 0.244 * side;
    const draw = (now: number) => {
      if (!onscreen || !width) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      progress = Math.abs(target - progress) > 1.15 ? target : MathUtils.damp(progress, target, 8, dt);
      if (Math.abs(progress - target) < 0.001) progress = target;
      yaw = MathUtils.damp(yaw, targetYaw, 6, dt);
      pitch = MathUtils.damp(pitch, targetPitch, 6, dt);
      const nextBadgeOpacity = 1 - blend(progress, 0.015, 0.25);
      if (badgeOpacity !== nextBadgeOpacity) {
        badgeOpacity = nextBadgeOpacity;
        host.parentElement?.style.setProperty("--hero-badge-opacity", String(badgeOpacity));
      }

      const t = now / 1000;
      const sceneScale = compact ? Math.min(0.94, width / 4.4) : Math.min(1, width / 10.9);
      const reveal = blend(progress, 0.01, 0.86);
      const socialFade = blend(progress, 1.02, 1.20);
      const phoneZoom = blend(progress, 1.20, 1.65);
      const phoneFade = blend(progress, 1.65, 1.81);
      const swap = blend(progress, 1.81, 2.00);
      if (copyOpacity !== 1 - socialFade || seoOpacity !== swap) {
        copyOpacity = 1 - socialFade;
        seoOpacity = swap;
        updateCopy(copyOpacity, seoOpacity);
      }
      const shift = blend(progress, 2.16, 2.92);
      const emailShift = blend(progress, 3.15, 3.92);
      const floating = Math.sin(t * 1.8) * 0.11;
      const right = position(1);
      const left = position(-1);
      const heroScale = Math.min(height * 1.11 / phoneHeight, width * (compact ? 0.42 : 0.29) / phoneWidth);
      // Set the projected bottom 30% of the front-facing phone below the stage.
      const heroY = -height / 2 - (phone.bounds.min.y + phoneHeight * 0.30) * heroScale;
      const phoneX = mix(mix(right, left, reveal), 0, phoneZoom);
      const phoneY = mix(mix(heroY, 0.13 + floating, reveal), 0, phoneZoom);
      const phoneScale = mix(mix(heroScale, sceneScale, reveal), width / phoneWidth, phoneZoom);
      const phoneTurn = reveal * 2 * pi;
      const phoneTilt = 1 - phoneZoom;

      phone.root.visible = phoneFade < 0.998;
      phone.root.position.set(phoneX, phoneY, 0.28);
      phone.root.rotation.set(pitch * phoneTilt, yaw * phoneTilt + phoneTurn, -yaw * 0.22 * phoneTilt);
      phone.root.scale.setScalar(phoneScale);
      for (const material of phone.surfaces) material.opacity = 1 - phoneFade;
      const feedProgress = Math.round(blend(progress, 0.27, 1.08) * 28);
      if (phone.root.visible && previousFeed !== feedProgress) {
        const postProgress = feedProgress / 28;
        drawScreenshot(phone.feed.ctx, heroPost.value, true, postProgress, {
          image: socialPost.value,
          opacity: blend(postProgress, 0.23, 0.52),
        });
        phone.feed.texture.needsUpdate = true;
        previousFeed = feedProgress;
      }

      laptop.root.visible = swap > 0.004;
      laptop.root.position.set(mix(mix(right, left, shift), right, emailShift), -0.06 + floating * 0.50, 0);
      laptop.root.scale.setScalar(sceneScale * Math.max(0.001, swap * mix(1, 0.87, emailShift)));
      laptop.root.rotation.set(pitch + mix(0.10, 0.20, shift), yaw + mix(mix(-0.26, 0.26, shift), -0.15, emailShift), (1 - swap) * 0.45 - shift * 0.04 - yaw * 0.12);
      const laptopImage = progress >= 3.52 ? gmail.value : progress > 2.52 ? meta.value : searchConsole.value;
      if (laptop.root.visible && laptopImage !== previousLaptopImage) {
        drawScreenshot(laptop.view.ctx, laptopImage);
        laptop.view.texture.needsUpdate = true;
        previousLaptopImage = laptopImage;
      }

      const social = blend(progress, 0.54, 0.91) * (1 - socialFade);
      engagementChip.visible = social > 0.005;
      engagementChip.material.opacity = social;
      engagementChip.position.set(phoneX + 1.15 * sceneScale, (1.65 + 0.11 * Math.sin(t * 2)) * sceneScale, 3);
      engagementChip.scale.set(1.66 * sceneScale, 0.37 * sceneScale, 1);
      if (social > 0.005 && feedProgress !== previousEngagement) {
        const count = Math.round(148 + feedProgress / 28 * 1136).toLocaleString("en-US");
        drawChip(engagement.ctx, "♥", `${count} engagements`, "#ffd4e6", mono);
        engagement.texture.needsUpdate = true;
        previousEngagement = feedProgress;
      }
      hearts.forEach((heart, index) => {
        const age = (t * 0.62 + index * 0.25) % 1;
        const size = (0.25 + age * 0.12) * sceneScale;
        heart.material.opacity = social * Math.sin(age * pi);
        heart.visible = social > 0.005;
        heart.position.set(phoneX + (0.55 + 0.27 * Math.sin(index * 2.4 + age * 4) + age * 0.6) * sceneScale, phoneY + age * sceneScale * 1.55, 3);
        heart.scale.set(size, size, 1);
      });
      renderer.render(scene, camera);
      if (!rendered) {
        rendered = true;
        host.dataset.rendered = "true";
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      targetYaw = (event.clientX / window.innerWidth * 2 - 1) * 0.34;
      targetPitch = (event.clientY / window.innerHeight * 2 - 1) * 0.24;
    };
    const resetTilt = () => { targetYaw = 0; targetPitch = 0; };
    const intersection = new IntersectionObserver(([entry]) => { onscreen = entry.isIntersecting; });
    const size = new ResizeObserver(resize);
    const disconnect = connectScroll((next) => { target = next; });
    progress = target;
    resize();
    intersection.observe(host);
    size.observe(host);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", resetTilt);
    document.documentElement.addEventListener("pointerleave", resetTilt);
    renderer.setAnimationLoop(draw);

    return () => {
      disconnect();
      intersection.disconnect();
      size.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", resetTilt);
      document.documentElement.removeEventListener("pointerleave", resetTilt);
      delete host.dataset.rendered;
      host.parentElement?.style.removeProperty("--hero-badge-opacity");
      renderer.setAnimationLoop(null);
      renderer.domElement.remove();
      disposeScene(scene);
      renderer.dispose();
    };
  } catch (error) {
    renderer.domElement.remove();
    disposeScene(scene);
    renderer.dispose();
    if (!signal.aborted) throw error;
  }
}
