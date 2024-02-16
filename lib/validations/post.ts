import * as z from 'zod';

export const PostValidation = z.object({
    post: z.string().nonempty().min(3, {message: 'Мінімальна кількість символів 3'}).max(1000, {message: 'Ви перебільшили кількість символів'}),
    post_photo: z.union([z.string().url().nullish(), z.literal("")]),
    accountId: z.string(),
});

export const CommentValidation = z.object({
    post: z.string().nonempty().min(1, {message: 'Мінімальна кількість символів 1'}).max(300, {message: 'Максимальна кількість символів 300'}),
});