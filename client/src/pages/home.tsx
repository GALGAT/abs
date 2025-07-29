import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Brain, BarChart3, Shield, Clock, Handshake, Search, Send, Calendar, TrendingUp } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Brain,
      title: "AI Resume Tailoring",
      description: "Automatically optimizes your resume for each job application using advanced NLP and keyword matching.",
      gradient: "from-blue-50 to-indigo-100",
      iconBg: "bg-blue-600"
    },
    {
      icon: Bot,
      title: "Automated Applications",
      description: "Apply to hundreds of jobs daily with intelligent form filling and application submission.",
      gradient: "from-emerald-50 to-teal-100",
      iconBg: "bg-emerald-600"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track application success rates, optimize your strategy, and improve your chances of getting hired.",
      gradient: "from-purple-50 to-pink-100",
      iconBg: "bg-purple-600"
    },
    {
      icon: Shield,
      title: "ATS Optimization",
      description: "Ensure your applications pass through Applicant Tracking Systems with 95% compatibility rate.",
      gradient: "from-amber-50 to-orange-100",
      iconBg: "bg-amber-600"
    },
    {
      icon: Clock,
      title: "24/7 Job Hunting",
      description: "Our AI works around the clock, finding and applying to new opportunities while you sleep.",
      gradient: "from-red-50 to-pink-100",
      iconBg: "bg-red-600"
    },
    {
      icon: Handshake,
      title: "Interview Preparation",
      description: "Get AI-powered interview practice sessions and personalized feedback to ace your interviews.",
      gradient: "from-teal-50 to-cyan-100",
      iconBg: "bg-teal-600"
    }
  ];

  const stats = [
    { number: "300K+", label: "Companies Integrated", icon: Search },
    { number: "95%", label: "ATS Compatibility", icon: Shield },
    { number: "24/7", label: "Automated Applications", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-slate-800">JobPilot AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-800 transition-colors">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-800 transition-colors">Pricing</a>
              <a href="#" className="text-slate-600 hover:text-slate-800 transition-colors">Sign In</a>
              <Button 
                onClick={() => setLocation("/onboarding")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="md:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
              Automate Your Job Search with{" "}
              <span className="text-blue-600">AI-Powered</span> Precision
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Apply to 100+ jobs daily with intelligent resume tailoring, keyword optimization, and automated applications. Let AI handle the tedious work while you focus on interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => setLocation("/onboarding")}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-slate-300 text-slate-700 hover:border-slate-400 text-lg px-8 py-4"
              >
                Watch Demo
              </Button>
            </div>
            
            {/* Stats Cards */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white shadow-sm">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                    <div className="text-slate-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Powered by Advanced AI Technology
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI analyzes job descriptions, optimizes your applications, and handles the entire process while you focus on what matters most.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`bg-gradient-to-br ${feature.gradient} p-8 rounded-2xl`}>
                <div className={`${feature.iconBg} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Join thousands of professionals who have automated their way to better career opportunities.
          </p>
          <Button 
            size="lg"
            onClick={() => setLocation("/onboarding")}
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
          >
            Start Your AI Job Hunt Today
          </Button>
        </div>
      </section>
    </div>
  );
}
