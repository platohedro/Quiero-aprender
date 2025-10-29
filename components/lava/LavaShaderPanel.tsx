"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, extend, ReactThreeFiber, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { AdditiveBlending, Color, DataTexture, InstancedMesh, LinearFilter, Matrix4, MeshBasicMaterial, Object3D, RepeatWrapping, RGBAFormat, ShaderMaterial, Texture, Vector3 } from "three";

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform float fogDensity;
  uniform vec3 fogColor;
  uniform sampler2D texture1; // noise
  uniform sampler2D texture2; // gradient ramp
  uniform float intensity;

  varying vec2 vUv;

  // cheap fbm using the noise texture
  float noiseTex(vec2 uv){
    return texture2D(texture1, uv).r;
  }
  float fbm(vec2 uv){
    float s = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6,1.2,-1.2,1.6);
    for(int i=0;i<4;i++){
      s += a * noiseTex(uv);
      uv = m * uv + 0.07;
      a *= 0.5;
    }
    return s;
  }

  void main(){
    vec2 uv = vUv;
    // keep safe borders inside beaker mask
    uv = uv * vec2(0.88, 0.96) + vec2(0.06, 0.02);

    // Oil background color (warm yellow)
    vec3 oil = vec3(1.0, 0.89, 0.58);

    // Flow field that rises over time
    float speed = mix(0.18, 0.45, clamp(intensity, 0.0, 1.6));
    vec2 flowUv = vec2(uv.x, uv.y - time * speed);

    // Build columns: horizontal sin bands + fbm distort + vertical falloff
    float columns = sin(flowUv.x * 9.0 + fbm(flowUv * 2.0) * 1.8) * 0.5 + 0.5;
    columns += fbm(flowUv * 3.0) * 0.45; // blobby
    columns -= uv.y * 0.85; // push upwards so shapes grow from bottom

    // mask of lava with soft edges; intensity tightens threshold
    float edge = mix(0.36, 0.48, 1.0 - clamp(intensity * 0.6, 0.0, 0.9));
    float lavaMask = smoothstep(edge, edge + 0.08, columns);

    // Sample gradient by mask for rich reds/oranges
    vec3 lava = texture2D(texture2, vec2(clamp(lavaMask, 0.0, 1.0), 0.5)).rgb;

    // Inner glow and rim highlight
    float rim = smoothstep(0.0, 0.06, abs(dFdx(lavaMask)) + abs(dFdy(lavaMask)));
    vec3 glow = mix(vec3(0.0), vec3(1.0,0.85,0.4), rim) * 0.35;

    // Tiny bubble speckles rising in the oil
    vec2 grid = uv * vec2(64.0, 120.0);
    vec2 cell = floor(grid + vec2(0.0, time * (0.6 + intensity)));
    float rnd = fract(sin(dot(cell, vec2(12.9898,78.233))) * 43758.5453);
    float speck = step(0.992, rnd) * smoothstep(0.0, 0.6, fract(grid.y));

    vec3 col = mix(oil, lava, lavaMask);
    col += glow;
    col += speck * vec3(1.0);
    col *= 0.9 + intensity * 0.15;

    // optional very light fog to soften top
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    const float LOG2 = 1.442695;
    float fogFactor = exp2(-fogDensity * fogDensity * depth * depth * LOG2);
    fogFactor = 1.0 - clamp(fogFactor, 0.0, 1.0);
    vec3 finalCol = mix(col, mix(col, fogColor, 0.1), fogFactor * 0.2);

    gl_FragColor = vec4(finalCol, 1.0);
  }
