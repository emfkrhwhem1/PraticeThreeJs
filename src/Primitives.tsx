import { useEffect, useRef } from "react";
import * as THREE from "three";

const Primitives: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // [추가] 초기 해상도 계산을 위한 값 확보
    const initWidth = canvas.clientWidth || window.innerWidth;
    const initHeight = canvas.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
      powerPreference: "high-performance", // (선택) 브라우저에 고성능 GPU 사용을 유도
    });

    // ⭐️ [고화질 핵심 1] 디바이스 픽셀 비율 설정 (레티나/4K 대응)
    // 기기 비율을 그대로 따르되, 과도한 연산 방지를 위해 최대 2배까지만 제한
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);

    // ⭐️ [고화질 핵심 2] 초기 렌더러 크기를 명시적으로 지정
    renderer.setSize(initWidth, initHeight, false);

    const scene = new THREE.Scene();

    const fov = 45; // 👈 200에서 45로 변경 (안정적인 화각)
    const aspect = initWidth / initHeight;
    const near = 0.1;
    const far = 100; // 👈 4에서 100으로 변경 (원이 회전해도 잘리지 않게 여유를 둠)
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5; // 👈 원이 크니까 카메라를 뒤로 좀 더 뺌 (2에서 5로)

    const radius = 1; // 👈 7에서 1로 변경
    const height = 1;
    const radialSegments = 32;
    const segments = 32; // 32 정도로 주면 테두리가 아주 부드러운 원이 됨

    const geometry = new THREE.ConeGeometry(radius, height, radialSegments);

    const color = 0xffffff;
    const intensity = 1.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    const material = new THREE.MeshPhongMaterial({
      color: 0x0077ff,
      //wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h, false);
      renderer.render(scene, camera);
    };

    let animationFrameId: number;
    const animate = (time: number) => {
      time *= 0.001;

      cube.rotation.x = time;
      cube.rotation.y = time;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-[100vh]">
      <canvas ref={canvasRef} className="w-full h-full block"></canvas>
    </div>
  );
};

export default Primitives;
