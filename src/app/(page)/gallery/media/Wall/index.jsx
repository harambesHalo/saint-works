import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Model from './Model';

const Wall = ({ registerMoveForward }) => {
  return (
    <Canvas style={{ background: '#000000' }}>
      <Model registerMoveForward={registerMoveForward} />
      <directionalLight intensity={0.75} position={[0, 2, 3]} />
      <Environment preset="city" />
    </Canvas>
  );
};

export default Wall;
