    "use client"
    import React from 'react';

    import { zodResolver } from '@hookform/resolvers/zod';
    import * as z from 'zod';
    import { useForm } from 'react-hook-form';
    import { useRouter, usePathname } from 'next/navigation';
    import Image from 'next/image';

    import { Button } from "@/components/ui/button"
    import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    } from "@/components/ui/form"
    import { Input } from "@/components/ui/input"
    import { Textarea } from '../ui/textarea';
    import { PostValidation } from '@/lib/validations/post';
    import { textCreatedPost } from '@/constants';
    import { createPost } from '@/lib/actions/post.actions';

    function NewPost({userId}: {userId: string}) {
        const router = useRouter();
        const pathname = usePathname();

        const [messagePost, setMessagePost] = React.useState('');
        const [valuesPost, setValuesPost] = React.useState('');

        React.useEffect(() => {
            setMessagePost(textCreatedPost[Math.floor(Math.random() * 62)]);
        }, []);

        const form = useForm({
            resolver: zodResolver(PostValidation),
            defaultValues: {
                post: '',
                accountId: userId,
            }
        });

        const onSubmit = async (values: z.infer<typeof PostValidation>) => {
            await createPost({ 
                text: values.post,
                author: userId,
                communityId: null,
                path: pathname,
            
            });

            router.push('/')
        }

        return (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mt-10 flex flex-col justify-start gap-10"
                    onChange={(e: any) => setValuesPost(e.target.value)}
                >
                    <FormField
                        control={form.control}
                        name="post"
                        render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                {messagePost}
                            </FormLabel>
                            <FormControl className='no-focus border-dark-4 bg-dark-3 text-light-1'>
                                <Textarea 
                                    rows={15}
                                    {...field}
                                />
                            </FormControl>

                            <p className={`text-light-2 ${valuesPost.length > 1000 ? 'text-red-500': ''}`}>Кількість символів 1000/{valuesPost.length}</p>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className='bg-primary-500'>
                        Створити пост
                    </Button>
                </form>
            </Form>
        )
    }

    export default NewPost;