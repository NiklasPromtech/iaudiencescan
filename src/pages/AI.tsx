import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AI = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            AI
          </h1>
          <p className="text-white/60 text-center max-w-2xl mx-auto">
            Page content coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AI;
