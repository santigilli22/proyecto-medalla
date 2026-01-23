import { useState, useEffect, useRef } from 'react';

const BubbleCursor = () => {
    const [bubbles, setBubbles] = useState([]);
    const requestRef = useRef();
    const previousTimeRef = useRef();

    // Configuración
    const SPAWN_RATE = 50; // ms entre burbujas al mover
    const lastSpawnTime = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const now = Date.now();
            if (now - lastSpawnTime.current > SPAWN_RATE) {
                spawnBubble(e.clientX, e.clientY);
                lastSpawnTime.current = now;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const spawnBubble = (x, y) => {
        const id = Date.now() + Math.random();
        const size = Math.random() * 8 + 4; // 4px a 12px
        const speed = Math.random() * 1 + 0.5;

        setBubbles(prev => [...prev.slice(-15), { // Mantener máx 15 burbujas para performance
            id,
            x,
            y,
            size,
            speed,
            opacity: 1,
            wobble: Math.random() * Math.PI * 2
        }]);

        // Auto-eliminar después de un tiempo (fallback)
        setTimeout(() => {
            setBubbles(prev => prev.filter(b => b.id !== id));
        }, 1000);
    };

    // Animation Loop
    const animate = (time) => {
        if (previousTimeRef.current !== undefined) {
            setBubbles(prevBubbles =>
                prevBubbles
                    .map(b => ({
                        ...b,
                        y: b.y - b.speed, // Flotar hacia arriba
                        x: b.x + Math.sin(time * 0.005 + b.wobble) * 0.5, // Oscilación lateral
                        opacity: b.opacity - 0.02
                    }))
                    .filter(b => b.opacity > 0)
            );
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    // Desactivar en móviles/touch devices
    if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {bubbles.map(b => (
                <div
                    key={b.id}
                    className="absolute rounded-full border border-amber-500/50 bg-amber-400/10 backdrop-blur-[1px]"
                    style={{
                        left: b.x,
                        top: b.y,
                        width: b.size,
                        height: b.size,
                        opacity: b.opacity,
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 0 4px rgba(245,158,11,0.3)'
                    }}
                />
            ))}
        </div>
    );
};

export default BubbleCursor;
