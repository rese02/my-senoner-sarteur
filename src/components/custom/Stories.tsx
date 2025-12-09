'use client';
import { useState } from 'react';
import type { Story } from '@/lib/types';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
        <h2 className="text-xl font-bold mb-4 font-headline">Daily Stories</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {stories.map(story => (
            <div 
              key={story.id} 
              className="flex-shrink-0 w-20 flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => handleStoryClick(story)}
            >
                <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-yellow-400 to-primary">
                    <div className="bg-background p-1 rounded-full w-full h-full">
                        <Image
                          src={story.imageUrl}
                          alt={story.label}
                          width={72}
                          height={72}
                          sizes="72px"
                          className="rounded-full object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={story.imageHint}
                        />
                    </div>
                </div>
                <p className="text-xs text-center font-medium text-muted-foreground w-full truncate">{story.label}</p>
            </div>
          ))}
        </div>
        
        {selectedStory && (
           <Dialog open={open} onOpenChange={handleOpenChange}>
              <DialogContent className="p-0 m-0 bg-black border-none max-w-lg w-full h-[90vh] max-h-[90vh] rounded-xl overflow-hidden">
                  <DialogHeader className="sr-only">
                    <DialogTitle>Story: {selectedStory.label}</DialogTitle>
                    <DialogDescription>Vollbildansicht der Story von {selectedStory.author}.</DialogDescription>
                  </DialogHeader>
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
