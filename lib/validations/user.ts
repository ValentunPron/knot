import * as z from 'zod';

export const UserValidation = z.object({
    profile_photo: z.string().url().nonempty(),
    name: z.string().min(3, {message: 'Мінімальна кількість символів 3'}).max(30, {message: 'Мінімальна кількість символів 30'}),
    username: z.string().min(3, {message: 'Мінімальна кількість символів 3'}).max(30, {message: 'Мінімальна кількість символів 30'}),
    bio: z.string().min(3, {message: 'Мінімальна кількість символів 3'}).max(1000, {message: 'Мінімальна кількість символів 1000'}),
});