import React, { useState } from 'react';
import { cityData } from '../data/cityData';

const CityMarkers = ({ onCityClick }) => {
  const [hoveredCity, setHoveredCity] = useState(null);

  // 将经纬度转换为SVG坐标的函数
  const convertToSVGCoordinates = (lat, lng) => {
    // 将经纬度转换为SVG坐标，考虑地图的变换
    const x = ((lng + 180) / 360) * 1000; // SVG宽度为1000
    const y = ((90 - lat) / 180) * 500;   // SVG高度为500
    return { x, y };
  };

  const handleCityHover = (city) => {
    setHoveredCity(city);
    onCityClick && onCityClick(city);
  };

  const handleCityLeave = () => {
    setHoveredCity(null);
    onCityClick && onCityClick(null);
  };

  // 计算动画延迟
  const getAnimationDelay = (index, total) => {
    return `${(index / total) * 3}s`;
  };

  return (
    <g className="city-markers">
      {/* 中国城市标记 */}
      {cityData.chineseCities.map((city, index) => {
        const { x, y } = convertToSVGCoordinates(city.lat, city.lng);
        const isHovered = hoveredCity === city;
        return (
          <g
            key={`china-${index}`}
            className="city-marker"
            onMouseEnter={() => handleCityHover(city)}
            onMouseLeave={handleCityLeave}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={x}
              cy={y}
              r={isHovered ? "3" : "2"}
              fill="rgba(255, 255, 255, 0.9)"
              stroke={isHovered ? "white" : "none"}
              strokeWidth={isHovered ? "1.5" : "0"}
              style={{
                transition: 'all 0.2s ease-in-out',
                vectorEffect: 'non-scaling-stroke'
              }}
            />
          </g>
        );
      })}

      {/* 欧洲城市标记 */}
      {cityData.europeanCities.map((city, index) => {
        const { x, y } = convertToSVGCoordinates(city.lat, city.lng);
        const isHovered = hoveredCity === city;
        return (
          <g
            key={`europe-${index}`}
            className="city-marker"
            onMouseEnter={() => handleCityHover(city)}
            onMouseLeave={handleCityLeave}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={x}
              cy={y}
              r={isHovered ? "3" : "2"}
              fill="rgba(255, 255, 255, 0.9)"
              stroke={isHovered ? "white" : "none"}
              strokeWidth={isHovered ? "1.5" : "0"}
              style={{
                transition: 'all 0.2s ease-in-out',
                vectorEffect: 'non-scaling-stroke'
              }}
            />
          </g>
        );
      })}
    </g>
  );
};

export default CityMarkers; 