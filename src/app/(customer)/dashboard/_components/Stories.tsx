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

  return (
    <div className="w-full">
        <h2 className="text-xl font-bold mb-4 font-headline">Daily Stories</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {stories.map(story => (
            <button
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
            </button>
          ))}
        </div>

        <Dialog open={open} onOpenChange={handleOpenChange}>
          {selectedStory && (
            <DialogContent className="p-0 m-0 bg-black border-none max-w-full w-full h-full max-h-screen sm:rounded-none">
              <DialogHeader className="p-4 absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent flex flex-row items-center justify-between z-10">
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
                      <DialogTitle className="font-bold text-white text-sm text-left">{selectedStory.label}</DialogTitle>
                      <DialogDescription className="text-xs text-white/80 text-left">{selectedStory.author}</DialogDescription>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-white rounded-full hover:bg-white/20 hover:text-white" onClick={() => setOpen(false)}>
                    <X className="w-5 h-5"/>
                </Button>
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
              </div>
            </DialogContent>
          )}
        </Dialog>
    </div>
  );
}
