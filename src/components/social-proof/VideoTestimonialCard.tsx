import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Star, Quote } from "lucide-react";
import LazyImage from "@/components/LazyImage";

interface VideoData {
  id: number;
  clientName: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  embedUrl: string;
  rating: number;
  testimonial: string;
}

interface VideoTestimonialCardProps {
  video: VideoData;
}

const VideoTestimonialCard: React.FC<VideoTestimonialCardProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = () => {
    if (video.embedUrl) {
      setIsPlaying(true);
    }
  };

  return (
    <div className="group p-2 transition-transform duration-500 hover:-translate-y-2 h-full">
      <Card className="bg-card border border-border shadow-medium group-hover:shadow-extra-large transition-all duration-500 overflow-hidden relative h-full flex flex-col">
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
       
       <CardContent className="p-0 relative z-10 flex flex-col h-full">
          {/* Video Area */}
          <div className="relative aspect-video bg-primary/10 overflow-hidden">
            {isPlaying && video.embedUrl ? (
              // YouTube iframe
              <iframe
                src={video.embedUrl + "?autoplay=1"}
                title={`Depoimento de ${video.clientName}`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              // Thumbnail with play button
              <div 
                className="cursor-pointer group/video w-full h-full"
                onClick={handlePlayVideo}
              >
                {video.videoUrl !== "#" ? (
                  // YouTube preview
                  <>
                    <LazyImage
                      src={video.thumbnail}
                      alt={`Depoimento de ${video.clientName}`}
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover/video:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center group-hover/video:scale-110 transition-transform duration-300 shadow-lg">
                        <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </>
                ) : (
                  // Generic video placeholder
                  <div className="absolute inset-0 bg-primary flex items-center justify-center transition-all duration-300 group-hover/video:bg-primary/95">
                    <div className="text-center text-primary-foreground">
                      <div className="w-20 h-20 bg-primary-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover/video:bg-primary-foreground/30 group-hover/video:scale-110 transition-all duration-300 border border-primary-foreground/30">
                        <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{video.clientName}</h3>
                      <p className="text-sm opacity-90">{video.title}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card Content */}
          <div className="p-6 flex-1 flex flex-col justify-between">
           <div className="flex items-center gap-1 mb-4">
             {[...Array(video.rating)].map((_, i) => (
               <Star key={i} className="w-4 h-4 text-accent fill-current" />
             ))}
           </div>
            
            <div className="mb-6 flex-1">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Quote className="w-4 h-4 text-accent" />
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {video.testimonial}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</p>
                <p className="text-lg font-bold text-foreground">{video.clientName}</p>
              </div>
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-accent-foreground font-bold text-lg shadow-soft">
                {video.clientName[0]}
              </div>
            </div>
         </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoTestimonialCard;