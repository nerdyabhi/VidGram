"use client"

import { Button } from "@/components/ui/button"
import { Loader2Icon, PlusIcon, VideoIcon } from "lucide-react"
import { trpc } from "@/trpc/client"
import { toast } from "sonner"
import { ResponsiveModal } from "@/components/responsive-dialog"
import { StudioUploader } from "./studio-uploader"
import { useRouter } from "next/navigation"

export const StudioUploadModal = () => {
    const router = useRouter();
    const utils = trpc.useUtils();
    const create = trpc.vidoes.create.useMutation({
        onSuccess: () => {
            toast.success("Video Created")
            utils.studio.getMany.invalidate();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const onSuccess = () => {
        if (!create.data?.video.id) return;
        create.reset();
        router.push(`/studio/videos/${create.data.video.id}`);
    }

    return (

        <>
            <ResponsiveModal title="Upload a Video" open={!!create.data} onOpenChange={() => { create.reset() }}>
                {create.data?.url ? <StudioUploader endpoint={create.data?.url} onSuccess={onSuccess} /> : <Loader2Icon />}
            </ResponsiveModal>
            <Button variant="ghost" onClick={() => create.mutate()} disabled={create.isPending}>
                {create.isPending ? <Loader2Icon className="animate-spin" /> : <VideoIcon className="size-5" />}

            </Button>
        </>
    )
}