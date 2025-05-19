import React, { useState } from 'react';

const TravelStoryCard = ({ city, country, imageUrl, onImageLoad, isLoaded, link }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageLoad = () => {
    setIsImageLoading(false);
    onImageLoad && onImageLoad();
  };

  const content = (
    <div className="w-full aspect-[16/10] bg-gray-900 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:z-10 relative">
      {/* 加载占位符 */}
      {isImageLoading && (
        <div className="absolute inset-0 image-placeholder animate-pulse" />
      )}
      
      {/* 图片 */}
      <img 
        src={imageUrl || `https://nocode.meituan.com/photo/search?keyword=travel,landscape&width=300&height=200`} 
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isImageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        alt={`${city} 旅行故事`}
        loading="lazy"
        onLoad={handleImageLoad}
      />
    </div>
  );

  if (link) {
    return (
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
};

export default TravelStoryCard; 