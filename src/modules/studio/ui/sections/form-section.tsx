"use client"

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { trpc } from '@/trpc/client'
import { CopyCheck, CopyIcon, ImagePlusIcon, LockIcon, MoreVerticalIcon, RotateCcwIcon, SparklesIcon, TrashIcon } from 'lucide-react'
import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { z } from 'zod';
import { toast } from 'sonner'
import Link from 'next/link';
import { Globe2Icon } from 'lucide-react'
import Image from 'next/image'
import { ThumbnailUploadModal } from '../components/thumbnail-upload-modal'

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
import { VideoPlayer } from '@/modules/videos/ui/components/video-player'
import { snakeCaseToTitle } from '@/lib/utils'
import { useRouter } from 'next/navigation'




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
    const router = useRouter();
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

    const remove = trpc.vidoes.delete.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate();
            toast.success("Successfully Deleted the video");
            router.push('/studio');
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

    const restoreThumbnail = trpc.vidoes.restoreThumbnail.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate();
            utils.studio.getOne.invalidate({ id: videoId });
            toast.success("Thumbnail Restored ")
        },
        onError: () => {
            toast.error("Something went wrong")
        }


    })

    const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/videos/${videoId}`
    const [isCopied, setIsCopied] = useState(false);
    const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);

    // Returning Part
    return (
        <>
            <ThumbnailUploadModal open={thumbnailModalOpen} onOpenChange={setThumbnailModalOpen} videoId={videoId} />
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
                                <DropdownMenuContent align='end' >
                                    <DropdownMenuItem onClick={() => remove.mutate({ id: videoId })}>
                                        <TrashIcon className='size-4 mr-2' />
                                        Delete
                                    </DropdownMenuItem>
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


                            {/* Thumbnail Field Here */}

                            <FormField
                                control={form.control}
                                name="thumbnailUrl"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>
                                            Thumbnail
                                            {/* Add Ai generate button */}
                                        </FormLabel>
                                        <FormControl>
                                            <div className="p-0.5 border border-dashed border-neutral-400 relative h-[84px] w-[153px] group">
                                                <Image
                                                    src={video.thumbnailUrl ?? "/placeholder.svg"}
                                                    className="object-cover"
                                                    fill
                                                    alt="Thumbnail"
                                                />
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <Button type='button' size='icon' className='bg-black/50 cursor-pointer hover:bg-black/80 absolute top-1 right-1'>
                                                            <MoreVerticalIcon className='text-white' />
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent align='start' side='right'>
                                                        {/* 1. button */}
                                                        <DropdownMenuItem onClick={() => setThumbnailModalOpen(true)}>
                                                            <ImagePlusIcon className='size-4 mr-1' />
                                                            Change
                                                        </DropdownMenuItem>
                                                        {/* 1. button */}

                                                        <DropdownMenuItem>
                                                            <SparklesIcon className='size-4 mr-1' />
                                                            Ai-Generation
                                                        </DropdownMenuItem>
                                                        {/* 1. button */}

                                                        <DropdownMenuItem onClick={() => restoreThumbnail.mutate({ id: videoId })}>
                                                            <RotateCcwIcon className='size-4 mr-1' />
                                                            Restore
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            {/* Categories Field */}
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





                        {/* Video Thumbnail and Visibility update options */}
                        <div className="flex flex-col gap-y-8 lg:col-span-2">
                            <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
                                <div className="aspect-video overflow-hidden relative">
                                    <VideoPlayer playbackId={video.muxPlaybackId}
                                        thumbnailUrl={video.thumbnailUrl} />
                                </div>
                                <div className="p-4 flex flex-col gap-y-6">
                                    <div className="flex justify-between items-center gap-x-2">
                                        <div className="flex flex-col gap-y-1">
                                            <p className='text-muted-foreground text-xs'>Video Link</p>
                                            <div className="flex items-center gap-x-2">
                                                <Link href={`/vidoes/${video.id}`}>
                                                    <p className='line-clamp-1 text-sm text-blue-500 cursor-pointer'>
                                                        {fullUrl}
                                                    </p>
                                                </Link>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={isCopied}
                                                    onClick={async () => {
                                                        navigator.clipboard.writeText(fullUrl);
                                                        setIsCopied(true);

                                                        setTimeout(() => {
                                                            setIsCopied(false);
                                                        }, 2000)
                                                    }}
                                                    className="cursor-pointer"
                                                >
                                                    {!isCopied ? <CopyIcon /> : <CopyCheck />}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-y-1">
                                            <p className="text-muted-foreground">
                                                Video Status
                                            </p>

                                            <p>{snakeCaseToTitle(video.muxStatus || "Preparing...")}</p>

                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-y-1">
                                            <p className="text-muted-foreground">
                                                Subtitle Status
                                            </p>

                                            <p>{snakeCaseToTitle(video.muxTrackStatus || "no subtitles")} </p>

                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Visibility form */}
                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Visibility
                                            {/* Add Ai generate button */}
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select Visibility' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='public' >
                                                    <Globe2Icon className='size-4 mr-2' />
                                                    Public
                                                </SelectItem>

                                                <SelectItem value='private' >
                                                    <LockIcon className='size-4 mr-2' />
                                                    Private
                                                </SelectItem>
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
        </>
    )
}