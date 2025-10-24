"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, extend, ReactThreeFiber, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import {
  Color,
  DataTexture,
  LinearFilter,
  RepeatWrapping,
  RGBAFormat,
  Texture,
} from "three";

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
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform float intensity;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec4 noise = texture2D(texture1, uv);

    vec2 T1 = uv + vec2(1.5, -1.5) * time * 0.02;
    vec2 T2 = uv + vec2(-0.5, 2.0) * time * 0.01;

    T1.x += noise.x * 2.0;
    T1.y += noise.y * 2.0;
    T2.x -= noise.y * 0.2;
    T2.y += noise.z * 0.2;

    float p = texture2D(texture1, T1 * 2.0).a;

    vec4 color = texture2D(texture2, T2 * 2.0);
    vec4 temp = color * (vec4(p, p, p, p) * 2.0) + (color * color - 0.1);
    temp.rgb *= 1.1 * intensity;

    if (temp.r > 1.0) { temp.bg += clamp(temp.r - 2.0, 0.0, 100.0); }
    if (temp.g > 1.0) { temp.rb += temp.g - 1.0; }
    if (temp.b > 1.0) { temp.rg += temp.b - 1.0; }

    vec4 lavaColor = temp;

    float depth = gl_FragCoord.z / gl_FragCoord.w;
    const float LOG2 = 1.442695;
    float fogFactor = exp2(-fogDensity * fogDensity * depth * depth * LOG2);
    fogFactor = 1.0 - clamp(fogFactor, 0.0, 1.0);

    gl_FragColor = mix(lavaColor, vec4(fogColor, lavaColor.w), fogFactor);
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

declare global {
  namespace JSX {
    interface IntrinsicElements {
      lavaMaterial: ReactThreeFiber.Object3DNode<typeof LavaMaterial, typeof LavaMaterial>;
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
        <LavaPlane intensity={effectiveIntensity} noiseTexture={noiseTexture} colorTexture={colorTexture} />
      </Canvas>
    </div>
  );
}
