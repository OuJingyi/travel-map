import { useRef, useState, useEffect } from 'react';
import { processGeoJSONData } from '../data/worldMapData';
import CityMarkers from './CityMarkers.jsx';

const WorldMap = () => {
  const svgRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Load and process the GeoJSON data
    fetch('/travel-map/ne_110m_admin_0_countries.geojson')
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
        fill: isHovered ? "rgba(76, 164, 124, 0.6)" : "rgba(76, 164, 124, 0.45)",
        stroke: "#64CCA1",
        strokeWidth: "0.3"
      };
    }

    return {
      fill: isHovered ? "rgba(76, 164, 124, 0.3)" : "rgba(76, 164, 124, 0.15)",
      stroke: "#2C4038",
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
            opacity: 1
          }}
          onMouseMove={handleMouseMove}
        >
          <g className="countries" transform="translate(500,250) scale(2.8,-2.8)">
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
          </g>
          <CityMarkers onCityClick={handleCityClick} />
        </svg>

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