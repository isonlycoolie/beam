import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@beam/ui/components/carousel";

export default function CarouselDefault() {
  return (
    <Carousel className="w-[320px]">
      <CarouselContent>
        {[1, 2, 3].map((n) => (
          <CarouselItem key={n}>
            <div className="grid h-40 place-items-center rounded-(--radius-card) border border-border text-[14px] text-text-2">Slide {n}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
