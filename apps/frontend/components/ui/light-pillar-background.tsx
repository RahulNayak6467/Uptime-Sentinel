"use client";

import { useEffect, useRef } from "react";
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";

type LightPillarBackgroundProps = {
  className?: string;
  topColor?: string;
  bottomColor?: string;
  intensity?: number;
  rotationSpeed?: number;
  glowAmount?: number;
  pillarWidth?: number;
  pillarHeight?: number;
  noiseIntensity?: number;
  pillarRotation?: number;
};

const vertexShader = `#version 300 es
  in vec2 position;
  out vec2 vUv;

  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `#version 300 es
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uTopColor;
  uniform vec3 uBottomColor;
  uniform float uIntensity;
  uniform float uGlowAmount;
  uniform float uPillarWidth;
  uniform float uPillarHeight;
  uniform float uNoiseIntensity;
  uniform float uRotCos;
  uniform float uRotSin;
  uniform float uPillarRotCos;
  uniform float uPillarRotSin;

  in vec2 vUv;
  out vec4 fragColor;

  const float STEP_MULT = 1.1;
  const int MAX_ITER = 56;
  const int WAVE_ITER = 3;
  const float WAVE_SIN = 0.3894183;
  const float WAVE_COS = 0.9210610;

  void main() {
    vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
    uv = vec2(
      uPillarRotCos * uv.x - uPillarRotSin * uv.y,
      uPillarRotSin * uv.x + uPillarRotCos * uv.y
    );

    vec3 ro = vec3(0.0, 0.0, -10.0);
    vec3 rd = normalize(vec3(uv, 1.0));

    vec3 col = vec3(0.0);
    float t = 0.1;

    for (int i = 0; i < MAX_ITER; i++) {
      vec3 p = ro + rd * t;
      p.xz = vec2(uRotCos * p.x - uRotSin * p.z, uRotSin * p.x + uRotCos * p.z);

      vec3 q = p;
      q.y = p.y * uPillarHeight + uTime;

      float freq = 1.0;
      float amp = 1.0;
      for (int j = 0; j < WAVE_ITER; j++) {
        q.xz = vec2(WAVE_COS * q.x - WAVE_SIN * q.z, WAVE_SIN * q.x + WAVE_COS * q.z);
        q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
        freq *= 2.0;
        amp *= 0.5;
      }

      float d = length(cos(q.xz)) - 0.2;
      float bound = length(p.xz) - uPillarWidth;
      float k = 4.0;
      float h = max(k - abs(d - bound), 0.0);
      d = max(d, bound) + h * h * 0.0625 / k;
      d = abs(d) * 0.15 + 0.01;

      float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
      col += mix(uBottomColor, uTopColor, grad) / d;

      t += d * STEP_MULT;
      if (t > 50.0) break;
    }

    float widthNorm = uPillarWidth / 3.0;
    col = tanh(col * uGlowAmount / widthNorm);
    col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453)
      / 15.0 * uNoiseIntensity;

    fragColor = vec4(col * uIntensity, 1.0);
  }
`;

const LightPillarBackground = ({
  className,
  topColor = "#a5b4fc",
  bottomColor = "#4f46e5",
  intensity = 0.85,
  rotationSpeed = 0.25,
  glowAmount = 0.005,
  pillarWidth = 3.0,
  pillarHeight = 0.4,
  noiseIntensity = 0.4,
  pillarRotation = 0,
}: LightPillarBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio, 1.25),
      });
    } catch {
      return;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const toColor = (hex: string) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    };

    const pillarRad = (pillarRotation * Math.PI) / 180;

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [container.offsetWidth, container.offsetHeight] },
        uTopColor: { value: toColor(topColor) },
        uBottomColor: { value: toColor(bottomColor) },
        uIntensity: { value: intensity },
        uGlowAmount: { value: glowAmount },
        uPillarWidth: { value: pillarWidth },
        uPillarHeight: { value: pillarHeight },
        uNoiseIntensity: { value: noiseIntensity },
        uRotCos: { value: 1 },
        uRotSin: { value: 0 },
        uPillarRotCos: { value: Math.cos(pillarRad) },
        uPillarRotSin: { value: Math.sin(pillarRad) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let time = 0;
    let last = performance.now();

    const resize = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };

    const render = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!reducedMotion.matches) {
        time += dt * rotationSpeed;
      }
      program.uniforms.uTime.value = time;
      program.uniforms.uRotCos.value = Math.cos(time * 0.3);
      program.uniforms.uRotSin.value = Math.sin(time * 0.3);
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    topColor,
    bottomColor,
    intensity,
    rotationSpeed,
    glowAmount,
    pillarWidth,
    pillarHeight,
    noiseIntensity,
    pillarRotation,
  ]);

  return <div ref={containerRef} aria-hidden="true" className={className} />;
};

export default LightPillarBackground;
