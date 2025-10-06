import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Edit3, Send, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Main App Component
function App() {
  return <SalariedFinancialSurvey />;
}

// Survey Component for Salaried 18-30 Age Group
const SalariedFinancialSurvey = ({ onComplete }) => {
  // State to hold the answers and submission status
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  // The list of questions for the survey
  const questions = [
    {
      qid: "q1",
      question: "What is your monthly take-home salary?",
      options: ["Less than ₹30,000", "₹30,000 - ₹60,000", "₹60,000 - ₹1,00,000", "More than ₹1,00,000"],
    },
    {
      qid: "q2",
      question: "Do you get bonuses or incentives?",
      options: ["Yes, an annual bonus", "Yes, performance-based incentives", "Occasionally, but not guaranteed", "No, I have a fixed salary"],
    },
    {
      qid: "q3",
      question: "Are you investing in stocks, SIPs, crypto?",
      options: ["Yes, in a mix of these", "Only in SIPs / Mutual Funds", "Only in Stocks / Crypto", "No, I haven't started investing yet"],
    },
    {
      qid: "q4",
      question: "Are you saving for a specific goal?",
      options: ["Yes, a long-term goal (house, retirement)", "Yes, a short-term goal (vacation, car)", "I'm saving, but without a specific goal", "I'm currently not able to save"],
    },
    {
      qid: "q5",
      question: "Do you have any active EMIs?",
      options: ["Yes, for a home or car loan", "Yes, for gadgets or personal loan", "Yes, multiple EMIs", "No, I am currently EMI-free"],
    },
    {
      qid: "q6",
      question: "How do you handle market downturns?",
      options: ["I invest more (buy the dip)", "I hold and wait for recovery", "I feel anxious but do nothing", "I tend to sell to cut losses"],
    },
    {
      qid: "q7",
      question: "Are you comfortable taking financial risks?",
      options: ["Yes, I'm an aggressive investor", "I take calculated, moderate risks", "I prefer safe, low-risk options", "I am completely risk-averse"],
    },
    {
      qid: "q8",
      question: "Do you track fixed vs variable expenses?",
      options: ["Yes, I use a budget for both", "I only track my major fixed expenses", "I have a general idea but don't track", "No, I don't track my expenses"],
    },
    {
      qid: "q9",
      question: "Are you interested in tax-saving options?",
      options: ["Very interested, I actively use them", "I'd like to learn more about them", "I know a little but find it complex", "It's not a priority for me now"],
    },
    {
      qid: "q10",
      question: "Do you have insurance (life/health)?",
      options: ["Yes, I have both life and health cover", "I only have health insurance", "I only have life insurance", "I don't have any insurance yet"],
    },
    {
      qid: "q11",
      question: "Are you financially supporting family members?",
      options: ["Yes, on a regular basis", "Yes, occasionally when needed", "Not directly, but I help with expenses", "No, I do not"],
    },
    {
      qid: "q12",
      question: "Do you review your financial plan regularly?",
      options: ["Yes, every few months", "Yes, once a year", "Rarely, only on major life changes", "I don't have a formal financial plan"],
    },
    {
      qid: "q13",
      question: "Do you use a financial advisor or DIY approach?",
      options: ["I'm fully DIY using online resources", "I consult with a professional advisor", "A mix of both DIY and advice", "I don't actively manage my finances"],
    },
    {
      qid: "q14",
      question: "Do you want help building a savings & investment plan?",
      options: ["Yes, I need a complete plan from scratch", "Yes, I'd like to review my current plan", "I can manage it on my own", "No, I'm not interested right now"],
    },
    {
      qid: "q15",
      question: "Are you worried about inflation reducing savings?",
      options: ["Yes, it's a major concern for me", "Somewhat concerned", "I'm aware of it but not worried", "No, I haven't thought about it"],
    },
    {
      qid: "q16",
      question: "Would you like real-time AI alerts for market changes?",
      options: ["Yes, for my specific investments", "Maybe for major market news only", "No, I prefer to check myself", "No, that would cause too much stress"],
    },
    {
      qid: "q17",
      question: "Are you motivated by long-term goals or short-term wins?",
      options: ["Long-term goals (e.g., retirement)", "Short-term wins (e.g., a vacation)", "A healthy balance of both", "I'm not very goal-oriented"],
    },
    {
      qid: "q18",
      question: "Would you trust AI to automate your savings/investing?",
      options: ["Yes, I'd fully automate it", "I'd use it with my final approval", "Maybe for savings, but not investing", "No, I prefer complete manual control"],
    },
    {
      qid: "q19",
      question: "How do you decide financial priorities monthly?",
      options: ["I follow a strict, pre-defined budget", "Based on upcoming bills and needs", "It's flexible, based on my goals", "I don't have a formal system"],
    },
    {
      qid: "q20",
      question: "Would you like AI to act like a strict coach or friendly advisor?",
      options: ["A strict coach to keep me disciplined", "A friendly advisor for suggestions", "A neutral data-provider", "I don't want an AI persona"],
    },
  ];

  // Handler for selecting an answer for a question
  const handleAnswerChange = (qid, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setIsSubmitted(true);
    console.log("Final Answers:", answers);
    
    // Call the onComplete callback with answers
    if (onComplete) {
      onComplete(answers);
    }
  };
  
  // Handler to edit the form again
  const handleEdit = () => {
    setIsSubmitted(false);
  }

  // Animation variants for each question
  const questionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen w-full bg-emerald-50 font-sans flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-800">Early Career Financial Survey (Salaried)</h1>
          <p className="text-md text-gray-600 mt-2">Help us understand your financial journey.</p>
        </header>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200"
        >
          {isSubmitted ? (
            // Submission Confirmation View
            <div className="p-10 text-center flex flex-col items-center">
              <CheckCircle className="w-24 h-24 text-emerald-500 mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Submission Received</h2>
              <p className="text-gray-600 mb-8 max-w-md">
                Thank you for completing the survey. Your responses have been successfully recorded.
              </p>
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                <Edit3 className="w-5 h-5" />
                Edit My Answers
              </button>
            </div>
          ) : (
            // Form View
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10">
              <div className="space-y-10">
                {questions.map((q, index) => (
                  <motion.div
                    key={q.qid}
                    variants={questionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <fieldset>
                      <legend className="block text-lg font-semibold text-gray-800 mb-4">
                        {index + 1}. {q.question}
                      </legend>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((option) => (
                          <motion.div whileTap={{ scale: 0.97 }} key={option}>
                            <label
                              className={`block w-full text-left p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                answers[q.qid] === option
                                  ? "bg-emerald-100 border-emerald-500 text-emerald-900 font-semibold ring-2 ring-emerald-400"
                                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
                              }`}
                            >
                              <input
                                type="radio"
                                name={q.qid}
                                value={option}
                                checked={answers[q.qid] === option}
                                onChange={() => handleAnswerChange(q.qid, option)}
                                className="sr-only" // Hide the actual radio button
                              />
                              {option}
                            </label>
                          </motion.div>
                        ))}
                      </div>
                    </fieldset>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20"
                >
                  <Send className="w-5 h-5" />
                  Submit Survey
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
        
        <p className="text-center text-gray-500 text-sm mt-8">
          Your privacy is important to us. All data is handled securely.
        </p>
      </div>
    </div>
  );
};

export default SalariedFinancialSurvey;
