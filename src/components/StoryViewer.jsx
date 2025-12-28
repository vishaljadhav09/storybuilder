import { useState } from "react";
import Loader from "./Loader";
import useStoryTimer from "../hooks/useTimer";

export default function StoryViewer({
  stories,
  index,
  onClose,
  setIndex
}) {
  const [loading, setLoading] = useState(true);

  function next() {
    if (index < stories.length - 1) {
      setLoading(true);
      setIndex(index + 1);
    } else {
      onClose();
    }
  }

  function prev() {
    if (index > 0) {
      setLoading(true);
      setIndex(index - 1);
    }
  }

  useStoryTimer(true, index, next);

  function handleTap(e) {
    const width = window.innerWidth;
    e.clientX < width / 2 ? prev() : next();
  }

  return (
    <div className="story-viewer" >
      <div className="progress-bar">
        <div key={index} className="progress" />
      </div>

      {loading && <Loader />}

      <img
        className={`story-image ${loading ? "hidden" : ""}`}
        src={stories[index].image}
        onClick={handleTap}
        alt="story"
        loading="lazy"
        onLoad={() => setLoading(false)}
      />

      <button className="close-btn" onClick={onClose}>✕</button>
    </div>
  );
}
