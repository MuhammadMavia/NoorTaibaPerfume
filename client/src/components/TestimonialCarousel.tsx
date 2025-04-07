import React, { useRef, useState } from "react";

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
    content: "Arabian Nights is truly exceptional. The fragrance evolves beautifully throughout the day and has impressive longevity. I receive compliments every time I wear it.",
    rating: 5,
    author: {
      name: "Sarah J.",
      title: "Loyal Customer",
      avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&q=80&w=100&h=100"
    }
  },
  {
    id: 2,
    content: "The Rose Elixir perfume is unlike any floral fragrance I've encountered. It's sophisticated, not overpowering, and lasts all day. The packaging is also absolutely stunning.",
    rating: 5,
    author: {
      name: "Michael T.",
      title: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100"
    }
  },
  {
    id: 3,
    content: "I've been collecting perfumes for years, and Noor e Taiba fragrances stand out for their quality and uniqueness. Amber Oud has become my signature scent for special occasions.",
    rating: 4.5,
    author: {
      name: "Aisha R.",
      title: "Fragrance Enthusiast",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=100&h=100"
    }
  }
];

export default function TestimonialCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const scrollToNext = () => {
    if (containerRef.current) {
      const newIndex = Math.min(activeIndex + 1, testimonials.length - 1);
      setActiveIndex(newIndex);
      const cardWidth = containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
        left: newIndex * (cardWidth + 24), // 24px is the gap
        behavior: 'smooth'
      });
    }
  };
  
  const scrollToPrev = () => {
    if (containerRef.current) {
      const newIndex = Math.max(activeIndex - 1, 0);
      setActiveIndex(newIndex);
      const cardWidth = containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
        left: newIndex * (cardWidth + 24), // 24px is the gap
        behavior: 'smooth'
      });
    }
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="ri-star-fill"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="ri-star-half-fill"></i>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="ri-star-line"></i>);
    }
    
    return stars;
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="font-playfair text-3xl md:text-4xl text-primary text-center mb-16">Customer Experiences</h2>
        
        <div className="relative">
          <div 
            ref={containerRef}
            className="overflow-x-auto scrollbar-hide product-card-container"
          >
            <div className="flex space-x-6" style={{ width: "fit-content" }}>
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-80 md:w-96 bg-secondary p-8 flex-shrink-0">
                  <div className="flex items-center text-accent mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-foreground italic mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img 
                        src={testimonial.author.avatar}
                        alt={`${testimonial.author.name} Avatar`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-primary">{testimonial.author.name}</p>
                      <p className="text-foreground/70 text-sm">{testimonial.author.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md flex items-center justify-center text-primary hover:text-accent transition-colors z-10 ${
              activeIndex === 0 ? 'hidden' : 'hidden md:flex'
            }`}
            onClick={scrollToPrev}
            aria-label="Previous testimonial"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>
          
          <button 
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md flex items-center justify-center text-primary hover:text-accent transition-colors z-10 ${
              activeIndex === testimonials.length - 1 ? 'hidden' : 'hidden md:flex'
            }`}
            onClick={scrollToNext}
            aria-label="Next testimonial"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
