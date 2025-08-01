import React, { useEffect, useMemo, useState } from 'react';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SkillLogo from './SkillLogo';

function getSpherePosition(index, total, radius = 2.8) {
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;

    return [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
    ];
}

export default function SkillsCloud() {
    const [skills, setSkills] = useState(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        fetch('/data/skills-cloud.json')
            .then((res) => res.json())
            .then(setSkills)
            .catch((err) => console.error('Failed to load skills:', err));
    }, []);

    const entries = useMemo(() => (skills ? Object.entries(skills) : []), [skills]);
    const total = entries.length;

    if (!skills) return <div>Loading skills...</div>;

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