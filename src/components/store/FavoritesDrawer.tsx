import { useState } from 'react';
import { Heart, X } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

export function FavoritesDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    // This will eventually connect to a wishlist store
    const favorites: any[] = [];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button className="text-gray-800 hover:text-gray-600 transition-colors" aria-label="Favorites">
                    <Heart className="h-5 w-5" />
                </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-[440px] flex flex-col h-full bg-[#f5f1ed] p-0 gap-0">
                <SheetHeader className="flex-shrink-0 px-8 py-6 border-b border-[#e0dbd5]">
                    <SheetTitle className="text-[22px] font-medium tracking-tight text-gray-900">Your Favorites</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col flex-1 min-h-0 items-center justify-center px-12 text-center">
                    {favorites.length === 0 ? (
                        <div className="space-y-4">
                            <p className="text-[14px] leading-relaxed text-gray-400 font-light">
                                You haven't added any favorites yet. Browse our collection and click the heart icon to save items you love.
                            </p>
                        </div>
                    ) : (
                        <div className="w-full py-8">
                            {/* Favorites list would go here */}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
