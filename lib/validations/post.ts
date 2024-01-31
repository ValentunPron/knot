import * as z from 'zod';

export const PostValidation = z.object({
    post: z.string().nonempty().min(3, {message: 'Мінімальна кількість символів 3'}).max(1000, {message: 'Ви перебільшили кількість символів'}),
    accountId: z.string()
});

export const CommentValidation = z.object({
    post: z.string().nonempty().min(1, {message: 'Мінімальна кількість символів 1'}).max(400, {message: 'Максимальна кількість символів 400'}),
});