import Image from 'next/image'

interface VideoThumbnailProps {
    imageUrl?: string | null,
    previewUrl?: string | null,
    duration: number,
}

export const VideoThumbnail = ({ imageUrl, previewUrl, duration }: VideoThumbnailProps) => {
    console.log(duration);

    return (
        <div className=" relative group">
            {/* Thumbnail Wrapper */}
            <div className="relative  w-full overflow-hidden rounded-xl aspect-video">

                <Image src={imageUrl!} alt="Thumbnail" fill
                    className='h-full w-full object-cover group-hover:opacity-0' />

                <Image src={previewUrl || imageUrl || '/placeholder.svg'!} alt="Thumbnail" fill
                    className='h-full w-full object-cover opacity-0 group-hover:opacity-100' />
            </div>

            {/* Video Duration Box */}
            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black text-white text-xs font-medium rounded">
                {(() => {
                    const hrs = Math.floor(duration / 3600);
                    const mins = Math.floor((duration % 3600) / 60);
                    const secs = duration % 60;
                    return hrs > 0
                        ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
                        : `${mins}:${secs.toString().padStart(2, '0')}`;
                })()}
            </div>
        </div>
    )
}