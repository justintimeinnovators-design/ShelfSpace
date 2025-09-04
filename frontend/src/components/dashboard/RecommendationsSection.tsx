'use client';

import React from 'react';
import RecommendationCard from './RecommendationCard';
import { Recommendation } from '../../../types/models';

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
}

const getCover = (title: string) => `/book-covers/${title.toLowerCase().replace(/ /g, '-')}.jpg`;

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ recommendations }) => {
  const handleRecommendationClick = (id: string) => {
    console.log('Recommendation clicked:', id);
  };

  return (
    <div>
      <h3 className="text-h5 text-gray-900 mb-4">Recommended for You</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((book, idx) => (
            <RecommendationCard
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            cover={book.cover}          // ✅ pass cover from model
            coverImage={getCover(book.title)} // optional helper
            rating={4.5}
            reason={book.reason}
            onClick={() => handleRecommendationClick(book.id.toString())}
            cardIndex={idx}        
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsSection;
