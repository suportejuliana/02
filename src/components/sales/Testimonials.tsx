import { Star } from "lucide-react";
import feedbackImg1 from "@/assets/feedback-1.jpeg";
import feedbackImg2 from "@/assets/feedback-2.jpeg";
import feedbackImg3 from "@/assets/feedback-3.jpeg";
import feedbackImg4 from "@/assets/feedback-4.jpeg";

const feedbacks = [feedbackImg1, feedbackImg2, feedbackImg3, feedbackImg4];

const Testimonials = () => (
  <section className="bg-[#1a0a2e] py-10">
    <div className="container">
      <h2 className="text-xl font-extrabold text-white text-center mb-1">O que dizem nossas clientes</h2>
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-2xl font-black text-white">4.9/5</span>
        <div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-star text-star" />))}</div>
        <span className="text-xs text-gray-400">2.341+ clientes satisfeitas</span>
      </div>
      <div className="space-y-3">
        {feedbacks.map((img, i) => (
          <div key={i} className="rounded-xl overflow-hidden shadow-md">
            <img src={img} alt={`Depoimento ${i + 1}`} className="w-full h-auto" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
