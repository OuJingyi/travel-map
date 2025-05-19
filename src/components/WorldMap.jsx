import { useRef, useState, useEffect } from 'react';
import { processGeoJSONData } from '../data/worldMapData';
import CityMarkers from './CityMarkers.jsx';

const WorldMap = () => {
  const svgRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(4);
  const [position, setPosition] = useState({ x: 400, y: 350 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Load and process the GeoJSON data
    fetch('/ne_110m_admin_0_countries.geojson')
      .then(response => response.json())
      .then(data => {
        const processedData = processGeoJSONData(data);
        setCountries(processedData.countries);
      })
      .catch(error => console.error('Error loading GeoJSON data:', error));
  }, []);

  const handleMouseMove = (event) => {
    const rect = svgRef.current.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });

    if (isDragging) {
      const dx = event.clientX - dragStart.x;
      const dy = event.clientY - dragStart.y;
      setPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      setDragStart({
        x: event.clientX,
        y: event.clientY
      });
    }
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setDragStart({
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const delta = event.deltaY;
    const zoomFactor = 0.1;
    const newZoom = delta > 0 ? zoom - zoomFactor : zoom + zoomFactor;
    
    // Limit zoom range
    if (newZoom >= 1 && newZoom <= 5) {
      setZoom(newZoom);
    }
  };

  const handleZoomIn = () => {
    if (zoom < 5) {
      setZoom(zoom + 0.2);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 1) {
      setZoom(zoom - 0.2);
    }
  };

  const handleReset = () => {
    setZoom(4);
    setPosition({ x: 400, y: 350 });
  };

  const handleCityClick = (city) => {
    setHoveredCity(city);
  };

  const getCountryStyle = (countryId) => {
    const isHovered = hoveredCountry?.id === countryId;
    const specialCountries = ['CN', 'GB', 'IS', 'FR', 'DE', 'IT', 'CH', 'CZ', 'HU', 'AT', 'NO', 'FI', 'KH', 'ES', 'PT'];
    const isSpecialCountry = specialCountries.includes(countryId);

    if (isSpecialCountry) {
      return {
        fill: "rgba(76, 164, 124, 0.45)",
        stroke: "#64CCA1",
        strokeWidth: "0.3"
      };
    }

    return {
      fill: isHovered ? "rgba(76, 164, 124, 0.35)" : "rgba(76, 164, 124, 0.25)",
      stroke: "#476659",
      strokeWidth: "0.3"
    };
  };

  return (
    <div className="relative w-full min-w-[1200px] h-[696px] flex items-center justify-center m-0">
      <div className="w-full max-w-[1200px] m-0">
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid meet"
          style={{ 
            backgroundColor: '#000000',
            opacity: 1,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
        >
          <g className="countries" transform={`translate(${position.x},${position.y}) scale(${zoom},-${zoom})`}>
            {/* 先渲染普通国家 */}
            {countries
              .filter(country => !['CN', 'GB', 'IS', 'FR', 'DE', 'IT', 'CH', 'CZ', 'HU', 'AT', 'NO', 'FI', 'KH', 'ES', 'PT'].includes(country.id))
              .map(country => {
                const style = getCountryStyle(country.id);
                return (
                  <path
                    key={country.id}
                    d={country.path}
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                    onMouseEnter={() => setHoveredCountry(country)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    className="transition-colors duration-200 cursor-pointer"
                    style={{ 
                      pointerEvents: 'all',
                      vectorEffect: 'non-scaling-stroke'
                    }}
                  />
                );
              })}
            {/* 后渲染特殊国家 */}
            {countries
              .filter(country => ['CN', 'GB', 'IS', 'FR', 'DE', 'IT', 'CH', 'CZ', 'HU', 'AT', 'NO', 'FI', 'KH', 'ES', 'PT'].includes(country.id))
              .map(country => {
                const style = getCountryStyle(country.id);
                return (
                  <path
                    key={country.id}
                    d={country.path}
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                    onMouseEnter={() => setHoveredCountry(country)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    className="transition-colors duration-200 cursor-pointer"
                    style={{ 
                      pointerEvents: 'all',
                      vectorEffect: 'non-scaling-stroke'
                    }}
                  />
                );
              })}
            {/* 将城市标记放在变换组内 */}
            <CityMarkers onCityClick={handleCityClick} />
          </g>
        </svg>

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="bg-black/80 text-white p-2 rounded-lg hover:bg-black/60 transition-colors"
            aria-label="放大"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24">
              <g>
                <g>
                  <path d="M3,18.5L3,6C3,5.17158,3.2929,4.46447,3.87868,3.87868C4.46446,3.2929,5.17158,3,6,3L18.5,3C19.3284,3,20.0355,3.2929,20.6213,3.87868C21.2071,4.46446,21.5,5.17158,21.5,6L21.5,18.5C21.5,19.3284,21.2071,20.0355,20.6213,20.6213C20.0355,21.2071,19.3284,21.5,18.5,21.5L6,21.5C5.17158,21.5,4.46447,21.2071,3.87868,20.6213C3.2929,20.0355,3,19.3284,3,18.5ZM4.5,18.5C4.5,18.9142,4.64645,19.2677,4.93934,19.5606C5.23223,19.8535,5.58578,20,6,20L18.5,20C18.9142,20,19.2677,19.8535,19.5606,19.5606C19.8535,19.2677,20,18.9142,20,18.5L20,6C20,5.58578,19.8535,5.23223,19.5606,4.93934C19.2677,4.64645,18.9142,4.5,18.5,4.5L6,4.5C5.58578,4.5,5.23223,4.64645,4.93934,4.93934C4.64645,5.23223,4.5,5.58578,4.5,6L4.5,18.5ZM13,8.75L13,11.5L15.75,11.5C16.1642,11.5,16.5,11.8358,16.5,12.25C16.5,12.6642,16.1642,13,15.75,13L13,13L13,15.75C13,16.1642,12.6642,16.5,12.25,16.5C11.8358,16.5,11.5,16.1642,11.5,15.75L11.5,13L8.75,13C8.3358,13,8,12.6642,8,12.25C8,11.8358,8.3358,11.5,8.75,11.5L11.5,11.5L11.5,8.75C11.5,8.3358,11.8358,8,12.25,8C12.6642,8,13,8.3358,13,8.75Z" fill="#FFFFFF" fillOpacity="1"/>
                </g>
              </g>
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-black/80 text-white p-2 rounded-lg hover:bg-black/60 transition-colors"
            aria-label="缩小"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24">
              <g>
                <g>
                  <path d="M3,18.5L3,6C3,5.17158,3.2929,4.46447,3.87868,3.87868C4.46446,3.2929,5.17158,3,6,3L18.5,3C19.3284,3,20.0355,3.2929,20.6213,3.87868C21.2071,4.46446,21.5,5.17158,21.5,6L21.5,18.5C21.5,19.3284,21.2071,20.0355,20.6213,20.6213C20.0355,21.2071,19.3284,21.5,18.5,21.5L6,21.5C5.17158,21.5,4.46447,21.2071,3.87868,20.6213C3.2929,20.0355,3,19.3284,3,18.5ZM4.5,18.5C4.5,18.9142,4.64645,19.2677,4.93934,19.5606C5.23223,19.8535,5.58578,20,6,20L18.5,20C18.9142,20,19.2677,19.8535,19.5606,19.5606C19.8535,19.2677,20,18.9142,20,18.5L20,6C20,5.58578,19.8535,5.23223,19.5606,4.93934C19.2677,4.64645,18.9142,4.5,18.5,4.5L6,4.5C5.58578,4.5,5.23223,4.64645,4.93934,4.93934C4.64645,5.23223,4.5,5.58578,4.5,6L4.5,18.5ZM16.5,12.25C16.5,12.6642,16.1642,13,15.75,13L8.75,13C8.3358,13,8,12.6642,8,12.25C8,11.8358,8.3358,11.5,8.75,11.5L15.75,11.5C16.1642,11.5,16.5,11.8358,16.5,12.25Z" fill="#FFFFFF" fillOpacity="1"/>
                </g>
              </g>
            </svg>
          </button>
          <button
            onClick={handleReset}
            className="bg-black/80 text-white p-2 rounded-lg hover:bg-black/60 transition-colors"
            aria-label="重置"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24">
              <g>
                <g>
                  <path d="M2.75,18.25L2.75,5.75C2.75,4.92158,3.0429,4.21447,3.62868,3.62868C4.21446,3.0429,4.92158,2.75,5.75,2.75L18.25,2.75C19.0784,2.75,19.7855,3.0429,20.3713,3.62868C20.9571,4.21446,21.25,4.92158,21.25,5.75L21.25,18.25C21.25,19.0784,20.9571,19.7855,20.3713,20.3713C19.7855,20.9571,19.0784,21.25,18.25,21.25L5.75,21.25C4.92157,21.25,4.21447,20.9571,3.62868,20.3713C3.0429,19.7855,2.75,19.0784,2.75,18.25ZM4.25,18.25C4.25,18.6642,4.39645,19.0177,4.68934,19.3106C4.98223,19.6035,5.33578,19.75,5.75,19.75L18.25,19.75C18.6642,19.75,19.0177,19.6035,19.3106,19.3106C19.6035,19.0177,19.75,18.6642,19.75,18.25L19.75,5.75C19.75,5.33578,19.6035,4.98223,19.3106,4.68934C19.0177,4.39645,18.6642,4.25,18.25,4.25L5.75,4.25C5.33578,4.25,4.98223,4.39645,4.68934,4.68934C4.39645,4.98223,4.25,5.33578,4.25,5.75L4.25,18.25ZM8.5,8.125L8.5,15.875C8.5,16.2892,8.1642,16.625,7.75,16.625C7.33578,16.625,7,16.2892,7,15.875L7,8.125C7,7.71078,7.33578,7.375,7.75,7.375C8.1642,7.375,8.5,7.71078,8.5,8.125ZM17,8.125L17,15.875C17,16.2892,16.6642,16.625,16.25,16.625C15.8358,16.625,15.5,16.2892,15.5,15.875L15.5,8.125C15.5,7.71078,15.8358,7.375,16.25,7.375C16.6642,7.375,17,7.71078,17,8.125ZM12,8.75C12.5523,8.75,13,9.1977,13,9.75C13,10.3023,12.5523,10.75,12,10.75C11.4477,10.75,11,10.3023,11,9.75C11,9.1977,11.4477,8.75,12,8.75ZM12,13.25C12.5523,13.25,13,13.6977,13,14.25C13,14.8023,12.5523,15.25,12,15.25C11.4477,15.25,11,14.8023,11,14.25C11,13.6977,11.4477,13.25,12,13.25Z" fill="#FFFFFF" fillOpacity="1"/>
                </g>
              </g>
            </svg>
          </button>
        </div>

        {/* City info tooltip */}
        {hoveredCity && (
          <div 
            className="absolute bg-black/80 text-white p-2 rounded-lg shadow-lg z-50"
            style={{
              left: `${mousePosition.x + 10}px`,
              top: `${mousePosition.y + 10}px`,
              transform: 'none',
              pointerEvents: 'none'
            }}
          >
            <p className="text-sm">
              {hoveredCity.name}
              {hoveredCity.country && ` (${hoveredCity.country})`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldMap; 