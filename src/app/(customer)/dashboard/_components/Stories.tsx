
'use client';
import type { Story } from '@/lib/types';
import Image from 'next/image';

export function Stories({ stories }: { stories: Story[] }) {
  return (
    <div className="w-full">
        <h2 className="text-xl font-bold mb-4 font-headline px-4 md:px-0">Daily Stories</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {stories.map(story => (
            <div key={story.id} className="flex-shrink-0 w-20 flex flex-col items-center gap-2 cursor-pointer group">
                <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-yellow-400 to-primary">
                    <div className="bg-background p-1 rounded-full w-full h-full">
                        <Image
                        src={story.imageUrl}
                        alt={story.label}
                        width={72}
                        height={72}
                        className="rounded-full object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={story.imageHint}
                        />
                    </div>
                </div>
                <p className="text-xs text-center font-medium text-muted-foreground w-full truncate">{story.label}</p>
            </div>
        ))}
        </div>
    </div>
  );
}
