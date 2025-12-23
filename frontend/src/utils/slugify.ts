// TopicName is a string is has every word capitalized and separated by spaces
export function slugifyTopicName(topicName: string): string {
  return topicName.toLowerCase().split(" ").join("-");
}

export function deslugifyTopicName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
