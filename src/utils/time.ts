export const formatTimestamp = (timestamp: Date | undefined): string => {
    if (!timestamp) return 'No date';

    const date = new Date(timestamp);

    // Check if the date is valid
    if (isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}; 