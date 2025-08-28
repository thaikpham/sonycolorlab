import React, { useEffect, useRef } from 'react';

const AnimatedBlobs = () => {
    const containerRef = useRef(null);
    const animationFrameId = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const blobs = [
            { id: 'red', color: '#e74c3c', r: vw * 0.12 },
            { id: 'green', color: '#2ecc71', r: vw * 0.15 },
            { id: 'blue', color: '#3498db', r: vw * 0.11 },
            { id: 'cyan', color: '#1abc9c', r: vw * 0.14 },
            { id: 'magenta', color: '#9b59b6', r: vw * 0.10 },
            { id: 'yellow', color: '#f1c40f', r: vw * 0.13 },
        ].map(d => ({
            ...d,
            x: Math.random() * (vw - d.r * 2) + d.r,
            y: Math.random() * (vh - d.r * 2) + d.r,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        }));

        const blobElements = blobs.map(blobData => {
            const el = document.createElement('div');
            el.className = 'bg-blob';
            el.style.width = `${blobData.r * 2}px`;
            el.style.height = `${blobData.r * 2}px`;
            el.style.backgroundColor = blobData.color;
            container.appendChild(el);
            setTimeout(() => el.classList.add('visible'), 100);
            return { el, data: blobData };
        });

        const animate = () => {
            blobElements.forEach(item => {
                const blob = item.data;
                blob.x += blob.vx;
                blob.y += blob.vy;

                if (blob.x - blob.r < 0 || blob.x + blob.r > vw) blob.vx *= -1;
                if (blob.y - blob.r < 0 || blob.y + blob.r > vh) blob.vy *= -1;

                item.el.style.transform = `translate(${blob.x - blob.r}px, ${blob.y - blob.r}px)`;
            });
            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            // Cleanup on unmount
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            container.innerHTML = '';
        };
    }, []);

    return <div ref={containerRef} id="blobContainer" className="fixed inset-0 -z-10 overflow-hidden" />;
};

export default AnimatedBlobs;
