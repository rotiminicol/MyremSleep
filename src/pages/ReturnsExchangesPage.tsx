import { useState } from 'react';
import { Plus } from 'lucide-react';
import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreFooter } from '@/components/store/StoreFooter';

const returnPolicies = [
    {
        title: "1. What is your returns policy?",
        content: "If you change your mind, you can return your order within 30 days of purchase. We offer a refund, exchange, or store gift card, provided items are unused, unwashed, and returned in their original packaging."
    },
    {
        title: "2. How to return (UK)",
        content: "Use our online returns portal to register your return, pay the return fee, and select either a refund to your original payment method or store credit (issued as a digital gift card). Drop your parcel at your chosen local drop-off point.\n\nOnce your return arrives with us, we process refunds within 5 working days. If you choose store credit, your digital gift card will be emailed to you."
    },
    {
        title: "3. Exchanges (UK)",
        content: "For exchanges, email our Customer Care team with your request and order details, and we will help arrange it: Hello@myremsleep.com\n\nYour exchange will be processed once your return has been received."
    },
    {
        title: "4. Returns Policy – EU & Rest of World",
        content: "You can return your order within 30 days of delivery for a refund, exchange, or store credit, as long as items are unused, unwashed, and in their original packaging.\n\nPlease note: You will need to arrange with your local courier to return the package."
    }
];

function PolicyItem({ title, content }: { title: string; content: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-300">
            <button
                className="w-full flex justify-between items-center text-left py-6 group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-sm font-medium text-gray-800 tracking-wide pr-4 uppercase">{title}</h3>
                <Plus
                    className={`h-5 w-5 text-gray-600 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] pb-6' : 'max-h-0'
                    }`}
            >
                <p className="text-gray-600 leading-relaxed pr-8 whitespace-pre-line">{content}</p>
            </div>
        </div>
    );
}

export default function ReturnsExchangesPage() {
    return (
        <div className="min-h-screen bg-[#F2EDE8]">
            <StoreNavbar />

            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
                <h1 className="text-5xl md:text-6xl font-serif mb-6 text-gray-900">
                    Returns & Exchanges
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    We want you to love your REMsleep bedding. If it's not quite right, here is how we can help with a return or exchange.
                </p>
            </div>

            {/* Policies Section */}
            <div className="max-w-6xl mx-auto px-6 pb-24">
                <div className="bg-white rounded-sm shadow-sm">
                    <div className="px-8 md:px-20 py-2">
                        {returnPolicies.map((policy, index) => (
                            <PolicyItem key={index} title={policy.title} content={policy.content} />
                        ))}
                    </div>
                </div>
            </div>

            <StoreFooter />
        </div>
    );
}
