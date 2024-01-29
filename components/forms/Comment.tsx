'use client'

import * as z from 'zod';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button"
import { Input } from '../ui/input';

import { CommentValidation } from '@/lib/validations/post';

interface Props {
    postId: string,
    currentUserImage: string,
    currentUserId: string,
}

const Comment = ({postId, currentUserImage, currentUserId}: Props) => {
    const [valuesPost, setValuesPost] = React.useState(0);

    const router = useRouter();
    const pathname = usePathname();
    
    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            post: '',
        }
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        // await createPost({ 
        //     text: values.post,
        //     author: userId,
        //     communityId: null,
        //     path: pathname,
        
        // });

        // router.push('/')
    }

    
    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form"
                onChange={(e: any) => setValuesPost(e.target.value.length)}
            >
                <FormField
                    control={form.control}
                    name="post"
                    render={({ field }) => (
                    <FormItem className='flex gap-2 items-center w-full'>
                        <FormLabel>
                           <Image 
                                src={currentUserImage}
                                alt='user avatar'
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                           />
                        </FormLabel>
                        <FormControl className='border-none bg-transparent'>
                            <Input 
                                type='text'
                                placeholder='Коментувати...'
                                className='no-focus text-light-1 outline-none'
                                {...field}
                            />
                        </FormControl>
                        
                        <FormLabel className={`text-light-2 ${valuesPost > 1000 ? 'text-red-500' : ''}`}>
                            <p>{valuesPost}/1000</p>
                        </FormLabel>
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

export default Comment;