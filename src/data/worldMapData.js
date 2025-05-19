export const worldMapData = {
  // 这里将包含世界地图的SVG路径数据
  // 每个国家的路径数据将包含：
  // - id: 国家代码
  // - name: 国家名称
  // - path: SVG路径数据
  countries: []
};

// Function to process GeoJSON data into a format suitable for our map
export const processGeoJSONData = (geoJSONData) => {
  // 首先找到中国和台湾的数据
  const chinaFeature = geoJSONData.features.find(f => 
    f.properties.ISO_A2 === 'CN' || f.properties.ISO_A3 === 'CHN'
  );
  const taiwanFeature = geoJSONData.features.find(f => 
    f.properties.ISO_A2 === 'TW' || f.properties.ISO_A3 === 'TWN'
  );

  // 合并中国和台湾的路径数据
  let mergedChinaPath = '';
  if (chinaFeature && taiwanFeature) {
    const chinaPath = chinaFeature.geometry.coordinates.map(coord => {
      if (chinaFeature.geometry.type === 'Polygon') {
        return coord.map((point, i) => 
          `${i === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`
        ).join(' ') + 'Z';
      } else if (chinaFeature.geometry.type === 'MultiPolygon') {
        return coord.map(polygon => 
          polygon.map((point, i) => 
            `${i === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`
          ).join(' ') + 'Z'
        ).join(' ');
      }
      return '';
    }).join(' ');

    const taiwanPath = taiwanFeature.geometry.coordinates.map(coord => {
      if (taiwanFeature.geometry.type === 'Polygon') {
        return coord.map((point, i) => 
          `${i === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`
        ).join(' ') + 'Z';
      } else if (taiwanFeature.geometry.type === 'MultiPolygon') {
        return coord.map(polygon => 
          polygon.map((point, i) => 
            `${i === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`
          ).join(' ') + 'Z'
        ).join(' ');
      }
      return '';
    }).join(' ');

    mergedChinaPath = chinaPath + ' ' + taiwanPath;
  }

  const countries = geoJSONData.features
    .filter(feature => {
      // 排除台湾,因为已经合并到中国中
      const isTaiwan = feature.properties.ISO_A2 === 'TW' || feature.properties.ISO_A3 === 'TWN';
      return !isTaiwan;
    })
    .map(feature => {
      const { properties, geometry } = feature;
      const isChina = properties.ISO_A2 === 'CN' || properties.ISO_A3 === 'CHN';

      return {
        id: properties.ISO_A2 || properties.ISO_A3,
        name: properties.SOVEREIGNT || properties.ADMIN,
        path: isChina ? mergedChinaPath : geometry.coordinates.map(coord => {
          if (geometry.type === 'Polygon') {
            return coord.map((point, i) => 
              `${i === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`
            ).join(' ') + 'Z';
          } else if (geometry.type === 'MultiPolygon') {
            return coord.map(polygon => 
              polygon.map((point, i) => 
                `${i === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`
              ).join(' ') + 'Z'
            ).join(' ');
          }
          return '';
        }).join(' '),
        properties: {
          population: isChina ? 
            (properties.POP_EST + (taiwanFeature?.properties.POP_EST || 0)) : 
            properties.POP_EST,
          gdp: isChina ? 
            (properties.GDP_MD + (taiwanFeature?.properties.GDP_MD || 0)) : 
            properties.GDP_MD,
          incomeGroup: properties.INCOME_GRP,
          continent: properties.CONTINENT,
          region: properties.REGION_UN
        }
      };
    });

  return { countries };
};