import { useEffect, useState } from "react";
import StoryList from "../../components/StoryList";
import StoryViewer from "../../components/StoryViewer";


export default function StoryBuilder() {
  const [stories, setStories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    try {
      fetch("/data/stories.json")
        .then((res) => res.json())
        .then(setStories);
    } catch (err) {
      console.log(err, "errr");
    }
  }, []);

  return (
    <div className="app-mob">
      {activeIndex === null ? (
        <StoryList stories={stories} onSelect={setActiveIndex} />
      ) : (
        <StoryViewer
          stories={stories}
          index={activeIndex}
          setIndex={setActiveIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </div>
  );
}
