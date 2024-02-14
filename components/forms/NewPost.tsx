"use client"
import React, { ChangeEvent } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter, usePathname } from 'next/navigation';

import { Button } from "@/components/ui/button"
import {
Form,
FormControl,
FormField,
FormItem,
FormLabel,
FormMessage,
} from "@/components/ui/form"
import { Textarea } from '../ui/textarea';
import { PostValidation } from '@/lib/validations/post';
import { textCreatedPost } from '@/constants';
import { createPost } from '@/lib/actions/post.actions';
import { useOrganization } from '@clerk/nextjs';
import Image from 'next/image';
import { Input } from '../ui/input';

function NewPost({userId, repostedText}: {userId: string, repostedText?: string}) {
    const router = useRouter();
    const pathname = usePathname();
    const { organization } = useOrganization();

    const [files, setFiles] = React.useState<File[]>([]);
    const [messagePost, setMessagePost] = React.useState('');
    const [valuesPost, setValuesPost] = React.useState(0);

    React.useEffect(() => {
        setMessagePost(textCreatedPost[Math.floor(Math.random() * 62)]);
    }, []);

    const form = useForm({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            post: '',
            post_photo: '',
            post_profile: '',
            accountId: userId
        }
    });

    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault();
  
        const fileReader = new FileReader();
  
        if(e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
  
          setFiles(Array.from(e.target.files));
  
          if(!file.type.includes('image')) return;
  
          fileReader.onload = async (event) => {
            const imageDataUrl = event.target?.result?.toString() || '';
    
            fieldChange(imageDataUrl);
          }
    
          fileReader.readAsDataURL(file);
        }
    }

    const onSubmit = async (values: z.infer<typeof PostValidation>) => {
        await createPost({ 
            text: values.post,
            author: userId,
            communityId: organization ? organization.id : null,
            image: values.post_photo,
            path: pathname,
        
        });

        router.push('/')
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-10 flex flex-col justify-start gap-10"
                onChange={(e: any) => setValuesPost(e.target.value.length)}
            >
                <FormField
                    control={form.control}
                    name="post"
                    render={({ field }) => (
                    <FormItem className='flex flex-col w-full'>
                        <FormLabel className='text-base-semibold text-light-2 mb-6'>
                            {messagePost}
                        </FormLabel>
                        <FormControl className='no-focus border-dark-4 bg-dark-3 text-light-1'>
                            <Textarea 
                                rows={15}
                                className='resize-none'
                                {...field}
                            />
                        </FormControl>

                        <FormField
                            control={form.control}
                            name="post_photo"
                            render={({ field }) => (
                                <FormItem className='flex items-center gap-4 flex-col'>
                                <FormLabel className=''>
                                    {
                                        field.value
                                        ? 
                                        <Image 
                                            src={field.value}
                                            alt='profile photo'
                                            width={100}
                                            height={100}
                                            priority
                                            className='object-cover w-full h-auto'
                                        />
                                        : ''
                                    }
                                </FormLabel>
                                <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                            <Input 
                                            type="file"
                                            accept='image/*'
                                            placeholder='Загрузіть фото'
                                            className='account-form_image-input'
                                            onChange={(e) => handleImage(e, field.onChange)} 
                                            />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <p className={`text-light-2 ${valuesPost > 1000 ? 'text-red-500': ''}`}>Кількість символів {valuesPost}/1000</p>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className='comment-form_btn'>
                    Створити пост
                </Button>
            </form>
        </Form>
    )
}

export default NewPost;