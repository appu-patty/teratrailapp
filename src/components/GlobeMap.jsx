import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

export default function GlobeMap({ interactive = true, width = 400, height = 400, autoRotate = true }) {
    const globeEl = useRef();
    const [hexData, setHexData] = useState([]);

    // Generate some random points to simulate user activity across the globe
    useEffect(() => {
        const N = 60;
        const gData = [...Array(N).keys()].map(() => ({
            lat: (Math.random() - 0.5) * 180,
            lng: (Math.random() - 0.5) * 360,
            size: Math.random() * 0.4 + 0.1,
            color: ['#ffb088', '#ff9a76', '#ff865c'][Math.round(Math.random() * 2)]
        }));
        setHexData(gData);
    }, []);

    useEffect(() => {
        if (globeEl.current) {
            if (autoRotate) {
                globeEl.current.controls().autoRotate = true;
                globeEl.current.controls().autoRotateSpeed = 1.0;
            } else {
                globeEl.current.controls().autoRotate = false;
            }

            // We disable zoom so it doesn't interrupt page scrolling
            globeEl.current.controls().enableZoom = false;

            if (!interactive) {
                globeEl.current.controls().enablePan = false;
                globeEl.current.controls().enableRotate = false;
            }
        }
    }, [globeEl.current, interactive, autoRotate]);

    return (
        <Globe
            ref={globeEl}
            width={width}
            height={height}
            backgroundColor="rgba(0,0,0,0)" // Transparent for blending
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            hexBinPointsData={hexData}
            hexBinPointWeight="size"
            hexBinResolution={4}
            hexMargin={0.2}
            hexTopColor={d => d.points[0].color}
            hexSideColor={() => 'rgba(255, 176, 136, 0.2)'} // Peach tint
            hexBinMerge={true}
            atmosphereColor="#ffb088"
            atmosphereAltitude={0.15}
        />
    );
}
