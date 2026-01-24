import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';

const privacyPolicies = [
    {
        title: "1. Who we are (Data Controller)",
        content: `REMSleep LTD (United Kingdom) is the data controller for the personal information described in this notice.

Registered address: 71-75 Shelton Street
Covent Garden
London
WC2H 9JQ

Email: hello@myremsleep.com`
    },
    {
        title: "2. What we collect",
        content: `Depending on how you interact with us, we may collect:

• Contact details: your email address, and your name (if you provide it)
• Preferences you choose to share (for example, product interests)
• Email engagement data (for example, whether an email was opened or a link was clicked, where enabled)
• Order and delivery details (once the shop is live): delivery address, items purchased, and necessary contact information for fulfilment`
    },
    {
        title: "3. How we use your information",
        content: `We use personal information to:

• run the waiting list and send launch updates, early access information, and waiting list perks
• send newsletters or marketing messages only where you have opted in
• process and deliver orders (once the shop is live)
• protect our website, prevent fraud, and keep our systems secure
• understand and improve how our emails and website perform (where enabled)`
    },
    {
        title: "4. Lawful bases for processing",
        content: `We rely on the following lawful bases (as applicable):

• Consent (for waiting list / marketing emails)
• Performance of a contract (to process and deliver orders, once the shop is live)
• Legitimate interests (for website security, fraud prevention, and basic service improvement)
• Legal obligations (where we must keep certain records)`
    },
    {
        title: "5. Email marketing (Klaviyo) and unsubscribing",
        content: `If you opt in to receive REMsleep emails, we use Klaviyo to help us send and manage those emails. This means your email address (and name, if provided) is processed by Klaviyo on our behalf.

You can unsubscribe at any time by using the unsubscribe link in any email, or by contacting hello@myremsleep.com. If you unsubscribe, we may keep a minimal record of your request so we can respect your preferences going forward.`
    },
    {
        title: "6. Sharing your information",
        content: `We share personal information only where needed to operate the website, provide the waiting list, or fulfil orders. Typical recipients include:

Delivery and fulfilment partners (once live)
When your order is ready to ship, we share the details needed to deliver it (such as your name, delivery address, and contact details required by the carrier).

Payment providers (once live)
Payments are handled by payment service providers. We do not store your full card details.

Service providers
We may use carefully selected suppliers for hosting, analytics, customer support, and IT/security services. They are only permitted to process information on our instructions and must protect it appropriately.

Legal and regulatory disclosures
We may disclose information where required by law or where necessary to protect our rights, users, or business.`
    },
    {
        title: "7. International transfers",
        content: `Some of our suppliers may process personal information outside the UK/EEA. Where this happens, we use recognised safeguards designed to protect your information (for example, standard contractual clauses or other lawful transfer mechanisms), and we take additional steps where required.`
    },
    {
        title: "8. Retention",
        content: `We keep personal information only for as long as necessary for the purposes described above:

• Waiting list/marketing: until you unsubscribe or ask us to delete your information (subject to keeping a minimal suppression record)
• Orders (once live): for as long as needed to fulfil your order and comply with accounting/tax and other legal requirements`
    },
    {
        title: "9. Your rights",
        content: `Depending on your location, you may have rights to:

• access your information
• correct it
• request deletion
• restrict or object to certain processing
• data portability
• withdraw consent (where processing is based on consent)

To exercise your rights, email hello@myremsleep.com.`
    },
    {
        title: "10. Cookies",
        content: `We may use cookies and similar technologies to support core website functionality and, where enabled, to measure and improve performance. You can control cookies through your browser settings and (where available) through cookie preference tools on the site.`
    },
    {
        title: "11. Complaints",
        content: `If you have concerns, please contact us first at hello@myremsleep.com and we will try to resolve them.

If you are in the UK, you can also complain to the Information Commissioner’s Office (ICO).`
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

export default function PrivacyPage() {
    const [showContactForm, setShowContactForm] = useState(false);

    return (
        <div className="min-h-screen bg-[#f5f1ed]">
            {/* Header */}
            <header className="border-b border-gray-200 bg-[#f5f1ed]">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-center">
                        <a href="/" className="hover:opacity-80 transition-opacity">
                            <img
                                src="/logo5.png"
                                alt="REMsleep Logo"
                                className="h-12 w-auto"
                            />
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
                <h1 className="text-5xl md:text-6xl font-serif mb-6 text-gray-900">
                    Privacy Notice (Waiting List)
                </h1>
                <p className="text-gray-600 text-lg mb-2">
                    Last updated: 10th January, 2026.
                </p>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    REMsleep respects your privacy. This notice explains what personal information we collect when you join the REMsleep waiting list on myremsleep.com, how we use it, and the choices you have.
                </p>
            </div>

            {/* Policies Section */}
            <div className="max-w-6xl mx-auto px-6 pb-12">
                <div className="bg-white rounded-sm shadow-sm">
                    <div className="px-8 md:px-20 py-2">
                        {privacyPolicies.map((policy, index) => (
                            <PolicyItem key={index} title={policy.title} content={policy.content} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="max-w-6xl mx-auto px-6 pb-20">
                <div className="bg-white rounded-sm shadow-sm px-8 md:px-20 py-16 text-center">
                    <p className="text-sm tracking-widest text-gray-500 mb-4 uppercase">Have questions about our privacy policy?</p>
                    <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">
                        Get in Touch
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                        We're here to help. Contact our friendly customer service team for personal support.
                    </p>
                    <button
                        onClick={() => setShowContactForm(true)}
                        className="bg-[#e8e3dc] hover:bg-[#ddd8d1] text-gray-800 px-10 py-4 rounded-full text-sm tracking-widest uppercase transition-colors"
                    >
                        Contact Us
                    </button>
                    {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
                </div>
            </div>
        </div>
    );
}
