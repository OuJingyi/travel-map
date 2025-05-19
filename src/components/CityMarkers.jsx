import React, { useState } from 'react';
import { cityData } from '../data/cityData';

const CityMarkers = ({ onCityClick }) => {
  const [hoveredCity, setHoveredCity] = useState(null);

  // 将经纬度转换为SVG坐标的函数
  const convertToSVGCoordinates = (lat, lng) => {
    // 将经纬度转换为SVG坐标
    // 使用与地图相同的坐标系统
    const x = (lng + 180) * (1000 / 360);  // 经度映射到 0-1000
    const y = (90 - lat) * (500 / 180);    // 纬度映射到 0-500
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
              r={isHovered ? "3" : "1.5"}
              fill="rgba(100, 204, 161, 0.6)"
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
              r={isHovered ? "3" : "1.5"}
              fill="rgba(100, 204, 161, 0.6)"
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