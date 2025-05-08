import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Award, MessageSquare, ArrowRight, Calendar, Video, Star } from 'lucide-react';

const Home = () => {
  // Mock data for featured debates
  const featuredDebates = [
    {
      id: 1,
      title: "The Future of Renewable Energy",
      description: "Is renewable energy the solution to our climate crisis?",
      participants: 6,
      date: "June 15, 2025",
      image: "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      category: "Environment"
    },
    {
      id: 2,
      title: "Artificial Intelligence Ethics",
      description: "Will AI development help or harm humanity in the long run?",
      participants: 4,
      date: "June 18, 2025",
      image: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      category: "Technology"
    },
    {
      id: 3,
      title: "Education Reform Debate",
      description: "How should we reshape education for the modern world?",
      participants: 8,
      date: "June 20, 2025",
      image: "https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      category: "Education"
    }
  ];
  
  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                Welcome to DebateHub
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                The Platform for <span className="text-accent">Interactive Debates</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-xl">
                Join structured debates, share your perspective, and engage with
                a community of critical thinkers on today's most important topics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/register" className="btn bg-white text-primary hover:bg-white/90 font-medium px-6 py-3">
                  Get Started
                </Link>
                <Link to="/debates" className="btn bg-transparent border border-white text-white hover:bg-white/10 font-medium px-6 py-3">
                  Explore Debates
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl z-0"></div>
              <div className="relative z-10 bg-white/10 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                <img
                  src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="People engaged in debate"
                  className="w-full h-auto rounded-xl"
                />
                <div className="absolute -bottom-5 -right-5 bg-accent text-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <Video size={20} />
                    <span className="font-medium">Live Debates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">200+</div>
              <p className="text-neutral-600 mt-2">Debates Hosted</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">5,000+</div>
              <p className="text-neutral-600 mt-2">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">50+</div>
              <p className="text-neutral-600 mt-2">Topics Covered</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">98%</div>
              <p className="text-neutral-600 mt-2">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800">
              Why Choose DebateHub?
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Our platform offers everything you need for engaging and insightful debates
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-6 hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Virtual Debate Rooms
              </h3>
              <p className="text-neutral-600">
                High-quality video conferencing specifically designed for structured debates
                with moderator controls and audience participation.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card p-6 hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Multiple User Roles
              </h3>
              <p className="text-neutral-600">
                Take part as a moderator, participant, or audience member with
                role-specific features and permissions.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card p-6 hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Real-time Interaction
              </h3>
              <p className="text-neutral-600">
                Live chat, reactions, and voting features keep everyone engaged
                throughout the entire debate.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="card p-6 hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Feedback & Reviews
              </h3>
              <p className="text-neutral-600">
                Comprehensive review system for debates, moderators, and participants
                to improve future discussions.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="card p-6 hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-info" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Scheduled Events
              </h3>
              <p className="text-neutral-600">
                Plan and schedule debates in advance with automated notifications
                and calendar integration.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="card p-6 hover:translate-y-[-5px]">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Personalized Recommendations
              </h3>
              <p className="text-neutral-600">
                Receive debate suggestions based on your interests and past participation
                to discover new topics.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Debates */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-neutral-800">
              Featured Debates
            </h2>
            <Link
              to="/debates"
              className="flex items-center text-primary font-medium hover:underline"
            >
              View All
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDebates.map((debate) => (
              <Link to={`/debates/${debate.id}`} key={debate.id} className="card overflow-hidden h-full hover:shadow-xl">
                <div className="relative h-48">
                  <img
                    src={debate.image}
                    alt={debate.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="badge badge-primary px-3 py-1 text-xs font-medium">
                      {debate.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2 text-neutral-800">
                    {debate.title}
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    {debate.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-neutral-500">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {debate.date}
                    </div>
                    <div className="flex items-center">
                      <Users size={16} className="mr-1" />
                      {debate.participants} participants
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join the Conversation?
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Create an account today and start participating in debates on topics that matter to you.
            Share your perspective and learn from others.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn bg-white text-primary hover:bg-white/90 font-medium px-8 py-3">
              Sign Up Now
            </Link>
            <Link to="/debates" className="btn bg-transparent border border-white text-white hover:bg-white/10 font-medium px-8 py-3">
              Browse Debates
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-800 text-center mb-12">
            What Our Users Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-neutral-500">Debate Moderator</p>
                </div>
              </div>
              <p className="text-neutral-600">
                "DebateHub has transformed how I facilitate discussions. The moderator tools are fantastic, and the audience engagement features keep everyone involved."
              </p>
              <div className="mt-4 flex text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xl">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-sm text-neutral-500">Debate Participant</p>
                </div>
              </div>
              <p className="text-neutral-600">
                "As someone who loves a good argument, this platform is exactly what I needed. The video quality is excellent and the structured format helps keep debates civil."
              </p>
              <div className="mt-4 flex text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} />
                ))}
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xl">
                  J
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Jamie Rivera</h4>
                  <p className="text-sm text-neutral-500">Audience Member</p>
                </div>
              </div>
              <p className="text-neutral-600">
                "I've learned so much by watching debates on DebateHub. The ability to vote and ask questions in real-time makes me feel like I'm part of the conversation."
              </p>
              <div className="mt-4 flex text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;