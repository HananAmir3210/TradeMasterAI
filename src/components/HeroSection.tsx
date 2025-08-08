
import React from 'react';
import { ArrowRight, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
<<<<<<< HEAD
    <section className="relative h-screen flex items-center justify-center pt-8 px-4 overflow-hidden">
      <div className="max-w-8xl mx-auto container-padding text-center flex flex-col justify-center h-full">
        <div className="animate-fade-in space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-5 py-2 rounded-full glass-effect text-white/70 text-xs font-normal tracking-wide">
            <TrendingUp className="w-4 h-4 mr-2 text-white/50" />
=======
    <section className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full text-center flex flex-col justify-center min-h-screen py-8 sm:py-12">
        <div className="animate-fade-in space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-3 sm:px-5 py-2 rounded-full glass-effect text-white/70 text-xs sm:text-sm font-normal tracking-wide">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-white/50" />
>>>>>>> 74acc0a (Initial commit of my project)
            Now Available
          </div>

          {/* Main Headline */}
<<<<<<< HEAD
          <div className="space-y-6">
            <h1 className="headline-text text-3xl md:text-5xl lg:text-6xl leading-tight">
=======
          <div className="space-y-4 sm:space-y-6">
            <h1 className="headline-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight px-4">
>>>>>>> 74acc0a (Initial commit of my project)
              <span className="text-white">AI-Powered</span>
              <br />
              <span className="gradient-text">Trading Intelligence</span>
            </h1>
            {/* Subheadline */}
<<<<<<< HEAD
            <p className="subheadline-text max-w-2xl mx-auto text-base md:text-lg">
=======
            <p className="subheadline-text max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
>>>>>>> 74acc0a (Initial commit of my project)
              Advanced analytics and machine learning transform your trading decisions. 
              Professional-grade insights for the modern trader.
            </p>
          </div>

          {/* CTA Buttons */}
<<<<<<< HEAD
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/dashboard'}
              className="professional-button text-base px-8 py-3 group rounded-full"
=======
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/dashboard'}
              className="professional-button text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3 group rounded-full w-full sm:w-auto"
>>>>>>> 74acc0a (Initial commit of my project)
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
<<<<<<< HEAD
              className="accent-button text-base px-8 py-3 rounded-full transition-all duration-300"
=======
              className="accent-button text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3 rounded-full transition-all duration-300 w-full sm:w-auto"
>>>>>>> 74acc0a (Initial commit of my project)
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
<<<<<<< HEAD
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-6">
            <div className="flex flex-col items-center gap-2">
              <BarChart3 className="w-5 h-5 text-white/40" />
              <div className="text-center">
                <div className="text-2xl font-semibold text-white tracking-tight">95%</div>
                <div className="text-xs text-white/50 font-normal">Accuracy Rate</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TrendingUp className="w-5 h-5 text-white/40" />
              <div className="text-center">
                <div className="text-2xl font-semibold text-white tracking-tight">10K+</div>
                <div className="text-xs text-white/50 font-normal">Trades Analyzed</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <span className="text-white/40 font-normal text-base">★</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-white tracking-tight">500+</div>
                <div className="text-xs text-white/50 font-normal">Active Users</div>
=======
          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-xs sm:max-w-2xl mx-auto pt-6 px-4">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-white tracking-tight">95%</div>
                <div className="text-xs text-white/50 font-normal leading-tight">Accuracy Rate</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-white tracking-tight">10K+</div>
                <div className="text-xs text-white/50 font-normal leading-tight">Trades Analyzed</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                <span className="text-white/40 font-normal text-sm sm:text-base">★</span>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-white tracking-tight">500+</div>
                <div className="text-xs text-white/50 font-normal leading-tight">Active Users</div>
>>>>>>> 74acc0a (Initial commit of my project)
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Minimal scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 floating-element">
        <div className="w-px h-10 bg-white/20 rounded-full flex justify-center">
          <div className="w-px h-4 bg-white/40 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


