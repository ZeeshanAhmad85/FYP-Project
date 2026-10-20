import { useState } from "react";
import Image from "next/image";

interface StarRatingProps {
  onChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ onChange }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);

  const handleRatingClick = (ratingValue: number) => {
    setRating(ratingValue);
    onChange(ratingValue); 
  };

  return (
    <div className="star-rating flex gap-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleRatingClick(ratingValue)}
              className="hidden"
            />
            <Image
              src={
                ratingValue <= (hover || rating)
                  ? "/assets/feedback-star-filled.svg"
                  : "/assets/feedback-star.svg"
              }
              alt="star"
              width={30}
              height={30}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              className="cursor-pointer"
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
