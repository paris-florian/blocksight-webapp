import { slugify } from '../utilities/stringUtils';

// Types
export interface UserInteraction {
  liked: number[];
  saved: number[];
}

// Map news IDs to article slugs
export const articleSlugs: Record<number, string> = {
  1: 'the-future-of-cryptocurrency-trends-to-watch-in-2023',
  2: 'understanding-defi-a-beginners-guide-to-decentralized-finance',
  3: 'nfts-beyond-art-exploring-practical-applications-of-non-fungible-tokens',
  4: 'the-future-of-cryptocurrency-trends-to-watch-in-2023', // Fallback to first article
  5: 'understanding-defi-a-beginners-guide-to-decentralized-finance', // Fallback to second article
  6: 'nfts-beyond-art-exploring-practical-applications-of-non-fungible-tokens', // Fallback to third article
  7: 'the-future-of-cryptocurrency-trends-to-watch-in-2023', // Fallback to first article
  8: 'understanding-defi-a-beginners-guide-to-decentralized-finance', // Fallback to second article
};

// Load user interactions from localStorage
export const loadUserInteractions = (): UserInteraction => {
  const savedInteractions = localStorage.getItem('userInteractions');
  if (savedInteractions) {
    return JSON.parse(savedInteractions);
  }
  return { liked: [], saved: [] };
};

// Save user interactions to localStorage
export const saveUserInteractions = (interactions: UserInteraction): void => {
  localStorage.setItem('userInteractions', JSON.stringify(interactions));
};

// Toggle like status for an item
export const toggleLike = (id: number, currentInteractions: UserInteraction): UserInteraction => {
  const isLiked = currentInteractions.liked.includes(id);
  const newInteractions = {
    ...currentInteractions,
    liked: isLiked 
      ? currentInteractions.liked.filter(itemId => itemId !== id) 
      : [...currentInteractions.liked, id]
  };
  saveUserInteractions(newInteractions);
  return newInteractions;
};

// Toggle save status for an item
export const toggleSave = (id: number, currentInteractions: UserInteraction): UserInteraction => {
  const isSaved = currentInteractions.saved.includes(id);
  const newInteractions = {
    ...currentInteractions,
    saved: isSaved 
      ? currentInteractions.saved.filter(itemId => itemId !== id) 
      : [...currentInteractions.saved, id]
  };
  saveUserInteractions(newInteractions);
  return newInteractions;
};

// Share an item by copying its URL to clipboard
export const shareItem = (id: number, title: string): Promise<string> => {
  // Use the mapped slug or generate one from the title if not found
  const slug = articleSlugs[id] || slugify(title || '');
  
  // Generate a proper URL for the item
  const shareUrl = `${window.location.origin}/articles/${slug}`;
  
  // Copy to clipboard
  return navigator.clipboard.writeText(shareUrl)
    .then(() => shareUrl)
    .catch(err => {
      console.error('Could not copy text: ', err);
      throw new Error('Failed to copy link to clipboard');
    });
};

// Get article slug from ID
export const getArticleSlug = (id: number, title?: string): string => {
  return articleSlugs[id] || slugify(title || '');
}; 