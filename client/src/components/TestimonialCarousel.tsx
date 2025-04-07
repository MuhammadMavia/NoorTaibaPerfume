import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Testimonial {
  id: number;
  content: string;
  rating: number;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    content: "The fragrances from Noor e Taiba are truly exceptional. The attention to detail and quality of their perfumes is unmatched. My favorite is their oud collection which transports me back to memories of my travels.",
    rating: 5,
    author: {
      name: "Sarah Johnson",
      title: "Fragrance Enthusiast",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg"
    }
  },
  {
    id: 2,
    content: "I've been collecting luxury perfumes for years, and Noor e Taiba stands out for their authentic scents and lasting power. Their customer service is equally impressive - personalized and attentive.",
    rating: 5,
    author: {
      name: "Michael Robinson",
      title: "Perfume Collector",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  },
  {
    id: 3,
    content: "As someone who appreciates the art of perfumery, I can say with confidence that Noor e Taiba crafts some of the most sophisticated and complex fragrances I've encountered. Each scent tells a story.",
    rating: 5,
    author: {
      name: "Amina Khan",
      title: "Beauty Blogger",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    }
  },
  {
    id: 4,
    content: "The gift set I purchased from Noor e Taiba was beautifully presented and made an excellent impression. The recipient was thrilled with both the packaging and the exquisite fragrances inside.",
    rating: 5,
    author: {
      name: "David Chen",
      title: "Loyal Customer",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg"
    }
  }
];

export default function TestimonialCarousel() {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl text-primary mb-4">What Our Customers Say</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Discover why fragrance enthusiasts choose Noor e Taiba
          </p>
          <div className="w-16 h-1 bg-accent mx-auto mt-6"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Carousel 
            opts={{
              align: "center",
              loop: true
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map(testimonial => (
                <CarouselItem key={testimonial.id} className="md:basis-1/1">
                  <div className="bg-white p-8 shadow-sm flex flex-col items-center text-center h-full">
                    <div className="mb-6">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-2xl ${i < testimonial.rating ? "text-amber-400" : "text-gray-300"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    
                    <blockquote className="text-foreground/80 italic mb-8 leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="mt-auto">
                      <img 
                        src={testimonial.author.avatar} 
                        alt={testimonial.author.name}
                        className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                      />
                      <p className="font-playfair text-lg text-primary">{testimonial.author.name}</p>
                      <p className="text-foreground/60 text-sm">{testimonial.author.title}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex justify-between absolute inset-0 items-center pointer-events-none">
              <CarouselPrevious className="pointer-events-auto ml-4 bg-white/80 hover:bg-white" />
              <CarouselNext className="pointer-events-auto mr-4 bg-white/80 hover:bg-white" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}