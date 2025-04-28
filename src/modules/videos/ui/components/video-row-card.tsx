import { cva, type VariantProps } from "class-variance-authority"
// import { useMemo } from "react"
import Link from 'next/link'

// import { cn } from "@/lib/utils"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

// import { UserInfo } from "@/modules/users/ui/components/user-info"
// import { UserAvatar } from "@/components/user-avatar"
import { VideoMenu } from "./video-menu"
import { VideoThumbnail } from "./video-thumbnail"
import { VideoGetManyOutput } from '../../types'
// import Image from "next/image"


const videoRowCardVariants = cva("group flex min-w-0", {
    variants: {
        size: {
            default: "gap-4",
            compact: "gap-2",
        },
    },
    defaultVariants: {
        size: "default"
    }
});

const thumbnailVariants = cva("relative flex-none", {
    variants: {
        size: {
            default: "w-[38%]",
            compact: "w-[168px]"
        },
        defaultVariants: {
            size: "default"
        }
    }
});


interface VideoRowCardProps extends VariantProps<typeof videoRowCardVariants> {
    data: VideoGetManyOutput["items"][number];
    onRemove?: () => void;
}

export const VideoRowCardSkeleton = () => {
    return (
        <div className="">
            Skeleton
        </div>
    )
}

export const VideoRowCard = ({ data, size, onRemove }: VideoRowCardProps) => {
    return (
        <div className={videoRowCardVariants({ size }) + ' flex items-center justify-center '}>
            <div className={thumbnailVariants({ size })}>
                <Link href={`/videos/${data.id}`} className="block w-full h-full">
                    <VideoThumbnail
                        imageUrl={data.thumbnailUrl}
                        previewUrl={data.previewUrl}
                        duration={data.duration}
                    />
                </Link>
            </div>

            <div className="flex flex-col min-w-0 flex-1 mt-1">
                <Link href={`/videos/${data.id}`} className="line-clamp-2 font-semibold">
                    {data.title}
                </Link>

                <div className="mt-1">
                    <Link href={`/channels/${data.user.id}`}>
                        <span className="text-sm text-muted-foreground">
                            {data.user.name}
                        </span>
                    </Link>
                </div>

                <div className="text-xs text-muted-foreground mt-1">
                    {data.viewCount} views • {new Date(data.createdAt).toLocaleDateString()}
                </div>
            </div>

            {onRemove && (
                <div className="ml-auto">
                    <VideoMenu onRemove={onRemove} videoId={data.id} />
                </div>
            )}
        </div>
    )
}