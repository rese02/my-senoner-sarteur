
'use client';
import { useState } from 'react';
import type { Story } from '@/lib/types';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function Stories({ stories }: { stories: Story[] }) {
  const [open, setOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    setOpen(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedStory(null);
    }
  }
  
  if (stories.length === 0) {
      return null;
  }

  return (
    <div className="w-full">
        <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {stories.map(story => (
            <div 
              key={story.id} 
              className="flex-shrink-0 w-20 flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => handleStoryClick(story)}
            >
                <div className="relative w-[70px] h-[70px] rounded-full p-0.5 bg-gradient-to-tr from-accent to-primary">
                    <div className="bg-background p-0.5 rounded-full w-full h-full">
                        <Image
                          src={story.imageUrl}
                          alt={story.label}
                          width={66}
                          height={66}
                          sizes="66px"
                          className="rounded-full object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={story.imageHint}
                        />
                    </div>
                </div>
            </div>
          ))}
        </div>
        
        {selectedStory && (
           <Dialog open={open} onOpenChange={handleOpenChange}>
              <DialogContent className="p-0 m-0 bg-black border-none max-w-lg w-full h-[90vh] max-h-[90vh] rounded-xl overflow-hidden">
                  <div className="relative h-full w-full">
                      <Image
                          src={selectedStory.imageUrl}
                          alt={selectedStory.label}
                          fill
                          className="object-contain"
                          sizes="100vw"
                          data-ai-hint={selectedStory.imageHint}
                      />
                       <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                 <div className="relative w-10 h-10">
                                    <Image
                                      src={selectedStory.imageUrl}
                                      alt={selectedStory.label}
                                      fill
                                      sizes="40px"
                                      className="rounded-full object-cover"
                                    />
                                 </div>
                                 <div>
                                    <p className="font-bold text-white text-sm">{selectedStory.label}</p>
                                    <p className="text-xs text-white/80">{selectedStory.author}</p>
                                 </div>
                            </div>
                           <Button variant="ghost" size="icon" className="text-white rounded-full hover:bg-white/20" onClick={() => setOpen(false)}>
                                <X className="w-5 h-5"/>
                           </Button>
                       </div>
                  </div>
              </DialogContent>
           </Dialog>
        )}
    </div>
  );
}
