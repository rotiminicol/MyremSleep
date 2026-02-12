// BlogPage.tsx - Elevated "Best of the Week" Design
import { motion, useScroll, useTransform } from 'framer-motion';
import { StoreNavbar } from '@/components/store/StoreNavbar';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { MOCK_PRODUCTS } from '@/lib/mock-products';

export const BLOG_POSTS = [
    {
        id: 1,
        slug: 'choose-care-organic-cotton-bedding',
        date: 'Sep 06, 2022',
        title: 'How to Choose and Care for Organic Cotton Bedding',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80',
        category: 'Care',
        excerpt: 'Master the art of preserving your organic cotton bedding with gentle care techniques that extend its lifespan and maintain its exceptional softness.',
        readTime: '6 min read',
        content: `When you invest in premium organic cotton bedding, you're not just purchasing sheets—you're investing in years of luxurious sleep. The key to maintaining that cloud-like softness and pristine appearance lies in understanding the delicate nature of organic fibers and treating them with the care they deserve.

Organic cotton differs fundamentally from conventional cotton. Without harsh chemical treatments, the fibers remain pure and breathable, but they also require gentler handling. The first rule of care is simple: always wash your bedding in cool or lukewarm water. Hot water can break down the natural fibers over time, causing premature wear and reducing that signature softness you fell in love with.

Choose your detergent wisely. Conventional detergents often contain optical brighteners, synthetic fragrances, and harsh chemicals that can coat organic cotton fibers, diminishing their breathability and natural moisture-wicking properties. Instead, opt for plant-based, fragrance-free detergents specifically formulated for delicate fabrics. A little goes a long way—using too much detergent can leave residue that makes your sheets feel stiff and less comfortable.

The drying process is equally crucial. While tumble drying on low heat is acceptable, air drying remains the gold standard for preserving organic cotton bedding. If you have the space, line drying in fresh air not only extends the life of your sheets but also gives them a natural, sun-kissed freshness that no fabric softener can replicate. When using a dryer, remove your bedding while it's still slightly damp to prevent over-drying, which can make the fibers brittle.

Ironing organic cotton bedding is entirely optional, but if you prefer crisp, hotel-style sheets, iron them while they're still slightly damp using a medium heat setting. The natural moisture in the fabric helps create smooth, wrinkle-free results without damaging the fibers. For those who embrace the relaxed, lived-in look, simply smooth your sheets by hand when making the bed—organic cotton naturally softens and drapes beautifully over time.

Storage matters more than you might think. Keep your organic bedding in a cool, dry place away from direct sunlight, which can fade colors and weaken fibers. Avoid plastic storage containers, which can trap moisture and lead to mildew. Instead, use breathable cotton storage bags or simply fold your sheets neatly in a linen closet with good air circulation.

Finally, rotate your bedding sets regularly. Having multiple sets allows each one to rest between uses, significantly extending their lifespan. With proper care, high-quality organic cotton bedding can last for years, becoming softer and more comfortable with each wash—a true testament to the enduring value of natural, sustainable materials.`
    },
    {
        id: 2,
        slug: 'perfect-bedding-skin-type',
        date: '01.27.26',
        title: 'How To Choose The Perfect Bedding For Your Skin Type',
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80',
        category: 'Wellness',
        excerpt: 'Discover how the right fabric choice can transform your sleep quality and skin health overnight.',
        readTime: '5 min read',
        content: `Your bedding does more than just provide comfort—it's in direct contact with your skin for seven to nine hours every night, making it one of the most important factors in your skincare routine. Understanding your skin type and choosing the right fabric can dramatically improve not only your sleep quality but also your skin's health and appearance.

For those with sensitive skin, organic cotton reigns supreme. Free from pesticides, synthetic dyes, and chemical finishes, organic cotton minimizes the risk of irritation and allergic reactions. Its natural breathability allows your skin to regulate temperature throughout the night, preventing the excess sweating that can lead to breakouts and irritation. Look for GOTS-certified organic cotton, which guarantees the highest standards of purity and sustainability.

If you have dry skin, you'll want bedding that helps retain moisture rather than wicking it away. Bamboo viscose and Tencel lyocell are excellent choices, as they're naturally moisture-retaining and incredibly soft against the skin. These fabrics create a gentle, hydrating microclimate that supports your skin's natural moisture barrier. Pair them with a good nighttime moisturizer, and you'll wake up with noticeably softer, more supple skin.

Oily and acne-prone skin requires a different approach. You need fabrics that are both breathable and antimicrobial to prevent the buildup of oils and bacteria that can clog pores. Percale-weave cotton offers a crisp, cool surface that doesn't trap heat or moisture. Its tight weave creates a smooth surface that's less likely to irritate existing breakouts. Additionally, washing your pillowcases every two to three days becomes crucial—consider investing in multiple sets to make this easier.

For those dealing with eczema or psoriasis, the smoothness of the fabric is paramount. Sateen-weave organic cotton provides a silky-smooth surface that minimizes friction against inflamed skin. Avoid any bedding with rough textures or synthetic blends, which can exacerbate symptoms. Some people with severe skin conditions also benefit from silk pillowcases, which create virtually no friction and help hair and skin retain moisture.

Thread count matters, but not in the way marketing would have you believe. For most skin types, a thread count between 200 and 400 offers the ideal balance of softness, breathability, and durability. Higher thread counts can actually trap heat and reduce breathability, potentially leading to increased sweating and skin irritation.

Remember that even the best bedding needs proper care. Wash your sheets weekly in fragrance-free, hypoallergenic detergent, and avoid fabric softeners, which can leave irritating residues on the fabric. Your skin—and your sleep—will thank you for making these thoughtful choices.`
    },
    {
        id: 3,
        slug: 'organic-cotton-special',
        date: '01.22.26',
        title: 'What Makes Organic Cotton Bedding So Special',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
        category: 'Sustainability',
        excerpt: 'Explore the meticulous journey of GOTS-certified organic cotton from seed to sheet.',
        readTime: '7 min read',
        content: `In a world of synthetic fabrics and fast fashion, organic cotton bedding stands as a testament to the enduring value of natural, sustainably produced materials. But what exactly makes organic cotton so special, and why is it worth the investment?

The journey begins in the soil. Organic cotton is grown without synthetic pesticides, herbicides, or genetically modified seeds. Instead, farmers rely on natural methods like crop rotation, beneficial insects, and compost to maintain healthy soil and control pests. This approach not only produces cleaner cotton but also protects the health of farmworkers and surrounding ecosystems. Conventional cotton farming uses approximately 16% of the world's pesticides despite occupying only 2.5% of cultivated land—a stark contrast to organic methods.

GOTS certification (Global Organic Textile Standard) ensures that organic cotton bedding meets rigorous standards throughout the entire production process. From the farm to the finished product, every step is monitored and verified. This means no toxic dyes, no formaldehyde finishes, and no chlorine bleaching. The result is bedding that's not only better for the environment but also safer for your skin and overall health.

The feel of organic cotton is distinctly different from conventional cotton. Without chemical treatments, the natural fibers remain intact, creating a softer, more breathable fabric. Many people describe sleeping on organic cotton as feeling like they're wrapped in a cloud—it's simultaneously light and cozy, cool yet comforting. This breathability is crucial for temperature regulation, helping you stay cool in summer and warm in winter.

Durability is another hallmark of quality organic cotton. Because the fibers haven't been weakened by harsh chemicals, organic cotton bedding actually becomes softer and more comfortable with each wash, rather than deteriorating. With proper care, a good set of organic cotton sheets can last for years, making them a smart long-term investment despite the higher upfront cost.

The environmental impact extends beyond the farm. Organic cotton production uses significantly less water than conventional methods and doesn't contaminate water sources with toxic runoff. The soil remains healthy and fertile, sequestering carbon and supporting biodiversity. When you choose organic cotton bedding, you're voting with your wallet for a more sustainable textile industry.

For those with allergies or chemical sensitivities, organic cotton can be life-changing. Without residual pesticides, synthetic dyes, or chemical finishes, it's one of the purest, most hypoallergenic bedding options available. Many people who struggle with skin irritation or respiratory issues find significant relief when they switch to organic cotton bedding.

Ultimately, organic cotton bedding represents a return to simplicity and quality. In an age of synthetic everything, there's something deeply satisfying about sleeping on fabric that's been grown and processed with care, respect for the environment, and attention to human health. It's not just bedding—it's a commitment to better sleep and a better world.`
    },
    {
        id: 4,
        slug: 'sleep-hygiene-tips',
        date: '02.10.26',
        title: 'Top 10 Sleep Hygiene Tips for a Restful Night',
        image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&auto=format&fit=crop&q=80',
        category: 'Health',
        excerpt: 'Improve your sleep quality with these simple yet effective sleep hygiene practices backed by science.',
        readTime: '8 min read',
        content: `Quality sleep is the foundation of good health, yet millions of people struggle to get the rest they need. The good news is that improving your sleep doesn't require expensive gadgets or medications—it starts with establishing solid sleep hygiene practices. Here are ten evidence-based strategies to transform your nights and energize your days.

First and foremost, maintain a consistent sleep schedule. Your body's internal clock, or circadian rhythm, thrives on regularity. Going to bed and waking up at the same time every day—yes, even on weekends—helps regulate your sleep-wake cycle. This consistency makes falling asleep easier and waking up more natural. After a few weeks of maintaining this schedule, you may find you no longer need an alarm clock.

Create a sleep sanctuary in your bedroom. Your sleeping environment should be cool, dark, and quiet. The ideal temperature for sleep is between 60-67°F (15-19°C). Invest in blackout curtains or a sleep mask to block out light, which can interfere with melatonin production. If noise is an issue, consider a white noise machine or high-quality earplugs. Your bedding matters too—choose breathable, natural fabrics like organic cotton that help regulate body temperature throughout the night.

Establish a relaxing pre-sleep routine. The hour before bed should be a wind-down period that signals to your body it's time to sleep. This might include reading a book, taking a warm bath, practicing gentle stretches, or doing relaxation exercises. The key is consistency—performing the same calming activities each night trains your brain to recognize these as sleep cues.

Limit screen time before bed. The blue light emitted by phones, tablets, and computers suppresses melatonin production and can delay sleep onset by up to an hour. Try to avoid screens for at least one hour before bedtime. If you must use devices, enable night mode or use blue light filtering glasses. Better yet, charge your phone outside the bedroom to remove the temptation entirely.

Watch what and when you eat and drink. Avoid large meals within three hours of bedtime, as digestion can interfere with sleep. While alcohol might make you feel drowsy initially, it disrupts sleep cycles and reduces sleep quality. Caffeine has a half-life of about five hours, so that afternoon coffee could still be affecting you at bedtime. Even seemingly innocent foods can impact sleep—spicy or acidic foods can cause heartburn when you lie down.

Exercise regularly, but time it right. Regular physical activity promotes better sleep, but exercising too close to bedtime can be stimulating. Aim to finish moderate to vigorous workouts at least three hours before bed. However, gentle activities like yoga or stretching can actually promote relaxation and are fine closer to bedtime.

Manage stress and anxiety. Racing thoughts are one of the most common sleep disruptors. Keep a journal by your bedside to jot down worries or tomorrow's to-do list, getting them out of your head and onto paper. Practice mindfulness meditation or progressive muscle relaxation. If you can't fall asleep after 20 minutes, get up and do a quiet, non-stimulating activity until you feel sleepy.

Reserve your bed for sleep and intimacy only. Don't work, watch TV, or scroll through social media in bed. This strengthens the mental association between your bed and sleep, making it easier to fall asleep when you lie down. If you have trouble sleeping, this association becomes even more important.

Get natural light exposure during the day. Sunlight helps regulate your circadian rhythm. Try to get at least 30 minutes of natural light exposure, preferably in the morning. This helps you feel more alert during the day and sleepier at night. If you work indoors, take breaks outside or sit near windows when possible.

Finally, be patient and consistent. Sleep hygiene improvements don't work overnight (pun intended). It can take several weeks for new habits to translate into better sleep. Keep a sleep diary to track your progress and identify patterns. If sleep problems persist despite good sleep hygiene, consult a healthcare provider—you may have an underlying sleep disorder that requires professional treatment.

Remember, quality sleep is not a luxury—it's a biological necessity. By implementing these sleep hygiene practices, you're investing in your physical health, mental clarity, emotional well-being, and overall quality of life. Sweet dreams!`
    },
    {
        id: 5,
        slug: 'sustainable-bedroom-decor',
        date: '02.05.26',
        title: 'Designing a Sustainable and Eco-Friendly Bedroom',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80',
        category: 'Home',
        excerpt: 'Create a peaceful sanctuary that is kind to both you and the planet with these sustainable design principles.',
        readTime: '5 min read',
        content: `Your bedroom should be a sanctuary—a place of rest, rejuvenation, and peace. But creating this haven doesn't have to come at the expense of the environment. With thoughtful choices and sustainable design principles, you can craft a bedroom that's both beautiful and eco-friendly.

Start with the foundation: your bed and bedding. Choose a mattress made from natural, sustainable materials like organic latex, organic cotton, or wool. These materials are not only better for the environment but also free from the flame retardants and volatile organic compounds (VOCs) found in many conventional mattresses. For bedding, organic cotton, linen, and bamboo are excellent choices. They're breathable, durable, and produced with minimal environmental impact.

Furniture selection is crucial in sustainable bedroom design. Look for pieces made from reclaimed wood, FSC-certified wood, or rapidly renewable materials like bamboo. Vintage and secondhand furniture is inherently sustainable—it gives new life to existing pieces and prevents them from ending up in landfills. Plus, older furniture often has better craftsmanship and unique character that mass-produced pieces lack. When buying new, choose quality over quantity. One well-made dresser that lasts decades is far more sustainable than multiple cheap pieces that need replacing every few years.

Paint and finishes deserve careful consideration. Conventional paints release VOCs that can off-gas for years, affecting indoor air quality and your health. Choose low-VOC or zero-VOC paints in natural, calming colors. Clay and mineral-based paints are excellent eco-friendly alternatives that also help regulate humidity. For wood finishes, opt for natural oils and waxes instead of synthetic varnishes.

Lighting plays a dual role in sustainable bedroom design. Maximize natural light during the day with sheer, organic cotton curtains. For artificial lighting, LED bulbs use up to 75% less energy than incandescent bulbs and last much longer. Install dimmer switches to adjust lighting levels and create ambiance while saving energy. Consider the placement of lights carefully—good task lighting reduces the need for bright overhead lights.

Window treatments should balance light control, privacy, and energy efficiency. Cellular shades or honeycomb blinds provide excellent insulation, helping maintain comfortable temperatures year-round. Layer them with curtains made from organic cotton, linen, or hemp for added insulation and aesthetic appeal. In summer, light-colored window treatments reflect heat; in winter, thermal curtains help retain warmth.

Flooring choices significantly impact both sustainability and bedroom comfort. If you're replacing flooring, consider bamboo, cork, or reclaimed hardwood. These materials are renewable, durable, and naturally beautiful. For softness underfoot, add area rugs made from natural fibers like wool, jute, or organic cotton. Avoid synthetic carpets, which are typically made from petroleum-based materials and treated with stain-resistant chemicals.

Decluttering is perhaps the most sustainable practice of all. A minimalist approach means buying less, which reduces consumption and waste. Keep only items that serve a purpose or bring you joy. Use sustainable storage solutions like woven baskets, wooden boxes, or repurposed containers to keep things organized. A clutter-free bedroom is not only more peaceful but also easier to clean with eco-friendly products.

Incorporate plants into your bedroom design. They naturally purify air, add visual interest, and create a connection to nature. Choose low-maintenance varieties like snake plants, pothos, or peace lilies that thrive in bedroom conditions. Use planters made from sustainable materials like ceramic, terracotta, or reclaimed wood.

Finally, maintain your sustainable bedroom with eco-friendly cleaning products. Many conventional cleaners contain harsh chemicals that pollute indoor air and waterways. Simple solutions like vinegar, baking soda, and castile soap can handle most cleaning tasks effectively and safely. For bedding, use plant-based, fragrance-free detergents that are gentle on both fabrics and the environment.

Creating a sustainable bedroom is an ongoing journey, not a destination. Start with one or two changes and build from there. Each sustainable choice you make contributes to a healthier home and a healthier planet, all while creating the peaceful retreat you deserve.`
    },
    {
        id: 6,
        slug: 'morning-routine-success',
        date: '01.30.26',
        title: 'The Ultimate Morning Routine for Daily Success',
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80',
        category: 'Mindfulness',
        excerpt: 'Start your day with purpose and energy using these proven morning habits that successful people swear by.',
        readTime: '4 min read',
        content: `How you start your morning sets the tone for your entire day. A well-crafted morning routine can be the difference between feeling rushed and reactive versus calm and in control. The most successful people understand this and have developed morning rituals that energize their bodies, focus their minds, and align their actions with their goals.

The foundation of any great morning routine is quality sleep. You can't have a successful morning if you're exhausted from poor sleep. This means going to bed at a consistent time, creating a sleep-friendly environment with comfortable bedding, and getting seven to nine hours of rest. When you wake up naturally refreshed, everything else becomes easier.

Start your day without immediately reaching for your phone. Those first few minutes of consciousness are precious—don't surrender them to emails, news, or social media. Instead, take a few moments to simply be present. Notice how you feel, take some deep breaths, and set an intention for the day. This simple practice helps you start from a place of mindfulness rather than reactivity.

Hydration is crucial after hours of sleep. Keep a glass of water by your bedside and drink it first thing upon waking. Some people add lemon for flavor and a vitamin C boost. This simple act jumpstarts your metabolism, aids digestion, and helps you feel more alert. Wait at least 30 minutes before having coffee—this allows your body's natural cortisol production to peak, making caffeine more effective later.

Movement is essential for energizing your body and mind. This doesn't mean you need an intense workout (though that's great if it works for you). Even 10-15 minutes of stretching, yoga, or a short walk can increase blood flow, release endorphins, and improve mental clarity. The key is consistency—choose something you enjoy and will actually do every day.

Nourish your body with a healthy breakfast. What you eat in the morning affects your energy levels, concentration, and mood throughout the day. Focus on protein, healthy fats, and complex carbohydrates. This might be eggs with avocado and whole grain toast, Greek yogurt with berries and nuts, or a smoothie with protein powder and greens. Avoid sugary cereals and pastries that cause energy crashes.

Take time for personal development. This could be reading for 20 minutes, journaling, meditation, or listening to an educational podcast. Successful people are lifelong learners who dedicate time each day to growth. Morning is ideal because your mind is fresh and you're less likely to be interrupted. Even 15 minutes daily adds up to over 90 hours per year—imagine what you could learn or accomplish in that time.

Plan your day with intention. Review your calendar and to-do list. Identify your top three priorities—the things that, if accomplished, would make the day a success. This prevents you from getting caught up in busy work and ensures you're making progress on what truly matters. Some people find it helpful to do this the night before, so they wake up with clarity about the day ahead.

Practice gratitude. Take a moment to acknowledge three things you're grateful for. This simple practice shifts your mindset from scarcity to abundance and has been shown to improve mood, reduce stress, and increase overall life satisfaction. You can do this mentally, write it in a journal, or share it with a partner or family member.

Prepare the night before. A successful morning routine actually begins the evening before. Lay out your clothes, prepare your breakfast ingredients, pack your bag, and tidy up. This eliminates decision fatigue and friction in the morning, making it easier to stick to your routine even when you're tired or pressed for time.

Remember, the perfect morning routine is the one you'll actually follow. Start small—choose one or two practices that resonate with you and build from there. Be patient with yourself as you develop new habits. It takes time for routines to become automatic, but the investment is worth it. A strong morning routine is one of the most powerful tools you have for creating the life you want, one day at a time.`
    }
];

