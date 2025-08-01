import React, { useEffect, useMemo, useState } from 'react';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SkillLogo from './SkillLogo';
import skills from '../data/skills-cloud.json';

function getSpherePosition(index, total, radius = 2.8) {
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;

    return [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
    ];
}

function useColorScheme() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(media.matches);
        const listener = (e) => setIsDark(e.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, []);

    return isDark;
}

export default function SkillsCloud() {
    const [isHovering, setIsHovering] = useState(false);
    const entries = useMemo(() => Object.entries(skills), []);
    const total = entries.length;
    const isDark = useColorScheme();

    return (
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <OrbitControls enableZoom={false} autoRotate={!isHovering} autoRotateSpeed={0.8} />

            {entries.map(([label, config], i) => (
                <SkillLogo
                    key={label}
                    label={label}
                    slug={config.slug}
                    scale={config.scale * 1.5}
                    category={config.category}
                    position={getSpherePosition(i, total)}
                    onHoverChange={setIsHovering}
                />
            ))}
        </Canvas>
    );
}