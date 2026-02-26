"use client";

import Particles from "./Particles";

export default function ParticlesClient() {
  return (
    <Particles
      className="fixed inset-0 -z-10"
      particleColors={["#0a46bd"]}
      particleCount={150}
      particleSpread={10}
      speed={0.1}
      particleBaseSize={100}
      moveParticlesOnHover
      alphaParticles={false}
      disableRotation={false}
      pixelRatio={1}
    />
  );
}