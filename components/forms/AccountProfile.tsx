"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { UserValidation } from '@/lib/validations/user';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import profile from '@/assets/profile.svg';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ChangeEvent } from 'react';
import { Textarea } from '../ui/textarea';
import React from 'react';

interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string,
        bio: string,
        image: string,
    },
    btnTitle: string
}

const AccountProfile = ({ user, btnTitle}: Props) => {
    const [files, setFiles] = React.useState<File[]>([]);

    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: user?.image || '',
            name: user?.name || '',
            username: user?.username || '',
            bio: user?.bio || '',
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

    function onSubmit(values: z.infer<typeof UserValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }

    return (
        <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="flex flex-col justify-start gap-10"
        >
          <FormField
              control={form.control}
              name="profile_photo"
              render={({ field }) => (
                <FormItem className='flex items-center gap-4'>
                  <FormLabel className='account-form_image-label'>
                    {
                      field.value ? (
                        <Image 
                          src={field.value}
                          alt='profile photo'
                          width={96}
                          height={96}
                          priority
                          className='rounded-full object-contain'
                        />
                      ) : (
                        <Image 
                        src={profile}
                        alt='profile photo'
                        width={24}
                        height={24}
                        className='object-contain'
                      />
                      )
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
                </FormItem>
              )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className='flex flex-col gap-3 w-full'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Username
                </FormLabel>
                <FormControl className='flex-1 text-base-semibold text-gray-200'>
                  <Input 
                    type="text"
                    className='account-form_input no-focus'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className='flex flex-col gap-3 w-full'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Ім'я
                </FormLabel>
                <FormControl className='flex-1 text-base-semibold text-gray-200'>
                  <Input 
                    type="text"
                    className='account-form_input no-focus'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className='flex flex-col gap-3 w-full'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Біографія
                </FormLabel>
                <FormControl className='flex-1 text-base-semibold text-gray-200'>
                  <Textarea 
                    rows={10}
                    className='account-form_input no-focus'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className='bg-primary-500'>Відправити</Button>
        </form>
      </Form>
    )
}

export default AccountProfile