export default function BlogPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    return (
        <div className="min-h-screen bg-[#FAF7F5]" ref={containerRef}>
            <StoreNavbar />

            {/* Refined "Best of the Week" Header */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-8 sm:pt-4 lg:pt-12 pb-6 sm:pb-4 flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
                <div className="flex items-baseline gap-3 sm:gap-6">
                    <h1 className="text-4xl sm:text-5xl lg:text-8xl font-black italic font-sans text-gray-900 tracking-tighter">
                        Best of the week
                    </h1>
                </div>
                <Link
                    to="/blog/all"
                    className="text-xs sm:text-xs font-bold text-gray-900 hover:opacity-70 transition-colors flex items-center gap-1 py-2 px-1"
                >
                    See all posts <span className="ml-1">→</span>
                </Link>
            </div>

            {/* Bento Grid Layout - "Best of the Week" Refined */}
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 pb-16 sm:pb-20 lg:pb-32">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                    {/* 1. Featured Blog Post Container - Full width on mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="sm:col-span-8 group relative rounded-[2rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-gray-100 aspect-[3/4] sm:aspect-auto sm:h-[600px] lg:h-[750px]"
                    >
                        <Link to={`/blog/${BLOG_POSTS[0].slug}`} className="block h-full relative">
                            <img
                                src={BLOG_POSTS[0].image}
                                alt={BLOG_POSTS[0].title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />

                            {/* Gradient Overlay for better text readability on mobile */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent sm:from-transparent sm:via-transparent sm:to-transparent" />

                            {/* Content Overlay - Visible on mobile */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:hidden z-20">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1.5 bg-white text-[10px] font-bold text-gray-900 rounded-full uppercase tracking-wider shadow-sm">
                                            {BLOG_POSTS[0].category}
                                        </span>
                                        <span className="text-[11px] font-semibold text-white drop-shadow-lg">
                                            {BLOG_POSTS[0].readTime}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold font-serif text-white leading-tight drop-shadow-lg">
                                        {BLOG_POSTS[0].title}
                                    </h2>
                                </div>
                            </div>

                            {/* Bottom Right Arrow Button */}
                            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                    <svg className="w-5 h-5 sm:w-8 sm:h-8 rotate-[-45deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </motion.div>


                    {/* 2. Side Blog Post Containers - Stack on mobile */}
                    <div className="sm:col-span-4 flex flex-col gap-4 sm:gap-6 lg:gap-8">
                        {/* Top Side Blog Post */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-[#b8d0d1] rounded-[2rem] sm:rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between aspect-[4/3] sm:aspect-auto sm:h-[300px] lg:h-[360px] relative group overflow-hidden"
                        >
                            <Link to={`/blog/${BLOG_POSTS[1].slug}`} className="absolute inset-0 z-0">
                                <img
                                    src={BLOG_POSTS[1].image}
                                    alt={BLOG_POSTS[1].title}
                                    className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
                                />
                            </Link>

                            <div className="relative z-10 flex justify-between items-start">
                                <span className="px-3 py-1.5 sm:px-4 sm:py-1.5 bg-white/30 border border-white/20 rounded-full text-[9px] sm:text-[10px] font-bold text-gray-900 uppercase tracking-widest">
                                    HOT NOW
                                </span>
                            </div>

                            {/* Mobile: Show title at bottom */}
                            <div className="relative z-10 sm:hidden">
                                <h3 className="text-xl font-bold font-serif text-white drop-shadow-lg leading-tight">
                                    {BLOG_POSTS[1].title}
                                </h3>
                            </div>
                        </motion.div>

                        {/* Bottom Side Blog Post */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="rounded-[2rem] sm:rounded-[2rem] overflow-hidden relative group aspect-[4/3] sm:aspect-auto sm:h-[300px] lg:h-[360px]"
                        >
                            <Link to={`/blog/${BLOG_POSTS[2].slug}`} className="block h-full relative">
                                <img
                                    src={BLOG_POSTS[2].image}
                                    alt={BLOG_POSTS[2].title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent sm:bg-black/10 sm:group-hover:bg-black/20 transition-colors" />

                                {/* Mobile: Show title at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:hidden z-20">
                                    <h3 className="text-xl font-bold font-serif text-white leading-tight drop-shadow-lg">
                                        {BLOG_POSTS[2].title}
                                    </h3>
                                </div>

                                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-fit h-fit px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white sm:bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-gray-900 sm:text-white text-[10px] sm:text-xs font-bold shadow-sm">
                                    {BLOG_POSTS[2].readTime}
                                </div>
                            </Link>
                        </motion.div>
                    </div>


                </div>
            </main>
        </div>
    );
}