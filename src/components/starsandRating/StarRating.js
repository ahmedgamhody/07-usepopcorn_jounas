import { useState } from "react";
import Star from "./Star";

export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = "42px",
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating,
}) {
  // styles
  const textStyle = {
    lineHeight: "0",
    margin: "0",
    color,
    fontSize: size,
  };
  const containerSryle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  };
  const starContainerStyle = {
    display: "flex",
    alignItems: "center",
  };

  //end styles
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);
  function handleRating(rating) {
    setRating(rating);
    if (onSetRating) onSetRating(rating);
  }

  function handleTempRating(rating) {
    setTempRating(rating);
  }
  return (
    <div style={containerSryle} className={className}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            onRate={() => handleRating(i + 1)}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onHoverIn={() => handleTempRating(i + 1)}
            onHoverOut={() => handleTempRating(0)}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}
