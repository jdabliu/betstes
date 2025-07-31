import React from 'react';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

const defaultTags: Tag[] = [
  { id: '1', name: '7k.bet', color: 'bg-emerald-500' },
  { id: '2', name: 'Betano', color: 'bg-blue-500' },
  { id: '3', name: 'Pinnacle', color: 'bg-purple-500' },
  { id: '4', name: 'Bet365', color: 'bg-yellow-500' },
  { id: '5', name: 'James', color: 'bg-red-500' },
  { id: '6', name: 'Joao', color: 'bg-green-500' },
  { id: '7', name: 'Pedro', color: 'bg-orange-500' },
  { id: '8', name: 'Betbra', color: 'bg-pink-500' },
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