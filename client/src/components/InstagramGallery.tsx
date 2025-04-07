import React from "react";

interface InstagramPost {
  id: number;
  imageUrl: string;
  likes: number;
  comments: number;
}

const instagramPosts: InstagramPost[] = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1583916368816-65f4d05ac777?auto=format&fit=crop&q=80&w=500&h=500",
    likes: 234,
    comments: 21
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1596207891316-23851be3cc20?auto=format&fit=crop&q=80&w=500&h=500", 
    likes: 186,
    comments: 15
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?auto=format&fit=crop&q=80&w=500&h=500",
    likes: 192,
    comments: 18
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1616673046934-d17b21c4df0e?auto=format&fit=crop&q=80&w=500&h=500",
    likes: 208,
    comments: 24
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=500&h=500",
    likes: 267,
    comments: 32
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1619994403073-2cec99c1db44?auto=format&fit=crop&q=80&w=500&h=500",
    likes: 176,
    comments: 12
  }
];

export default function InstagramGallery() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl text-primary mb-4">Follow Us on Instagram</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            @noortaibaperfumes • Join our community and share your fragrance journey
          </p>
          <div className="w-16 h-1 bg-accent mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map(post => (
            <div key={post.id} className="relative group overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={`Instagram post ${post.id}`}
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-white text-center">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center">
                      <i className="ri-heart-fill mr-2"></i>
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="ri-chat-1-fill mr-2"></i>
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="https://www.instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors uppercase tracking-wider text-sm"
          >
            <i className="ri-instagram-line mr-2 text-lg"></i>
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}