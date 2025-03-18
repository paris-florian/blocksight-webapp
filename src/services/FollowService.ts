// Type definitions for follows
export interface FollowedEntity {
    id: string;
    name: string;
    symbol?: string;
    image?: string;
    type: 'currency' | 'trader';
    followedAt: number; // timestamp
}

// LocalStorage keys
const FOLLOWS_KEY = 'blocksight_follows';

// Get all followed entities from localStorage
export const getFollowedEntities = (): FollowedEntity[] => {
    try {
        const storedData = localStorage.getItem(FOLLOWS_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error loading follows from localStorage:', error);
    }
    return [];
};

// Check if an entity is followed
export const isEntityFollowed = (id: string, type: 'currency' | 'trader'): boolean => {
    const follows = getFollowedEntities();
    return follows.some(entity => entity.id === id && entity.type === type);
};

// Follow an entity
export const followEntity = (entity: Omit<FollowedEntity, 'followedAt'>): void => {
    try {
        const follows = getFollowedEntities();
        // Check if already followed
        if (follows.some(e => e.id === entity.id && e.type === entity.type)) {
            return;
        }
        
        // Add new follow with timestamp
        const newFollow: FollowedEntity = {
            ...entity,
            followedAt: Date.now()
        };
        
        follows.push(newFollow);
        localStorage.setItem(FOLLOWS_KEY, JSON.stringify(follows));
    } catch (error) {
        console.error('Error saving follow to localStorage:', error);
    }
};

// Unfollow an entity
export const unfollowEntity = (id: string, type: 'currency' | 'trader'): void => {
    try {
        const follows = getFollowedEntities();
        const updatedFollows = follows.filter(
            entity => !(entity.id === id && entity.type === type)
        );
        localStorage.setItem(FOLLOWS_KEY, JSON.stringify(updatedFollows));
    } catch (error) {
        console.error('Error removing follow from localStorage:', error);
    }
};

// Toggle follow status
export const toggleFollow = (entity: Omit<FollowedEntity, 'followedAt'>): boolean => {
    const isFollowed = isEntityFollowed(entity.id, entity.type);
    
    if (isFollowed) {
        unfollowEntity(entity.id, entity.type);
        return false;
    } else {
        followEntity(entity);
        return true;
    }
};

// Get follows by type
export const getFollowsByType = (type: 'currency' | 'trader'): FollowedEntity[] => {
    const follows = getFollowedEntities();
    return follows.filter(entity => entity.type === type);
};

// Check if notification is relevant based on follows
export const isNotificationRelevant = (
    notification: { category?: string; tags?: string[] }
): boolean => {
    const follows = getFollowedEntities();
    
    // If user doesn't follow anything, don't show any notifications
    if (follows.length === 0) {
        return false;
    }
    
    const followedCurrencies = follows
        .filter(entity => entity.type === 'currency')
        .map(entity => entity.symbol?.toLowerCase());
    
    const followedTraders = follows
        .filter(entity => entity.type === 'trader')
        .map(entity => entity.name.toLowerCase());
    
    // Check if notification category matches any followed currency
    if (notification.category && followedCurrencies.includes(notification.category.toLowerCase())) {
        return true;
    }
    
    // Check if any notification tag matches followed entities
    if (notification.tags && notification.tags.length > 0) {
        for (const tag of notification.tags) {
            const lowerTag = tag.toLowerCase();
            if (followedCurrencies.includes(lowerTag) || followedTraders.includes(lowerTag)) {
                return true;
            }
        }
    }
    
    return false;
}; 