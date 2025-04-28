"use client"

import { ResponsiveModal } from "@/components/responsive-dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";
// import { UploadButton } from "@/lib/uploadthing";
interface ThumbnailUploadModalProps {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}



export const ThumbnailUploadModal = ({ videoId, open, onOpenChange }: ThumbnailUploadModalProps) => {
    const utils = trpc.useUtils();

    const onUploadComplete = () => {
        utils.studio.getOne.invalidate({ id: videoId });
        onOpenChange(false);

    }
    return (
        <ResponsiveModal
            title="Upload a thumbnail"
            open={open}
            onOpenChange={onOpenChange}>
            <UploadDropzone className="bg-black border-blue-400 border-2 z-10" endpoint="thumbnailUploader" input={{ videoId }}
                onClientUploadComplete={onUploadComplete}
            />
            {/* <UploadButton className="bg-black text-white" input={undefined} endpoint={"thumbnailUploader"} /> */}
        </ResponsiveModal>
    )
}