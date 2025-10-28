"use client";

import React, { MutableRefObject, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, useFBX } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Box3, DoubleSide, Group, OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import { PALETTE } from "@/components/palette";

type CharacterConfig = {
  id: string;
  /**
   * Ruta al archivo .fbx del personaje (relativa a /public).
   */
  model?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /**
   * Ajusta la escala automáticamente para que el modelo alcance esta altura (en unidades de escena).
   * Se aplica junto al factor `scale`.
   */
  fitHeight?: number;
  alignBottom?: boolean;
  onBoundsComputed?: (bounds: { size: Vector3; box: Box3; finalScale: number }) => void;
};

type AtrilSceneProps = {
  /**
   * Ruta al archivo .fbx del atril (por ejemplo "/models/atril.fbx").
   */
  atrilModel?: string | null;
  /**
   * Lista de modelos de personajes que se posicionarán encima del atril.
   */
  characters?: CharacterConfig[];
  /**
   * Permite activar la rotación automática de la cámara.
   */
  autoRotate?: boolean;
};


function FBXModel({
  url,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  alignBottom = false,
  fitHeight,
  onBoundsComputed,
}: {
  url: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  alignBottom?: boolean;
  fitHeight?: number;
  onBoundsComputed?: (bounds: { size: Vector3; box: Box3; finalScale: number }) => void;
}) {
  const original = useFBX(url);
  const reportedBounds = useRef<string | null>(null);
  const isAtrilModel = useMemo(() => url.toLowerCase().includes("atril"), [url]);

  useEffect(() => {
    reportedBounds.current = null;
  }, [original]);

  const { alignedScene, resolvedScale } = useMemo(() => {
    const clone = original.clone() as Group;

    const scratch = new Vector3();
    const baseCandidates: Array<{ mesh: any; bounds: Box3 }> = [];
    const footprintMeshes: any[] = [];

    clone.updateMatrixWorld(true);

    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (isAtrilModel && child.geometry) {
          if (!child.geometry.boundingBox) {
            child.geometry.computeBoundingBox();
          }
          const bbox = child.geometry.boundingBox;
          if (bbox) {
            scratch.copy(bbox.max).sub(bbox.min);
            const height = scratch.y;
            const width = scratch.x;
            const depth = scratch.z;
            const isWidePlate = height < 0.12 && width > 0.35 && depth > 0.35;
            const isThinDisc = height < 0.08 && Math.max(width, depth) > 0.25 && Math.min(width, depth) > 0.18;
            if (isWidePlate || isThinDisc) {
              child.visible = false;
              return;
            }
          }
        }
        if (isAtrilModel) {
          const meshBounds = new Box3().setFromObject(child);
          baseCandidates.push({ mesh: child, bounds: meshBounds });
        }
        if (alignBottom) {
          footprintMeshes.push(child);
        }
        const tuneMaterial = (material: any) => {
          if (!material || typeof material !== "object") {
            return;
          }
          if ("side" in material) {
            material.side = DoubleSide;
          }
          if ("transparent" in material) {
            material.transparent = false;
          }
          if ("opacity" in material && typeof material.opacity === "number") {
            material.opacity = 1;
          }
          if ("depthWrite" in material) {
            material.depthWrite = true;
          }
          if ("alphaTest" in material) {
            material.alphaTest = 0;
          }
          if ("needsUpdate" in material) {
            material.needsUpdate = true;
          }
        };
        if (Array.isArray(child.material)) {
          child.material.forEach(tuneMaterial);
        } else {
          tuneMaterial(child.material);
        }
      }
    });

    const box = new Box3().setFromObject(clone);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const offsetY = alignBottom ? box.min.y : center.y;

    let baseCenter = center.clone();
    if (alignBottom && footprintMeshes.length > 0) {
      clone.updateMatrixWorld(true);
      const vertex = new Vector3();
      const worldVertex = new Vector3();
      const footprintThreshold = box.min.y + Math.max(size.y * 0.02, 0.004);
      let sumX = 0;
      let sumZ = 0;
      let counted = 0;

      for (const mesh of footprintMeshes) {
        if (!mesh.visible || !mesh.geometry?.attributes?.position) {
          continue;
        }
        const position = mesh.geometry.attributes.position;
        for (let i = 0; i < position.count; i++) {
          vertex.set(position.getX(i), position.getY(i), position.getZ(i));
          worldVertex.copy(vertex).applyMatrix4(mesh.matrixWorld);
          if (worldVertex.y <= footprintThreshold) {
            sumX += worldVertex.x;
            sumZ += worldVertex.z;
            counted += 1;
          }
        }
      }

      if (counted > 0) {
        baseCenter.x = sumX / counted;
        baseCenter.z = sumZ / counted;
      }
    }

    if (isAtrilModel && baseCandidates.length > 0) {
      const totalHeight = Math.max(size.y, 0.001);
      const baseThreshold = box.min.y + totalHeight * 0.12;
      baseCandidates.forEach(({ mesh, bounds }) => {
        if (!mesh.visible) {
          return;
        }
        const width = bounds.max.x - bounds.min.x;
        const height = bounds.max.y - bounds.min.y;
        const depth = bounds.max.z - bounds.min.z;
        const centerY = (bounds.max.y + bounds.min.y) / 2;
        const isNearFloor = centerY <= baseThreshold;
        const isBroad = width > 0.32 && depth > 0.32;
        const isBlockyPlate = isNearFloor && isBroad && height < totalHeight * 0.35;

        if (isBlockyPlate) {
          mesh.visible = false;
        }
      });
    }

    const offsetX = alignBottom ? baseCenter.x : center.x;
    const offsetZ = alignBottom ? baseCenter.z : center.z;
    clone.position.set(-offsetX, -offsetY, -offsetZ);

    const wrapper = new Group();
    wrapper.add(clone);

    let finalScale = scale ?? 1;
    if (fitHeight && size.y > 0) {
      finalScale *= fitHeight / size.y;
    } else if (fitHeight && size.y === 0) {
      finalScale *= fitHeight;
    }

    wrapper.scale.setScalar(finalScale);

    const serialized = `${size.x.toFixed(5)}|${size.y.toFixed(5)}|${size.z.toFixed(5)}|${finalScale.toFixed(5)}`;
    if (onBoundsComputed && reportedBounds.current !== serialized) {
      reportedBounds.current = serialized;
      onBoundsComputed({ size, box, finalScale });
    }

    if (process.env.NODE_ENV !== "production") {
      console.debug(
        `[FBXModel] ${url} bbox size=(${size.x.toFixed(3)}, ${size.y.toFixed(
          3,
        )}, ${size.z.toFixed(3)}) scale=${finalScale.toFixed(4)} alignBottom=${alignBottom}`,
      );
    }

    return { alignedScene: wrapper, resolvedScale: 1 };
  }, [original, alignBottom, scale, fitHeight, onBoundsComputed]);

  const uniformScale = useMemo<[number, number, number]>(
    () => [resolvedScale, resolvedScale, resolvedScale],
    [resolvedScale],
  );

  return (
    <group position={position} rotation={rotation} scale={uniformScale}>
      <primitive object={alignedScene} />
    </group>
  );
}

