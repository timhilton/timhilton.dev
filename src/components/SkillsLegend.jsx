import React from 'react';
import { categoryColors } from '../data/skillCategories';

export default function SkillsLegend() {
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