`;

const LavaMaterial = shaderMaterial(
  {
    time: 0,
    fogDensity: 0.0,
    fogColor: new Color("#10070f"),
    texture1: null as Texture | null,
    texture2: null as Texture | null,
    intensity: 1,
  },
  vertexShader,
  fragmentShader,
);

extend({ LavaMaterial });

type LavaMaterialImpl = ShaderMaterial & {
  time: number;
  fogDensity: number;
  fogColor: Color;
  texture1: Texture | null;
  texture2: Texture | null;
  intensity: number;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      lavaMaterial: ReactThreeFiber.Object3DNode<LavaMaterialImpl, typeof LavaMaterial>;
    }
  }
}

function createNoiseTexture(size = 256) {
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const stride = i * 4;
    const value = Math.floor(Math.random() * 255);
    const tint = Math.floor(Math.random() * 60);
    data[stride] = value;
    data[stride + 1] = (value + tint) % 255;
    data[stride + 2] = (value + 30) % 255;
    data[stride + 3] = 255;
  }
  const texture = new DataTexture(data, size, size, RGBAFormat);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

function createGradientTexture() {
  const width = 256;
  const data = new Uint8Array(width * 4);

  const stops = [
    { stop: 0, color: [60, 12, 18] },
    { stop: 0.2, color: [140, 30, 35] },
    { stop: 0.45, color: [220, 70, 30] },
    { stop: 0.75, color: [255, 165, 50] },
    { stop: 1, color: [255, 230, 120] },
  ];

  const lerp = (a: number[], b: number[], t: number) => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];

  for (let i = 0; i < width; i++) {
    const t = i / (width - 1);
    let start = stops[0];
    let end = stops[stops.length - 1];
    for (let j = 0; j < stops.length - 1; j++) {
      const current = stops[j];
      const next = stops[j + 1];
      if (t >= current.stop && t <= next.stop) {
        start = current;
        end = next;
        break;
      }
    }
    const range = end.stop - start.stop;
    const localT = range <= 0 ? 0 : (t - start.stop) / range;
    const [r, g, b] = lerp(start.color, end.color, Math.min(Math.max(localT, 0), 1));
    const stride = i * 4;
    data[stride] = Math.round(r);
    data[stride + 1] = Math.round(g);
    data[stride + 2] = Math.round(b);
    data[stride + 3] = 255;
  }

  const texture = new DataTexture(data, width, 1, RGBAFormat);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

type LavaPlaneProps = {
  intensity: number;
  noiseTexture: Texture;
  colorTexture: Texture;
};

function LavaPlane({ intensity, noiseTexture, colorTexture }: LavaPlaneProps) {
  const materialRef = useRef<any>(null);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.toneMapped = false;
      materialRef.current.transparent = true;
    }
  }, []);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.time = clock.getElapsedTime();
    materialRef.current.intensity = intensity;
  });

  return (
    <mesh>
      <planeGeometry args={[1.22, 1.9, 1, 1]} />
      <lavaMaterial ref={materialRef} texture1={noiseTexture} texture2={colorTexture} fogDensity={0} />
    </mesh>
  );
}

type BubbleFieldProps = {
  count: number;
  intensity: number;
};

function BubbleField({ count, intensity }: BubbleFieldProps) {
  const meshRef = useRef<InstancedMesh>(null!);
  const dummy = useMemo(() => new Object3D(), []);
  const offsets = useMemo(() => {
    // Pre-generate spawn data to keep animation stable between frames
    return new Array(count).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 0.8, // fit inside the beaker mask
      y: Math.random() * -1.2, // start below
      s: 0.03 + Math.random() * 0.08, // size
      speed: 0.15 + Math.random() * 0.45,
      sway: 0.02 + Math.random() * 0.06,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useEffect(() => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as MeshBasicMaterial;
    material.toneMapped = false;
    material.transparent = true;
    material.blending = AdditiveBlending;
    material.depthWrite = false;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const effective = Math.max(0, intensity);
    for (let i = 0; i < count; i++) {
      const o = offsets[i];
      // vertical rise scaled by intensity
      const y = ((o.y + ((t * (o.speed * (0.6 + effective))) % 2.2)) % 2.2) - 1.2;
      // lateral sway
      const x = o.x + Math.sin(t * (0.8 + o.speed) + o.phase) * o.sway * (0.6 + effective);
      dummy.position.set(x, y, 0);
      // subtle scale pulsing
      const scale = o.s * (0.8 + Math.sin(t * 2 + i) * 0.2) * (0.8 + effective * 0.6);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color={new Color("#ff7a45")} />
    </instancedMesh>
  );
}

type LavaShaderPanelProps = {
  active: boolean;
  intensity?: number;
  className?: string;
};

export default function LavaShaderPanel({ active, intensity = 1, className }: LavaShaderPanelProps) {
  const noiseTexture = useMemo(() => createNoiseTexture(), []);
  const colorTexture = useMemo(() => createGradientTexture(), []);
  const effectiveIntensity = active ? intensity : 0.0;

  return (
    <div
      className={`pointer-events-none transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
    >
      <Canvas orthographic camera={{ position: [0, 0, 5], zoom: 180 }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.5]}>
        {/* Background shadered lava flow */}
        <LavaPlane intensity={effectiveIntensity} noiseTexture={noiseTexture} colorTexture={colorTexture} />
        {/* Emissive instanced bubbles for depth and sparkle */}
        <BubbleField count={60} intensity={effectiveIntensity} />
      </Canvas>
    </div>
  );
}
