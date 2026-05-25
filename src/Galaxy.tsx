import { useEffect, useRef } from "react";
import * as THREE from "three";

const Galaxy: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    const initWidth = canvas.clientWidth || window.innerWidth;
    const initHeight = canvas.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
      powerPreference: "high-performance",
    });

    renderer.setSize(initWidth, initHeight, false);

    const scene = new THREE.Scene();

    const aspect = canvas.clientWidth / canvas.clientHeight;
    const fov = 40;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 50, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    // 회전값을 업데이트할 객체들
    const objects = [];

    // 하나의 geometry로 모든 태양, 지구, 달을 생성
    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments,
    );

    const color = 0xffffff;
    const intensity = 500;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);

    const solarSystem = new THREE.Object3D();
    scene.add(solarSystem);
    objects.push(solarSystem);

    // 태양
    const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5); // 태양의 크기를 키움
    solarSystem.add(sunMesh);

    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);
    objects.push(earthOrbit);

    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);

    // 지구
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthMesh.position.x = 0;
    earthOrbit.add(earthMesh);
    objects.push(earthMesh);

    // 달
    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x222222,
    });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonOrbit.add(moonMesh);
    objects.push(moonMesh);

    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h, false);
      renderer.render(scene, camera);
    };
    objects.push(sunMesh);

    let animationFrameId: number;
    const animate = (time: number) => {
      time *= 0.001;
      objects.forEach(obj => {
        obj.rotation.y = time;
      });

      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-[100vh]">
      <canvas ref={canvasRef} className="w-full h-full block"></canvas>
    </div>
  );
};

export default Galaxy;
