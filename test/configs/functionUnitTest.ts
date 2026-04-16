export function createMockRepository<T = any>() {
    return {
        find: jest.fn(),
        findOne: jest.fn(),
        findAndCount: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
        existsBy: jest.fn()
    } as Partial<Record<keyof T, jest.Mock>>;
}
