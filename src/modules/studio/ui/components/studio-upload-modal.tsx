"use client"

import { Button } from "@/components/ui/button"
import { Loader2Icon, PlusIcon, VideoIcon } from "lucide-react"
import { trpc } from "@/trpc/client"
import { toast } from "sonner"

export const StudioUploadModal = () => {

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

    return (
        <Button variant="ghost" onClick={() => create.mutate()} disabled={create.isPending}>
            {create.isPending ? <Loader2Icon className="animate-spin" /> : <VideoIcon className="size-5" />}

        </Button>
    )
}