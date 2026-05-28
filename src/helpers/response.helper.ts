export function successResponse(data: unknown, message = 'Success'): { success: boolean; message: string; data: unknown } {
    return { success: true, message, data };
}

export function errorResponse(message: string, errors?: unknown): { success: boolean; message: string; errors: unknown } {
    return { success: false, message, errors };
}
