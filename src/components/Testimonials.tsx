import { Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  stat?: string;
  statLabel?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "We stopped guessing where our users came from. AudienceScan showed us exactly which communities to target.",
    name: "Marcus Chen",
    role: "Marketing Lead",
    company: "DeFi Protocol",
    initials: "MC",
    stat: "3x",
    statLabel: "ROI improvement",
  },
  {
    quote: "The overlap data is incredible. We found 12 untapped communities in our first scan that we'd never considered.",
    name: "Sarah Williams",
    role: "Growth Director",
    company: "NFT Marketplace",
    initials: "SW",
    stat: "12",
    statLabel: "New communities",
  },
  {
    quote: "Every pitch deck now includes AudienceScan data. Clients love seeing the on-chain proof behind our strategy.",
    name: "David Park",
    role: "Agency Partner",
    company: "Web3 Marketing Agency",
    initials: "DP",
    stat: "50%",
    statLabel: "Higher close rate",
  },
];

interface TestimonialsProps {
  className?: string;
}

const Testimonials = ({ className = "" }: TestimonialsProps) => {
  return (
    <div className={`py-16 px-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Trusted by Web3 growth teams
          </h2>
          <p className="text-white/50 text-base">
            See why leading agencies and projects choose AudienceScan
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-white/[0.04] rounded-xl p-6 border border-white/[0.08] hover:border-purple-500/30 transition-all duration-300 group"
            >
              {/* Quote icon */}
              <Quote className="w-6 h-6 text-purple-500/40 mb-4" />

              {/* Quote */}
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Stat badge (if present) */}
              {testimonial.stat && (
                <div className="mb-6 inline-flex items-center gap-2 bg-purple-500/10 rounded-lg px-3 py-2 border border-purple-500/20">
                  <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {testimonial.stat}
                  </span>
                  <span className="text-xs text-white/50">
                    {testimonial.statLabel}
                  </span>
                </div>
              )}

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/50 to-pink-500/50 flex items-center justify-center text-sm font-semibold text-white">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-white/40 text-xs">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>

              {/* Subtle hover glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
