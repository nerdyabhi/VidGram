"use client"
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface FilterCarouselProps {
    value?: string | null;
    isLoading?: boolean;
    onSelect: (value: string | null) => void;
    data: {
        value: string;
        label: string;
    }[]
}

export const FilterCarousel = ({ value, onSelect, data, isLoading }: FilterCarouselProps) => {

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) return;
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);
    }, [api])

    return (

        <div className="relative w-full">
            <div className={cn(
                "absolute left-0 z-20 top-0 h-full w-22 bg-gradient-to-r from-white to-white/0 pointer-events-none",
                current === 1 && "hidden"
            )} />

            <Carousel setApi={setApi} opts={{
                align: "start",
                dragFree: true,
            }} className="w-full px-12">

                <CarouselContent className="-ml-3">
                    {!isLoading && <CarouselItem onClick={() => onSelect?.(null)} className="pl-3 basis-auto">
                        <Badge variant={value === null ? "default" : "secondary"} className=" px-3 py-1 cursor-pointer whitespace-nowrap text-sm rounded-xl">
                            All
                        </Badge>
                    </CarouselItem>
                    }
                    {isLoading && Array.from({ length: 14 }).map((_, index) => (
                        <CarouselItem key={index} className="pl-3 basis-auto">
                            <Skeleton className="rounded-lg px-3 py-1 h-full text-sm w-[100px] font-semibold">
                                &nbsp;
                            </Skeleton>
                        </CarouselItem>
                    ))}

                    {!isLoading && data.map((item) => (
                        <CarouselItem key={item.value}
                         className="pl-3 basis-auto"
                         onClick={()=>onSelect(item.value)}
                         >
                            <Badge variant={value === null ? "default" : "secondary"} className=" px-3 py-1 cursor-pointer whitespace-nowrap text-sm rounded-xl">
                                {item.label}
                            </Badge>
                        </CarouselItem>
                    ))}


                </CarouselContent>
                <CarouselPrevious className=" bg-hidden md:flex left-0 z-20" />
                <CarouselNext className="hidden md:flex right-0 z-20" />
            </Carousel>
            {/*right fade  */}
            <div className={cn(
                "absolute right-12 z-20 top-0 h-full w-14 bg-gradient-to-r from-transparent to-white pointer-events-none",
                current === count && "hidden"
            )} />
        </div>
    )
}