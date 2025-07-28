import React from 'react';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

const defaultTags: Tag[] = [
  { id: '1', name: 'Value Bet', color: 'bg-emerald-500' },
  { id: '2', name: 'Live Bet', color: 'bg-blue-500' },
  { id: '3', name: 'High Confidence', color: 'bg-purple-500' },
  { id: '4', name: 'Arbitrage', color: 'bg-yellow-500' },
  { id: '5', name: 'System Bet', color: 'bg-red-500' },
];

export const useTags = () => {
  const [tags, setTags] = React.useState<Tag[]>(defaultTags);

  const addTag = (name: string, color: string) => {
    const newTag: Tag = {
      id: Date.now().toString(),
      name,
      color
    };
    setTags(prev => [...prev, newTag]);
    return newTag;
  };

  const removeTag = (tagId: string) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  return {
    tags,
    addTag,
    removeTag
  };
};