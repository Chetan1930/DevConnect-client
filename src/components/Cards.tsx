import React from 'react';

interface CardProps {
  title: string;
  writer: string;
  text: string;
  image: string;
  onReadMore?: () => void;
}

const Card: React.FC<CardProps> = ({ title, writer, text, image, onReadMore }) => {
  return (
    <div className="w-full sm:w-[48%] bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-transform hover:scale-[1.02] duration-300">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-5 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>

        <p className="text-sm text-blue-700 font-semibold">
          ✍️ {writer}
        </p>

        <p className="text-gray-700 text-sm line-clamp-3">
          {text}
        </p>

        {onReadMore && (
          <button
            onClick={onReadMore}
            className="mt-2 text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
          >
            Read More →
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
