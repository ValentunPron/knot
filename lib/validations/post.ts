import * as z from 'zod';

export const PostValidation = z.object({
    post: z.string().nonempty().min(3, {message: 'Мінімальна кількість символів 3'}).max(2000, {message: 'Мінімальна кількість символів 2000'}),
    accountId: z.string()
});

export const CommentValidation = z.object({
    post: z.string().nonempty().min(3, {message: 'Мінімальна кількість символів 3'}).max(2000, {message: 'Мінімальна кількість символів 2000'}),
});