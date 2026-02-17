import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function SimpleBackButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center gap-2 px-4 py-2 bg-[#7c7f70] text-white rounded-full hover:bg-[#6a6d5f] transition-all duration-300 group mb-8"
        >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
        </button>
    );
}
