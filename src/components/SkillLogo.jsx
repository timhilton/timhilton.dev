import * as SiIcons from '@icons-pack/react-simple-icons';

import { Float, Html } from '@react-three/drei';
import React, { useEffect, useRef, useState } from 'react';

import AWS from './Aws';
import { useFrame } from '@react-three/fiber';

const categoryColors = {
    frontend: '#4FC3F7',
    backend: '#81C784',
    infra: '#FFD54F',
    mobile: '#BA68C8',
    design: '#FF8A65',
    cms: '#9575CD',
    tools: '#E57373',
    other: '#B0BEC5',
};

function TypingText({ text, speed = 40 }) {
    const [displayed, setDisplayed] = useState('');

    useEffect(() => {
        let i = 0;
        setDisplayed(''); // Reset first

        const interval = setInterval(() => {
            setDisplayed(text.slice(0, i + 1));
            i++;
            if (i >= text.length) clearInterval(interval);
        }, speed);

        return () => clearInterval(interval);
    }, [text]);

    return <>{displayed}</>;
}

export default function SkillLogo({ slug, label, position, scale = 1, category = 'other', onHoverChange = () => {}, isDark }) {
    const ref = useRef();
    const [hovered, setHovered] = useState(false);

    const handlePointerOver = () => {
        setHovered(true);
        onHoverChange(true);
    };

    const handlePointerOut = () => {
        setHovered(false);
        onHoverChange(false);
    };

    const isAWS = label === 'AWS';
    const categoryColor = categoryColors[category] || '#ffffff';

    const iconKey = slug
        ? `Si${slug.replace(/[^a-zA-Z0-9]/g, '').replace(/^\w/, c => c.toUpperCase())}`
        : null;
    const Icon = iconKey && SiIcons[iconKey];

    const iconSize = Math.round(48 * scale);

    useFrame(({ camera }) => {
        if (ref.current) ref.current.lookAt(camera.position);
    });

    return (
        <Float speed={0.6} rotationIntensity={0.3} floatIntensity={0.4}>
            <group ref={ref} position={position}>
                <Html center>
                    <div
                        onPointerOver={handlePointerOver}
                        onPointerOut={handlePointerOut}
                        style={{
                            width: iconSize,
                            height: iconSize,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'transparent',
                            filter: hovered ? `drop-shadow(0 0 6px ${categoryColor})` : 'none',
                            transition: 'filter 0.3s ease',
                            position: 'relative', // needed for positioning label
                        }}
                    >
                        {isAWS ? (
                            <AWS width={iconSize} height={iconSize} fill={categoryColor} />
                        ) : Icon ? (
                            <Icon size={iconSize} color={categoryColor} title={label} />
                        ) : (
                            <span style={{ fontSize: 10 * scale, color: categoryColor }}>{label}</span>
                        )}

                        {hovered && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: iconSize + 4,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontSize: 10,
                                    color: '#f5f5f5',
                                    background: 'rgba(0,0,0,0.6)',
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <TypingText text={label} />
                            </div>
                        )}
                    </div>
                </Html>
            </group>
        </Float>
    );
}