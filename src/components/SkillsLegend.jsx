import React, { useEffect, useState } from 'react';

export default function SkillsLegend() {
    const [categoryColors, setCategoryColors] = useState(null);

    useEffect(() => {
        fetch('/data/skillCategories.json')
            .then((res) => res.json())
            .then(setCategoryColors)
            .catch((err) => console.error('Failed to load skill categories:', err));
    }, []);

    if (!categoryColors) return null;

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '1rem',
            fontFamily: 'sans-serif',
            fontSize: '0.9rem',
            justifyContent: 'center',
        }}>
            {Object.entries(categoryColors).map(([category, color]) => (
                <div key={category} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: 14,
                        height: 14,
                        backgroundColor: color,
                        borderRadius: '50%',
                        boxShadow: `0 0 3px ${color}`,
                    }} />
                    <span style={{ color: '#ccc' }}>{category}</span>
                </div>
            ))}
        </div>
    );
}