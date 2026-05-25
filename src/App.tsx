import React, { useEffect, useMemo, useRef, type JSX } from "react";
import * as THREE from "three";
// 5. 메인 레이아웃 컴포넌트 애플리케이션 정의
const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    const scene = new THREE.Scene();

    // 1. 카메라 aspect 비율을 고정값 '2' 대신 실제 브라우저 화면 비율로 세팅
    const fov = 50;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // 2. [가장 중요] 브라우저 창 크기가 바뀌거나 처음 켜질 때 해상도를 동적으로 맞춰주는 함수
    const resizeRendererToDisplaySize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // canvas의 원래 픽셀 해상도와 CSS 크기가 다를 때만 업데이트 (성능 최적화)
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        // 엔진의 해상도를 실제 렌더링될 크기로 동기화 (두 번째 인자 false는 CSS 크기를 건드리지 말라는 뜻)
        renderer.setSize(width, height, false);

        // 고해상도 모니터(디바이스 픽셀 비율)를 위한 선명도 보정 추가
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 늘어나거나 찌그러지지 않게 카메라 비율도 재계산
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    let animationFrameId: number;
    const animate = (time: number) => {
      time *= 0.001;

      // 매 프레임마다 창 크기가 바뀌었는지 체크하여 해상도 유지
      resizeRendererToDisplaySize();

      cube.rotation.x = time;
      cube.rotation.y = time;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 3. 브라우저 창 크기 조절 이벤트 리스너 등록
    window.addEventListener("resize", resizeRendererToDisplaySize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeRendererToDisplaySize); // 이벤트 리스너 해제 필수
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);
  return (
    <div className="w-full h-[100vh]">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  ); // 내부적으로 JSX.Element를 알아서 잘 반환함
};

export default App;