function AtrilPlaceholder() {
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 24]} />
        <meshStandardMaterial color={PALETTE.sky} metalness={0.15} roughness={0.45} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 1.2, 16]} />
        <meshStandardMaterial color={PALETTE.lavender} metalness={0.12} roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.15, -0.25]} rotation={[-0.45, 0, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.8]} />
        <meshStandardMaterial color={PALETTE.rose} metalness={0.12} roughness={0.4} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.25, -0.32]} rotation={[-0.45, 0, 0]}>
        <planeGeometry args={[1.1, 0.7]} />
        <meshStandardMaterial color={PALETTE.paper} />
      </mesh>
    </group>
  );
}

function CharacterPlaceholder({
  hueOffset = 0,
  position,
}: {
  hueOffset?: number;
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color={`hsl(${210 + hueOffset}, 80%, 70%)`} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.9, 24]} />
        <meshStandardMaterial color={`hsl(${200 + hueOffset}, 60%, 60%)`} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.12, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color={`hsl(${200 + hueOffset}, 60%, 60%)`} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.12, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color={`hsl(${200 + hueOffset}, 60%, 60%)`} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.05, -0.1]}>
        <boxGeometry args={[0.3, 0.12, 0.2]} />
        <meshStandardMaterial color={`hsl(${210 + hueOffset}, 80%, 65%)`} />
      </mesh>
    </group>
  );
}

