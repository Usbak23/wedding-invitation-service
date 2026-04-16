export const mockUser = {
    id: 'user-uuid-1',
    name: 'Mubarok',
    email: 'mubarok@test.com',
    password: '$2b$10$hashedpassword',
    role: 'user',
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01')
};

export const mockInvitation = {
    id: 'inv-uuid-1',
    groom_name: 'Ahmad',
    bride_name: 'Siti',
    slug: 'ahmad-siti-abc12',
    status: 'draft',
    template: 'default',
    akad_date: new Date('2026-06-01'),
    akad_location: 'Masjid Al-Ikhlas',
    resepsi_date: new Date('2026-06-01'),
    resepsi_location: 'Gedung Serbaguna',
    custom_message: 'Kami mengundang',
    cover_photo: null,
    music_url: null,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01')
};

export const mockGuest = {
    id: 'guest-uuid-1',
    name: 'Budi Santoso',
    code: 'ABCD1234',
    phone: '08123456789',
    invitation: { id: 'inv-uuid-1' },
    created_at: new Date('2026-01-01')
};

export const mockRsvp = {
    id: 'rsvp-uuid-1',
    status: 'hadir',
    total_persons: 2,
    message: 'Insya Allah hadir!',
    guest: { id: 'guest-uuid-1' },
    invitation: { id: 'inv-uuid-1' },
    created_at: new Date('2026-01-01')
};

export const mockReq = {
    ip: '127.0.0.1',
    headers: { 'user-agent': 'jest-test' }
} as any;
