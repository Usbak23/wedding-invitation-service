export function generateSlug(groomName: string, brideName: string): string {
    const base = `${groomName}-${brideName}`
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    const suffix = Math.random().toString(36).substring(2, 7);
    return `${base}-${suffix}`;
}

export function generateGuestCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}