function GalleryBackdrop() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.006, 0]}>
        <circleGeometry args={[2.45, 64]} />
        <meshStandardMaterial color={PALETTE.lavender} metalness={0.18} roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.004, 0]}>
        <ringGeometry args={[2.1, 2.35, 64]} />
        <meshStandardMaterial color={PALETTE.rose} metalness={0.2} roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.4, -1.6]} rotation={[0, 0, 0]}>
        <planeGeometry args={[5.2, 3.2]} />
        <meshStandardMaterial color={PALETTE.sky} metalness={0.1} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.8, -1.9]} rotation={[0, 0, 0]}>
        <planeGeometry args={[4.2, 2.4]} />
        <meshStandardMaterial color={PALETTE.lime} metalness={0.08} roughness={0.65} />
      </mesh>
      <mesh position={[0, 2.45, -2.1]}>
        <planeGeometry args={[2.2, 1.1]} />
        <meshStandardMaterial emissive={PALETTE.sky} emissiveIntensity={0.12} color={PALETTE.lavender} roughness={0.35} />
      </mesh>
    </group>
  );
}

function CameraRig({
  target,
  height,
  controls,
}: {
  target: [number, number, number];
  height: number;
  controls?: MutableRefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();

  useEffect(() => {
    const perspectiveCamera = camera as PerspectiveCamera | OrthographicCamera;
    if (!(perspectiveCamera instanceof PerspectiveCamera)) {
      return;
    }

    const safeHeight = Math.max(height, 0.8);
    const margin = 1.25;
    const fovRad = (perspectiveCamera.fov * Math.PI) / 180;
    const coverageDistance = ((safeHeight / 2) / Math.tan(fovRad / 2)) * margin;
    const distance = Math.max(4.2, coverageDistance);
    const lateralOffset = Math.min(Math.max(safeHeight * 0.16, 0.38), 0.95);
    const verticalOffset = Math.max(safeHeight * 0.52, 1.15);

    perspectiveCamera.fov = 28;
    perspectiveCamera.position.set(
      target[0] + lateralOffset,
      target[1] + verticalOffset,
      target[2] + distance,
    );
    perspectiveCamera.lookAt(target[0], target[1], target[2]);
    perspectiveCamera.updateProjectionMatrix();

    if (controls?.current) {
      controls.current.target.set(target[0], target[1], target[2]);
      controls.current.minDistance = Math.max(distance * 0.55, 2.2);
      controls.current.maxDistance = distance * 2.2;
      controls.current.update();
    }
  }, [camera, controls, height, target]);

  return null;
}

function SceneContents({
  atrilModel,
  characters = [],
  onFrameChange,
}: {
  atrilModel?: string;
  characters?: CharacterConfig[];
  onFrameChange?: (frame: { target: [number, number, number]; height: number }) => void;
}) {
  const [atrilHeight, setAtrilHeight] = useState<number | null>(null);
  const [characterHeights, setCharacterHeights] = useState<Record<string, number>>({});

  useEffect(() => {
    setCharacterHeights((prev) => {
      const allowedIds = new Set(characters.map((c) => c.id));
      let changed = false;
      const next: Record<string, number> = {};
      for (const id of allowedIds) {
        if (prev[id] !== undefined) {
          next[id] = prev[id];
        }
      }
      if (Object.keys(prev).length !== Object.keys(next).length) {
        changed = true;
      }
      return changed ? next : prev;
    });
  }, [characters]);

  const updateCharacterHeight = useCallback((id: string, height: number) => {
    if (!Number.isFinite(height)) {
      return;
    }
    setCharacterHeights((prev) => {
      const previous = prev[id];
      if (previous !== undefined && Math.abs(previous - height) < 1e-4) {
        return prev;
      }
      return { ...prev, [id]: height };
    });
  }, []);

  useEffect(() => {
    if (!onFrameChange) {
      return;
    }

    const baseHeight = atrilHeight ?? 0;
    let minY = 0;
    let maxY = baseHeight;

    characters.forEach((character) => {
      const recordedHeight = characterHeights[character.id];
      if (!recordedHeight) {
        return;
      }

      const defaultY = atrilHeight !== null ? atrilHeight + 0.02 : 1.22;
      const position = character.position ?? [0, defaultY, 0];
      const alignBottom = character.alignBottom ?? false;

      const minCandidate = alignBottom
        ? position[1]
        : position[1] - recordedHeight / 2;
      const maxCandidate = alignBottom
        ? position[1] + recordedHeight
        : position[1] + recordedHeight / 2;

      minY = Math.min(minY, minCandidate);
      maxY = Math.max(maxY, maxCandidate);
    });

    if (maxY <= minY) {
      maxY = minY + 0.5;
    }

    const centerY = (minY + maxY) / 2;
    const focusOffsetY = 0.12;
    const target: [number, number, number] = [0, centerY + focusOffsetY, 0];
    const span = Math.max((maxY - minY) * 1.12, 0.7);
    onFrameChange({ target, height: span });
  }, [atrilHeight, characterHeights, characters, onFrameChange]);

  return (
    <>
      {atrilModel ? (
        <FBXModel
          url={atrilModel}
          scale={0.01}
          alignBottom
          onBoundsComputed={({ box, finalScale }) => {
            const height = (box.max.y - box.min.y) * finalScale;
            if (!Number.isFinite(height)) {
              return;
            }
            setAtrilHeight((prev) => {
              if (prev === null || Math.abs(prev - height) > 1e-4) {
                return height;
              }
              return prev;
            });
          }}
        />
      ) : (
        <AtrilPlaceholder />
      )}
      {characters.length > 0
        ? characters.map((character, index) =>
            character.model ? (
              <FBXModel
                key={character.id}
                url={character.model}
                scale={character.scale ?? (character.fitHeight ? 1 : 0.01)}
                position={
                  character.position ??
                  [
                    0,
                    atrilHeight !== null ? atrilHeight + 0.02 : 1.22,
                    0,
                  ]
                }
                rotation={character.rotation ?? [0, 0, 0]}
                alignBottom={character.alignBottom}
                fitHeight={character.fitHeight}
                onBoundsComputed={({ box, finalScale }) => {
                  const height = (box.max.y - box.min.y) * finalScale;
                  updateCharacterHeight(character.id, height);
                }}
              />
            ) : (
              <CharacterPlaceholder
                key={character.id}
                hueOffset={index * 40}
                position={character.position ?? [0, 1.2, 0]}
              />
            ),
          )
        : [
            <CharacterPlaceholder key="placeholder-a" position={[-0.4, 1.2, 0]} hueOffset={10} />,
            <CharacterPlaceholder key="placeholder-b" position={[0.4, 1.2, 0]} hueOffset={60} />,
          ]}
    </>
  );
}

export default function AtrilScene({
  atrilModel,
  characters,
  autoRotate = true,
}: AtrilSceneProps) {
  const shouldRenderAtril = atrilModel !== null;
  const resolvedAtrilModel = shouldRenderAtril
    ? atrilModel ?? "/3d/atril2.fbx"
    : undefined;
  type SceneFrame = { target: [number, number, number]; height: number };
  const [frame, setFrame] = useState<SceneFrame>({
    target: [0, 1.6, 0],
    height: 2.4,
  });
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const handleFrameChange = useCallback((next: SceneFrame) => {
    setFrame((prev) => {
      const heightDiff = Math.abs(prev.height - next.height);
      const targetDiff =
        Math.abs(prev.target[0] - next.target[0]) +
        Math.abs(prev.target[1] - next.target[1]) +
        Math.abs(prev.target[2] - next.target[2]);
      if (heightDiff < 1e-3 && targetDiff < 1e-3) {
        return prev;
      }
      return next;
    });
  }, []);

  const focusTarget = frame.target;

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-brand-lavender/30 bg-[rgba(29,27,41,0.85)]">
      <Canvas
        shadows
        camera={{ position: [0, 2.8, 6.2], fov: 28 }}
        dpr={[1, 1.8]}
      >
        <color attach="background" args={["#1c1a2a"]} />
        <ambientLight intensity={0.55} color="#f8f9ff" />
        <hemisphereLight intensity={0.85} groundColor={PALETTE.ink} color="#d4ddff" />
        <directionalLight
          castShadow
          position={[5.5, 6.5, 4]}
          intensity={3.2}
          color="#ffffff"
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight
          position={[-4.5, 5.5, -3.8]}
          intensity={0.9}
          color={PALETTE.rose}
        />
        <spotLight
          castShadow
          position={[-2.4, 4.6, 2.6]}
          angle={Math.PI / 6}
          penumbra={0.72}
          intensity={3.2}
          color={PALETTE.rose}
          distance={16}
          decay={1.05}
          shadow-bias={-0.00016}
        />
        <spotLight
          castShadow
          position={[2.8, 4.5, 2.8]}
          angle={Math.PI / 6.2}
          penumbra={0.68}
          intensity={3.2}
          color={PALETTE.sky}
          distance={16}
          decay={1.05}
          shadow-bias={-0.00016}
        />
        <spotLight
          castShadow
          position={[0.8, 4.2, 3.2]}
          angle={Math.PI / 5.2}
          penumbra={0.62}
          intensity={4.1}
          color="#fdfbff"
          distance={18}
          decay={1.03}
          shadow-bias={-0.00011}
        />
        <spotLight
          position={[0, 5.8, -3.5]}
          angle={Math.PI / 5}
          penumbra={0.52}
          intensity={2.1}
          color="#edefff"
          distance={22}
          decay={1.02}
        />
        <spotLight
          castShadow
          position={[0, 6.4, 1.4]}
          angle={Math.PI / 7}
          penumbra={0.5}
          intensity={2.8}
          color={PALETTE.lime}
          distance={14}
          decay={1.02}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.00012}
        >
          <object3D position={[0, focusTarget[1] + 0.4, 0]} />
        </spotLight>
        <spotLight
          position={[0, 2.2, -4.8]}
          angle={Math.PI / 4}
          penumbra={0.35}
          intensity={1.3}
          color="#dbe1ff"
          distance={22}
          decay={1.1}
        >
          <object3D position={[0, focusTarget[1], 0]} />
        </spotLight>
        <CameraRig target={frame.target} height={frame.height} controls={controlsRef} />
        {/* Luces puntuales que acentúan al personaje activo */}
        <group>
          <pointLight
            position={[focusTarget[0] + 0.4, focusTarget[1] + 0.9, focusTarget[2] + 0.3]}
            color="#ffe3cb"
            intensity={3.1}
            distance={7.4}
            decay={1.06}
          />
          <pointLight
            position={[focusTarget[0] - 0.6, focusTarget[1] + 0.6, focusTarget[2] - 0.2]}
            color="#e4f2ff"
            intensity={2.7}
            distance={6.4}
            decay={1.12}
          />
          <pointLight
            position={[focusTarget[0], focusTarget[1] + 1.6, focusTarget[2] - 0.8]}
            color="#f4ffe3"
            intensity={2}
            distance={7.6}
            decay={1.05}
          />
          <pointLight
            position={[focusTarget[0], focusTarget[1] + 0.4, focusTarget[2] + 0.6]}
            color="#ebe6ff"
            intensity={1.8}
            distance={5.8}
            decay={1.08}
          />
        </group>

        <Suspense fallback={null}>
          <GalleryBackdrop />
          <SceneContents
            atrilModel={resolvedAtrilModel}
            characters={characters}
            onFrameChange={handleFrameChange}
          />
          <Environment preset="lobby" />
        </Suspense>

        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.38}
          scale={6.4}
          blur={2.8}
          far={4.6}
        />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableDamping
          dampingFactor={0.1}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 1.85}
          autoRotate={autoRotate}
          autoRotateSpeed={0.4}
          target={focusTarget}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent p-4 text-right text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
        Arrastra para girar · Scroll para acercar
      </div>
    </div>
  );
}
