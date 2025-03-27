"use client"
interface VideoPlayerProps {
    playbackId?: string | null | undefined;
    thumbnailUrl?: string | null | undefined;
    autoPlay?: boolean;
    onPlay?: () => void;
}

import MuxPlayer from '@mux/mux-player-react'


export const VideoPlayerSkeleton = () => {
    return (
        <div className='aspect-video bg-black rounded-xl' />
    )

}
export const VideoPlayer = ({ playbackId, thumbnailUrl, autoPlay, onPlay }: VideoPlayerProps) => {

    return (
        <MuxPlayer playbackId={playbackId || ""} poster={thumbnailUrl || '/placeholder.svg'} thumbnailTime={0} autoPlay={autoPlay} onPlay={onPlay}
            className="w-full h-full object-contain"
            accentColor='#FF2056'
        />)
}