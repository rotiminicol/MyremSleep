import { useState } from 'react';
import { Heart, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { CartSidebar } from '@/components/store/CartSidebar';

export function FavoritesDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useIsMobile();

    // This will eventually connect to a wishlist store
    const favorites: any[] = [];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button className="text-gray-800 hover:text-gray-600 transition-colors" aria-label="Favorites">
                    <Heart className="h-5 w-5" />
                </button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className={`bg-[#f5f1ed] p-0 gap-0 border-zinc-200 h-full flex flex-row overflow-hidden ${isMobile
                    ? "w-full border-l shadow-2xl"
                    : "w-full sm:max-w-3xl border-l"
                    }`}
            >
                {/* Left Sidebar - Recommendations */}
                <CartSidebar mode="favorite" />

                {/* Right Side - Favorites Content */}
                <div className="flex flex-col w-[55%] md:flex-1 h-full min-w-0 overflow-hidden">
                    <SheetHeader className="sticky top-0 z-30 flex-shrink-0 px-3 md:px-8 py-4 md:py-6 border-b border-[#e0dbd5] bg-[#f5f1ed]">
                        <div className="flex items-center justify-between gap-2">
                            <SheetTitle className="text-[15px] md:text-[22px] font-medium tracking-tight text-gray-900 whitespace-nowrap">Your Favorites</SheetTitle>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 md:p-2 hover:bg-gray-200/50 rounded-full transition-colors text-gray-500 hover:text-gray-900 flex-shrink-0"
                                aria-label="Close favorites"
                            >
                                <X className="h-4 w-4 md:h-5 md:w-5" />
                            </button>
                        </div>
                    </SheetHeader>

                    <div className="flex flex-col flex-1 min-h-0 items-center justify-center px-12 text-center bg-[#f5f1ed]">
                        {favorites.length === 0 ? (
                            <div className="space-y-4">
                                <Heart className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-[14px] leading-relaxed text-gray-400 font-light italic">
                                    You haven't added any favorites yet.
                                </p>
                            </div>
                        ) : (
                            <div className="w-full py-8">
                                {/* Favorites list would go here */}
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
