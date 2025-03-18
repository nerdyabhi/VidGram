"use client"

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { trpc } from '@/trpc/client'
import { MoreVerticalIcon, TrashIcon } from 'lucide-react'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { z } from 'zod';
import { toast } from 'sonner'

import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,
} from '@/components/ui/form'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { videoUpdateSchema } from '@/db/schema'




interface FormSectionProps {
    videoId: string,
}


export const FormSection = ({ videoId }: FormSectionProps) => {


    return (
        <Suspense fallback={<FormSectionSkelton />}>
            <ErrorBoundary fallback={<p>Error Occurred</p>}>
                <FormSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}

const FormSectionSkelton = () => {
    return (
        <p>Loading...</p>
    )
}
const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
    const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
    const [categories] = trpc.categories.getMany.useSuspenseQuery();

    const utils = trpc.useUtils();
    const update = trpc.vidoes.update.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate();
            utils.studio.getOne.invalidate();
            toast.success("Successfully Updated the video");
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });

    const form = useForm<z.infer<typeof videoUpdateSchema>>({
        resolver: zodResolver(videoUpdateSchema),
        defaultValues: video,
    })

    const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
        update.mutate(data);
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex items-center justify-between mb-6">
                    <div className="">
                        <h1 className='text-2xl font-bold '>Video Details</h1>
                        <p className='text-xs text-muted-foreground '>Manage your video details </p>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <Button type='submit' disabled={update.isPending} className='cursor-pointer'>
                            Save
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size='icon' className='cursor-pointer'>
                                    <MoreVerticalIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='start' className='flex items-center cursor-pointer hover:bg-gray-100 justify-center gap-2'>
                                <TrashIcon className='size-4 mr-2' />
                                Delete
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="space-y-8 lg:col-span-3 ">

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Title
                                        {/* Add Ai generate button */}
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Add a tiltle to your video' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Description
                                        {/* Add Ai generate button */}
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea {...field}
                                            value={field.value ?? ""}
                                            rows={10}
                                            className="resize-none pr-10 h-[300px]"
                                            placeholder="Add a Description to your video" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Category
                                        {/* Add Ai generate button */}
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select a category' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map(category => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}

                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                    </div>
                </div>
            </form>
        </Form>

    )
}