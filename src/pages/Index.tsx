import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Network, Zap, Shield, Sparkles, BarChart3, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <header className="container mx-auto px-4 pt-20 pb-32">
        <nav className="flex justify-between items-center mb-16 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Network className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Visualize Your Project Dependencies</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Powerful Task
            </span>
            <br />
            <span className="text-foreground">Dependency Visualizer</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Manage complex projects with ease. Visualize dependencies, identify critical paths, 
            and keep your team aligned with beautiful interactive graphs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-primary hover:opacity-90 transition-all shadow-lg hover:shadow-xl group"
              onClick={() => navigate('/visualizer')}
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2"
              onClick={() => navigate('/visualizer')}
            >
              View Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="container mx-auto px-4 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground text-lg">Powerful features to manage your projects efficiently</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Network className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Dependency Graphs</h3>
            <p className="text-muted-foreground leading-relaxed">
              Visualize task relationships with interactive dependency graphs. 
              Instantly see how tasks connect and impact each other.
            </p>
          </Card>

          <Card className="p-8 border-2 hover:border-secondary/50 transition-all hover:shadow-lg group">
            <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Critical Path Detection</h3>
            <p className="text-muted-foreground leading-relaxed">
              Automatically identify critical paths in your projects. 
              Focus on what matters most to keep deadlines on track.
            </p>
          </Card>

          <Card className="p-8 border-2 hover:border-accent/50 transition-all hover:shadow-lg group">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Timeline Views</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track task timelines with flexible zoom levels. 
              View your project by days, weeks, or months.
            </p>
          </Card>

          <Card className="p-8 border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
            <p className="text-muted-foreground leading-relaxed">
              Changes reflect instantly across all views. 
              Keep your team synchronized with live data updates.
            </p>
          </Card>

          <Card className="p-8 border-2 hover:border-secondary/50 transition-all hover:shadow-lg group">
            <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Priority Management</h3>
            <p className="text-muted-foreground leading-relaxed">
              Set priorities and track status for every task. 
              Never lose sight of what needs attention first.
            </p>
          </Card>

          <Card className="p-8 border-2 hover:border-accent/50 transition-all hover:shadow-lg group">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Export & Import</h3>
            <p className="text-muted-foreground leading-relaxed">
              Export your projects as JSON or images. 
              Import templates to get started quickly.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-32">
        <Card className="max-w-4xl mx-auto p-12 text-center bg-gradient-primary border-0 text-primary-foreground">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">
            Start visualizing your project dependencies today. No sign-up required.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6"
            onClick={() => navigate('/visualizer')}
          >
            Launch Visualizer
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 TaskFlow - Task Dependency Visualizer</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
