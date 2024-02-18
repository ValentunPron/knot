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
import { createPost, editPost } from '@/lib/actions/post.actions';
import { useOrganization } from '@clerk/nextjs';
import Image from 'next/image';
import { Input } from '../ui/input';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import closeImage from '@/assets/close.svg';


interface Props {
    userId: string,
    postId?: string,
    postText?: string, 
    postImage?: string,
    repostedText?: string
    mainPages?: boolean
}

function NewPost({userId, postId, postText, postImage, repostedText, mainPages = false}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const { organization } = useOrganization();
    const { startUpload }: any = useUploadThing('media');

    const [files, setFiles] = React.useState<File[]>([]);
    const [messagePost, setMessagePost] = React.useState('');
    const [valuesPost, setValuesPost] = React.useState(0);

    React.useEffect(() => {
        setMessagePost(textCreatedPost[Math.floor(Math.random() * 62)]);
    }, []);

    const form = useForm({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            post: postText || '',
            post_photo: postImage || '',
            accountId: userId
        }
    });

    function validatePhotoFormat(file: any) {
        // Перевірити, чи файл є зображенням
        if (!file.type.startsWith("image/")) {
          return false;
        }
      
        // Отримати розширення файлу
        const extension = file.name.split(".").pop().toLowerCase();
      
        // Допустимі формати фотографій
        const allowedFormats = ["jpg", "jpeg", "png", "webp", 'jfif', 'svg'];
      
        // Перевірити, чи розширення файлу є одним із допустимих
        return allowedFormats.includes(extension);
      }

    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault();
        
        const fileReader = new FileReader();

        if(e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
    
            if(validatePhotoFormat(file)) {
                setFiles(Array.from(e.target.files));
    
                if(!file.type.includes('image')) return;
        
                fileReader.onload = async (event) => {
                  const imageDataUrl = event.target?.result?.toString() || '';
          
                  fieldChange(imageDataUrl);
                }
          
                fileReader.readAsDataURL(file);
            } else {
                alert('Неправильний формат фотографії');
            }
          }
    }

    const onSubmit = async (values: z.infer<typeof PostValidation>) => {
        const blob = values.post_photo;

        if(blob) {
            const hasImageChanged = await isBase64Image(blob);
  
            if(hasImageChanged) {
              const imgRes = await startUpload(files);
      
              if(imgRes && imgRes[0].url) {
                values.post_photo = imgRes[0].url;
              }
            }
        }

        if(postText && postId) {
            await editPost({
                postId,
                text: values.post,
                image: values.post_photo || "",
                path: pathname
            })
        } else {
            await createPost({ 
                text: values.post,
                author: userId,
                communityId: organization ? organization.id : null,
                image: values.post_photo,
                path: pathname,
            });
        }

        form.reset();
        router.push('/');
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
                                rows={mainPages ? 5 : 15}
                                className='resize-none'
                                {...field}
                            />
                        </FormControl>

                        <FormField
                            control={form.control}
                            name="post_photo"
                            render={({ field }) => (
                                <FormItem className='flex items-center gap-4 flex-col'>
                                    <FormLabel>
                                        {
                                            field.value
                                            && 
                                            <div className='relative w-full max-h-[500px] text-right'>
                                                <Button onClick={(e) => {e.preventDefault(); field.onChange("")}} className="absolute bg-white w-10 h-10 right-4 top-4 text-sm text-base font-semibold text-[red] z-10 shadow-sm">
                                                    <Image 
                                                        src={closeImage}
                                                        alt="close"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </Button>
                                                <Image 
                                                    src={field.value}
                                                    alt='post photo'
                                                    width={100}
                                                    height={100}
                                                    className='object-cover w-full h-full relative z-0'
                                                />
                                            </div>
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
                    {  postId ? 'Редагувати' : 'Створити' } пост
                </Button>
            </form>
        </Form>
    )
}

export default NewPost;