/* The code snippet is defining a React functional component called `StoryList`. This component takes
two props, `stories` and `onSelect`. */
export default function StoryList({ stories, onSelect }) {
  return (
    <div className="story-list">
      {stories.map((story, index) => (
        <div
          key={story.id}
          className="story-thumb"
          onClick={() => onSelect(index)}
        >
          <img src={story.image} alt="story" />
        </div>
      ))}
    </div>
  );
}
