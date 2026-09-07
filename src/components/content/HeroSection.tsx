import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import Link from "next/link";

/**
 * QuantumField
 * A minimal, monochrome wireframe Bloch sphere — its three basis rings
 * and a precessing state vector — rendered in the same black/white
 * palette as the QC@IITI club mark. It is the *only* thing in frame.
 */
const QuantumField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Monochrome palette matching the QC@IITI logo (white marks on black).
    const MONO_WHITE = 0xffffff;
    const MONO_LIGHT = 0xe0e0e0;
    const MONO_MID = 0x8d8d8d;

    const group = new THREE.Group();
    scene.add(group);

    // --- Bloch sphere shell ---
    const sphereGeom = new THREE.SphereGeometry(1.6, 24, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: MONO_WHITE,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const sphere = new THREE.Mesh(sphereGeom, sphereMat);
    group.add(sphere);

    // --- Basis rings (x / y / z great circles), all in shades of white/gray ---
    const makeRing = (color: number, opacity: number, rotation: [number, number, number]) => {
      const curve = new THREE.EllipseCurve(0, 0, 1.6, 1.6, 0, Math.PI * 2, false, 0);
      const points = curve.getPoints(96).map((p) => new THREE.Vector3(p.x, p.y, 0));
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
      const ring = new THREE.LineLoop(geom, mat);
      ring.rotation.set(...rotation);
      return ring;
    };
    const ringX = makeRing(MONO_WHITE, 0.6, [0, 0, 0]);
    const ringY = makeRing(MONO_LIGHT, 0.45, [Math.PI / 2, 0, 0]);
    const ringZ = makeRing(MONO_MID, 0.45, [0, Math.PI / 2, 0]);
    group.add(ringX, ringY, ringZ);

    // --- State vector (precessing arrow) ---
    const arrowDir = new THREE.Vector3(1, 0, 0);
    const arrow = new THREE.ArrowHelper(arrowDir, new THREE.Vector3(0, 0, 0), 1.6, MONO_WHITE, 0.22, 0.12);
    group.add(arrow);

    // --- Scroll-driven camera path ---
    const cameraPath = [
      { pos: new THREE.Vector3(0, 0.4, 6.5), lookAt: new THREE.Vector3(0, 0, 0) },
      { pos: new THREE.Vector3(3.5, -1.2, 4.5), lookAt: new THREE.Vector3(0, 0, 0) },
    ];
    const tempLookAt = new THREE.Vector3();

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollableHeight > 0 ? scrollY / scrollableHeight : 0;

      const pathIndexFloat = scrollPercent * (cameraPath.length - 1);
      const pathIndex = Math.floor(pathIndexFloat);
      const segmentProgress = pathIndexFloat - pathIndex;

      const start = cameraPath[pathIndex];
      const end = cameraPath[pathIndex + 1] || start;

      camera.position.lerpVectors(start.pos, end.pos, segmentProgress);
      tempLookAt.lerpVectors(start.lookAt, end.lookAt, segmentProgress);
      camera.lookAt(tempLookAt);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    let t = 0;
    let animationFrameId: number;
    const animate = () => {
      t += 0.01;
      group.rotation.y += 0.0012;
      ringX.rotation.z += 0.001;
      ringY.rotation.z += 0.0013;

      // Precess the state vector around the sphere like a qubit under evolution
      const dir = new THREE.Vector3(
        Math.cos(t) * Math.sin(0.6),
        Math.sin(t) * Math.sin(0.6),
        Math.cos(0.6)
      ).normalize();
      arrow.setDirection(dir);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      scene.traverse((object) => {
        const anyObj = object as any;
        if (anyObj.geometry) anyObj.geometry.dispose();
        if (anyObj.material) {
          if (Array.isArray(anyObj.material)) {
            anyObj.material.forEach((m: THREE.Material) => m.dispose());
          } else {
            anyObj.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed left-0 top-0 z-0 h-full w-full bg-ibm-black"
    />
  );
};

const Typewriter: React.FC<{ text: string; speed?: number }> = ({ text, speed = 90 }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (displayText.length >= text.length) return;
    const timeout = setTimeout(() => {
      setDisplayText(text.substring(0, displayText.length + 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [displayText, text, speed]);

  return <>{displayText}</>;
};

export default function HeroSection() {
  return (
    <>
      <div className="relative min-h-[150vh] w-full overflow-x-hidden bg-ibm-black">
        <QuantumField />

        <div className="relative z-[1] mx-auto flex min-h-[90vh] max-w-[640px] flex-col justify-center px-8 py-12">
          <p className="mb-4 font-plexMono text-[0.8rem] font-medium uppercase tracking-[0.08em] text-ibm-gray-30">
            IIT Indore &middot; Student Chapter
          </p>
          <h1 className="mb-6 min-h-[1.1em] font-plexSans text-[clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-white">
            <Typewriter text="Quantum Computing Club" speed={70} />
          </h1>
          <p className="mb-10 max-w-[34rem] text-[1.15rem] leading-[1.6] text-ibm-gray-30">
            We are a student-led community advancing quantum computation and information
            theory &mdash; bridging fundamental principles and real-world applications.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-[0.6rem] rounded-none bg-ibm-blue px-6 py-[0.95rem] font-plexSans text-base font-medium text-white no-underline transition-[background-color,color,gap] duration-150 ease-in-out hover:gap-[0.9rem] hover:bg-ibm-blue-hover"
            >
              Explore projects <span className="inline-block transition-transform duration-150 ease-in-out">&rarr;</span>
            </Link>
            <Link
              href="/team"
              className="inline-flex items-center gap-[0.6rem] rounded-none border border-white bg-transparent px-6 py-[0.95rem] font-plexSans text-base font-medium text-white no-underline transition-[background-color,color] duration-150 ease-in-out hover:bg-white hover:text-ibm-black"
            >
              Meet the team
            </Link>
          </div>
        </div>
      </div>

      <section className="relative z-[1] bg-white px-8 py-20" id="about">
        <div className="mx-auto max-w-[900px]">
          <p className="mb-4 font-plexMono text-[0.8rem] font-medium uppercase tracking-[0.08em] text-ibm-blue">
            About us
          </p>
          <h2 className="mb-6 max-w-[40rem] font-plexSans text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-ibm-black">
            Bridging theory and real-world quantum applications
          </h2>
          <p className="max-w-[46rem] text-[1.1rem] leading-[1.7] text-ibm-gray-70">
            We are a student-led community advancing quantum computation and information
            theory, bridging the gap between fundamental principles and real-world
            applications. Our mission is to foster an inclusive and collaborative space
            where beginners, enthusiasts, and researchers come together to learn,
            experiment, and build &mdash; contributing to the evolving landscape of
            quantum technologies.
          </p>
        </div>
      </section>

      <section className="relative z-[1] bg-ibm-gray-10 px-8 py-20">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-4 font-plexMono text-[0.8rem] font-medium uppercase tracking-[0.08em] text-ibm-blue">
            Know more
          </p>
          <h2 className="mb-6 max-w-[40rem] font-plexSans text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-ibm-black">
            Where to go next
          </h2>
          <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px border border-ibm-gray-20 bg-ibm-gray-20">
            <Link
              href="/projects"
              className="group relative flex min-h-[200px] flex-col justify-end gap-2 bg-white p-8 text-ibm-black no-underline transition-colors duration-150 ease-in-out hover:bg-ibm-gray-10"
            >
              <span className="font-plexSans text-[1.3rem] font-semibold">Projects</span>
              <span className="text-[0.95rem] text-ibm-gray-70">See what our members have built</span>
              <span className="absolute right-6 top-6 text-[1.4rem] text-ibm-blue transition-transform duration-150 ease-in-out group-hover:translate-x-1">&rarr;</span>
            </Link>
            <Link
              href="/team"
              className="group relative flex min-h-[200px] flex-col justify-end gap-2 bg-white p-8 text-ibm-black no-underline transition-colors duration-150 ease-in-out hover:bg-ibm-gray-10"
            >
              <span className="font-plexSans text-[1.3rem] font-semibold">Our Team</span>
              <span className="text-[0.95rem] text-ibm-gray-70">Meet the people behind the club</span>
              <span className="absolute right-6 top-6 text-[1.4rem] text-ibm-blue transition-transform duration-150 ease-in-out group-hover:translate-x-1">&rarr;</span>
            </Link>
            <Link
              href="https://github.com/qc-iiti/Resources"
              className="group relative flex min-h-[200px] flex-col justify-end gap-2 bg-white p-8 text-ibm-black no-underline transition-colors duration-150 ease-in-out hover:bg-ibm-gray-10"
            >
              <span className="font-plexSans text-[1.3rem] font-semibold">Resources</span>
              <span className="text-[0.95rem] text-ibm-gray-70">Learning material, curated by us</span>
              <span className="absolute right-6 top-6 text-[1.4rem] text-ibm-blue transition-transform duration-150 ease-in-out group-hover:translate-x-1">&rarr;</span>
            </Link>
            <Link
              href="https://qc-iiti.github.io/Qiskit-Fall-Fest-2026/"
              className="group relative flex min-h-[200px] flex-col justify-end gap-2 bg-white p-8 text-ibm-black no-underline transition-colors duration-150 ease-in-out hover:bg-ibm-gray-10"
            >
              <span className="font-plexSans text-[1.3rem] font-semibold">Events</span>
              <span className="text-[0.95rem] text-ibm-gray-70">Workshops, talks, and meetups</span>
              <span className="absolute right-6 top-6 text-[1.4rem] text-ibm-blue transition-transform duration-150 ease-in-out group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
