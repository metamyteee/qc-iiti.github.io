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

  return <canvas ref={canvasRef} className="hero-canvas" />;
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
      <div className="ibm-hero">
        <QuantumField />

        <div className="ibm-hero-content">
          <p className="ibm-eyebrow">IIT Indore &middot; Student Chapter</p>
          <h1 className="ibm-headline">
            <Typewriter text="Quantum Computing Club" speed={70} />
          </h1>
          <p className="ibm-subhead">
            We are a student-led community advancing quantum computation and information
            theory &mdash; bridging fundamental principles and real-world applications.
          </p>
          <div className="ibm-cta-row">
            <Link href="/projects" className="ibm-btn ibm-btn-primary">
              Explore projects <span className="ibm-arrow">&rarr;</span>
            </Link>
            <Link href="/team" className="ibm-btn ibm-btn-secondary">
              Meet the team
            </Link>
          </div>
        </div>
      </div>

      <section className="ibm-section" id="about">
        <div className="ibm-container ibm-about-grid">
          <p className="ibm-eyebrow">About us</p>
          <h2 className="ibm-h2">
            Bridging theory and real-world quantum applications
          </h2>
          <p className="ibm-body-text">
            We are a student-led community advancing quantum computation and information
            theory, bridging the gap between fundamental principles and real-world
            applications. Our mission is to foster an inclusive and collaborative space
            where beginners, enthusiasts, and researchers come together to learn,
            experiment, and build &mdash; contributing to the evolving landscape of
            quantum technologies.
          </p>
        </div>
      </section>

      <section className="ibm-section ibm-section-gray">
        <div className="ibm-container">
          <p className="ibm-eyebrow">Know more</p>
          <h2 className="ibm-h2">Where to go next</h2>
          <div className="ibm-tile-grid">
            <Link href="/projects" className="ibm-tile">
              <span className="ibm-tile-title">Projects</span>
              <span className="ibm-tile-desc">See what our members have built</span>
              <span className="ibm-tile-arrow">&rarr;</span>
            </Link>
            <Link href="/team" className="ibm-tile">
              <span className="ibm-tile-title">Our Team</span>
              <span className="ibm-tile-desc">Meet the people behind the club</span>
              <span className="ibm-tile-arrow">&rarr;</span>
            </Link>
            <Link href="https://github.com/qc-iiti/Resources" className="ibm-tile">
              <span className="ibm-tile-title">Resources</span>
              <span className="ibm-tile-desc">Learning material, curated by us</span>
              <span className="ibm-tile-arrow">&rarr;</span>
            </Link>
            <Link href="/" className="ibm-tile">
              <span className="ibm-tile-title">Events</span>
              <span className="ibm-tile-desc">Workshops, talks, and meetups</span>
              <span className="ibm-tile-arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
