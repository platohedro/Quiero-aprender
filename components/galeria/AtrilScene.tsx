"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useFBX,
} from "@react-three/drei";
import { Box3, DoubleSide, Group, Vector3 } from "three";

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

  useEffect(() => {
    reportedBounds.current = null;
  }, [original]);

  const { alignedScene, resolvedScale } = useMemo(() => {
    const clone = original.clone() as Group;

    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const applySide = (material: any) => {
          if (material && typeof material === "object" && "side" in material) {
            material.side = DoubleSide;
          }
        };
        if (Array.isArray(child.material)) {
          child.material.forEach(applySide);
        } else {
          applySide(child.material);
        }
      }
    });

    const box = new Box3().setFromObject(clone);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const offsetY = alignBottom ? box.min.y : center.y;

    clone.position.set(-center.x, -offsetY, -center.z);

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
        <meshStandardMaterial color="#475569" metalness={0.2} roughness={0.4} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 1.2, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.15} roughness={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.15, -0.25]} rotation={[-0.45, 0, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.8]} />
        <meshStandardMaterial color="#334155" metalness={0.1} roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.25, -0.32]} rotation={[-0.45, 0, 0]}>
        <planeGeometry args={[1.1, 0.7]} />
        <meshStandardMaterial color="#0f172a" />
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

function SceneContents({
  atrilModel,
  characters = [],
}: {
  atrilModel?: string;
  characters?: CharacterConfig[];
}) {
  const [atrilHeight, setAtrilHeight] = useState<number | null>(null);

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

function LoadingBackdrop() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color="#0f172a" />
    </mesh>
  );
}

export default function AtrilScene({
  atrilModel,
  characters,
  autoRotate = true,
}: AtrilSceneProps) {
  const shouldRenderAtril = atrilModel !== null;
  const resolvedAtrilModel = shouldRenderAtril
    ? atrilModel ?? "/3d/atril.fbx"
    : undefined;

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-900">
      <Canvas
        shadows
        camera={{ position: [3.5, 2.2, 4.8], fov: 38 }}
        dpr={[1, 1.8]}
      >
        <color attach="background" args={["#020617"]} />
        <hemisphereLight intensity={0.5} groundColor="#0f172a" color="#f8fafc" />
        <directionalLight
          castShadow
          position={[5.5, 6.5, 4]}
          intensity={1.4}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <Suspense fallback={null}>
          <LoadingBackdrop />
          <SceneContents atrilModel={resolvedAtrilModel} characters={characters} />
          <Environment preset="studio" />
        </Suspense>

        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.5}
          scale={12}
          blur={3.6}
          far={4.5}
        />
        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.1}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={autoRotate}
          autoRotateSpeed={0.4}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent p-4 text-right text-xs font-medium uppercase tracking-[0.2em] text-slate-200/70">
        Arrastra para girar · Scroll para acercar
      </div>
    </div>
  );
}
