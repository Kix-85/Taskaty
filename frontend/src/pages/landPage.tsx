import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Star, Users, MessageSquare } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,#646cff_1px,transparent_1px)] bg-[length:24px_24px]" />
        </div>

        {/* Main Content */}
        <div className="container relative z-10 px-6 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-7xl md:text-8xl font-bold mb-6 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  TASKATY
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Take control of your tasks. Empower your productivity.
                <br />
                Plan smarter, collaborate easier, get more done.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <Button asChild size="lg" className="text-base px-8 py-6 rounded-full">
                  <Link to="/auth">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base px-8 py-6 rounded-full">
                  <Link to="/auth">Log In</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Taskaty?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our simple yet powerful features help you manage tasks efficiently
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard 
              icon={<Star className="h-8 w-8 mb-4 text-primary" />}
              title="Smart Task Management"
              description="Organize your tasks with our intuitive, drag-and-drop interface"
              delay={0}
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 mb-4 text-primary" />}
              title="Team Collaboration"
              description="Work together seamlessly with your team in real-time"
              delay={0.2}
            />
            <FeatureCard 
              icon={<MessageSquare className="h-8 w-8 mb-4 text-primary" />}
              title="Progress Tracking"
              description="Monitor your progress with visual charts and stay on top of goals"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div>
              <h4 className="text-lg font-semibold mb-4">About Taskaty</h4>
              <p className="text-muted-foreground">
                A modern task management system designed to help you achieve more every day.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p className="text-muted-foreground">
                Need help? Reach out at{" "}
                <a href="mailto:support@taskaty.com" className="text-primary hover:underline">
                  support@taskaty.com
                </a>
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Taskaty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay = 0 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay?: number;
}) => {
  return (
    <motion.div
  initial={{ opacity: 0, y: 40, scale: 0.95 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  whileHover={{ scale: 1.1 }}
  transition={{ duration: 0.5, ease: "easeOut", delay }}
  viewport={{ once: true, amount: 0.3 }}
  className="p-8 rounded-xl bg-background border shadow-sm 
             hover:bg-blue-100 dark:hover:bg-blue-900 
             transition-colors duration-300 
             flex flex-col items-center text-center"
>
  {icon}
  <h3 className="text-xl font-semibold mb-3">{title}</h3>
  <p className="text-muted-foreground">{description}</p>
  <div className="mt-6">
    <ul className="space-y-2">
      <li className="flex items-center gap-2">
        <Check className="h-4 w-4 text-primary" />
        <span className="text-sm">Easy to use</span>
      </li>
      <li className="flex items-center gap-2">
        <Check className="h-4 w-4 text-primary" />
        <span className="text-sm">Fast and reliable</span>
      </li>
    </ul>
  </div>
</motion.div>

  );
};




export default LandingPage;