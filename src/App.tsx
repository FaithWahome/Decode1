import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft,
  Smartphone,
  Zap,
  MessageSquare,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { analyzeCreditworthiness } from './services/gemini';

// --- Types ---
interface CreditResult {
  score: number;
  rating: string;
  summary: string;
  keyFactors: { factor: string; impact: 'positive' | 'negative'; description: string }[];
  recommendations: string[];
}

// --- Mock Data Generators ---
const mockMPesaData = [
  { date: '2024-03-25', type: 'Received', amount: 12500, from: 'Customer A' },
  { date: '2024-03-24', type: 'Sent', amount: 2000, to: 'KPLC Prepaid' },
  { date: '2024-03-22', type: 'Received', amount: 5000, from: 'Customer B' },
  { date: '2024-03-20', type: 'Sent', amount: 1500, to: 'Zuku Fiber' },
  { date: '2024-03-18', type: 'Received', amount: 8000, from: 'Customer C' },
];

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analyze' | 'history'>('dashboard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CreditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = {
        mpesa_summary: "Average monthly inflow: 45k, Outflow: 30k. Frequent utility payments.",
        utility_status: "No defaults in 12 months.",
        sms_records: "Consistent business inquiries and order confirmations."
      };
      const analysis = await analyzeCreditworthiness(data);
      setResult(analysis);
      setActiveTab('dashboard');
    } catch (err) {
      setError("Something went wrong with the analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-paypal-blue rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {onboardingStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-6"
              >
                <h1 className="text-3xl font-bold text-gray-900">Welcome to JIKAZE</h1>
                <p className="text-gray-600 leading-relaxed">
                  The smart way to build your credit score using your everyday M-Pesa and utility patterns. No collateral needed.
                </p>
                <button
                  onClick={() => setOnboardingStep(1)}
                  className="w-full py-4 bg-paypal-blue text-white rounded-full font-bold hover:bg-blue-900 transition-all shadow-md"
                >
                  Get Started
                </button>
              </motion.div>
            )}

            {onboardingStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 text-center">How it Works</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                    <Smartphone className="text-paypal-blue shrink-0 mt-1" />
                    <div>
                      <p className="font-bold">Connect Data</p>
                      <p className="text-sm text-gray-500">Securely link your M-Pesa and utility accounts.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                    <TrendingUp className="text-green-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-bold">AI Analysis</p>
                      <p className="text-sm text-gray-500">Our AI looks for patterns of reliability in your spending.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                    <ShieldCheck className="text-orange-500 shrink-0 mt-1" />
                    <div>
                      <p className="font-bold">Unlock Credit</p>
                      <p className="text-sm text-gray-500">Get access to better loans and business capital.</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOnboardingStep(2)}
                  className="w-full py-4 bg-paypal-blue text-white rounded-full font-bold hover:bg-blue-900 transition-all shadow-md"
                >
                  Continue
                </button>
              </motion.div>
            )}

            {onboardingStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Ready to Go!</h2>
                <p className="text-gray-600">
                  Your accounts are ready to be analyzed. We'll look at your patterns and build your score in seconds.
                </p>
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="w-full py-4 bg-paypal-blue text-white rounded-full font-bold hover:bg-blue-900 transition-all shadow-md"
                >
                  Go to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  onboardingStep === i ? "w-8 bg-paypal-blue" : "w-1.5 bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-paypal-gray">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-paypal-blue rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-paypal-blue tracking-tight">JIKAZE</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={cn("text-sm font-semibold transition-colors", activeTab === 'dashboard' ? "text-paypal-blue underline underline-offset-8 decoration-2" : "text-gray-500 hover:text-paypal-blue")}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('analyze')}
                className={cn("text-sm font-semibold transition-colors", activeTab === 'analyze' ? "text-paypal-blue underline underline-offset-8 decoration-2" : "text-gray-500 hover:text-paypal-blue")}
              >
                Get Scored
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold text-paypal-blue border border-paypal-blue px-4 py-1.5 rounded-full hover:bg-blue-50 transition-colors">
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Hero Section */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900">Habari, Abigael!</h1>
                  <p className="text-gray-600 max-w-md">
                    Your credit health is looking {result ? result.rating.toLowerCase() : 'ready for analysis'}. Use JIKAZE to unlock better loans and business opportunities.
                  </p>
                  {!result && (
                    <button 
                      onClick={() => setActiveTab('analyze')}
                      className="bg-paypal-light-blue text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition-all shadow-md active:scale-95"
                    >
                      Check My Credit Score
                    </button>
                  )}
                </div>
                
                {result ? (
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-gray-100"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={502.6}
                        strokeDashoffset={502.6 - (502.6 * result.score) / 1000}
                        className={cn(
                          "transition-all duration-1000 ease-out",
                          result.score > 700 ? "text-green-500" : result.score > 400 ? "text-yellow-500" : "text-red-500"
                        )}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-gray-900">{result.score}</span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{result.rating}</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-gray-50 rounded-full border-4 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                    <TrendingUp className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-paypal-blue">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-700">M-Pesa Activity</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Monthly Inflow</span>
                      <span className="font-bold text-green-600">KES 45,200</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-[75%]" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-700">Utility Bills</h3>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Paid on time (12/12)</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-700">Business Records</h3>
                  </div>
                  <p className="text-sm text-gray-500">32 business-related SMS patterns detected this month.</p>
                </div>
              </div>

              {/* Analysis Details */}
              {result && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">AI Insights</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl text-paypal-blue text-sm leading-relaxed italic">
                      "{result.summary}"
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Key Factors</h3>
                        {result.keyFactors.map((f, i) => (
                          <div key={i} className="flex gap-3">
                            {f.impact === 'positive' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            )}
                            <div>
                              <p className="text-sm font-bold text-gray-800">{f.factor}</p>
                              <p className="text-xs text-gray-500">{f.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Recommendations</h3>
                        <ul className="space-y-2">
                          {result.recommendations.map((r, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-paypal-light-blue mt-1.5 shrink-0" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                  <button className="text-sm font-bold text-paypal-blue hover:underline">View All</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {mockMPesaData.map((tx, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          tx.type === 'Received' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        )}>
                          {tx.type === 'Received' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{tx.from || tx.to}</p>
                          <p className="text-xs text-gray-500">{tx.date}</p>
                        </div>
                      </div>
                      <p className={cn("font-bold", tx.type === 'Received' ? "text-green-600" : "text-gray-900")}>
                        {tx.type === 'Received' ? '+' : '-'} KES {tx.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analyze' && (
            <motion.div 
              key="analyze"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto space-y-8 py-12"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-10 h-10 text-paypal-blue" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Unlock Your Credit Potential</h2>
                <p className="text-gray-600">
                  We use AI to look at your M-Pesa patterns and utility payments. This doesn't affect your CRB score—it only helps you get better terms.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-4">
                      <Smartphone className="text-paypal-blue" />
                      <div>
                        <p className="font-bold">M-Pesa Statements</p>
                        <p className="text-xs text-gray-500">Last 6 months of transactions</p>
                      </div>
                    </div>
                    <div className="text-green-600 flex items-center gap-1 text-sm font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Linked
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-4">
                      <Zap className="text-orange-500" />
                      <div>
                        <p className="font-bold">Utility Records</p>
                        <p className="text-xs text-gray-500">KPLC, Water, Internet</p>
                      </div>
                    </div>
                    <div className="text-green-600 flex items-center gap-1 text-sm font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Linked
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-4">
                      <MessageSquare className="text-purple-500" />
                      <div>
                        <p className="font-bold">Business SMS Logs</p>
                        <p className="text-xs text-gray-500">Order confirmations & inquiries</p>
                      </div>
                    </div>
                    <div className="text-green-600 flex items-center gap-1 text-sm font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Linked
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className={cn(
                    "w-full py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg",
                    isAnalyzing ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-paypal-blue text-white hover:bg-blue-900 active:scale-95"
                  )}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      AI is analyzing your data...
                    </>
                  ) : (
                    "Generate AI Credit Score"
                  )}
                </button>
                
                {error && (
                  <p className="text-red-500 text-sm text-center font-medium">{error}</p>
                )}
              </div>

              <p className="text-center text-xs text-gray-400 px-12">
                By clicking "Generate", you agree to let JIKAZE AI analyze your simulated transaction patterns. We value your privacy and never share your data with third parties.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-bold text-sm">JIKAZE SECURE</span>
          </div>
          <div className="flex gap-6 text-sm font-semibold text-gray-500">
            <a href="#" className="hover:text-paypal-blue">Help</a>
            <a href="#" className="hover:text-paypal-blue">Privacy</a>
            <a href="#" className="hover:text-paypal-blue">Terms</a>
          </div>
          <p className="text-xs text-gray-400">© 2024 JIKAZE AI. Empowering the common mwananchi.</p>
        </div>
      </footer>
    </div>
  );
}
