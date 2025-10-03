import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Edit3, Send } from "lucide-react";

// Main App Component
function App() {
  return <EntrepreneurFinancialSurvey />;
}

// Survey Component for Self-Employed 18-30 Age Group
const EntrepreneurFinancialSurvey = ({ onComplete }) => {
  // State to hold the answers and submission status
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // The list of questions for the survey
  const questions = [
    {
      qid: "q1",
      question: "Is your income stable or fluctuating?",
      options: ["Very stable, predictable", "Mostly stable with some fluctuations", "Fluctuates significantly month-to-month", "Highly unpredictable / seasonal"],
    },
    {
      qid: "q2",
      question: "How do you manage low-income months?",
      options: ["Use business savings/reserves", "Use personal savings", "Reduce expenses drastically", "I don't have a reliable plan for this"],
    },
    {
      qid: "q3",
      question: "Do you keep personal and business accounts separate?",
      options: ["Yes, completely separate", "Mostly separate, with some overlap", "No, they are mixed", "I'm in the process of separating them"],
    },
    {
      qid: "q4",
      question: "What % of profits do you save personally?",
      options: ["Less than 10%", "10% - 25%", "25% - 50%", "More than 50%"],
    },
    {
      qid: "q5",
      question: "Do you track cash flow daily, weekly, or monthly?",
      options: ["Daily", "Weekly", "Monthly", "Irregularly / When I can"],
    },
    {
      qid: "q6",
      question: "Do you invest business profits?",
      options: ["Yes, back into the business", "Yes, in external investments", "A mix of both", "No, I withdraw all profits"],
    },
    {
      qid: "q7",
      question: "Do you use accounting software or manual methods?",
      options: ["Accounting software (e.g., Tally, Zoho)", "Spreadsheets (Excel, Google Sheets)", "Manual bookkeeping (notebooks)", "I don't use a formal system"],
    },
    {
      qid: "q8",
      question: "Are you budgeting for growth (ads, hiring)?",
      options: ["Yes, I have a dedicated growth budget", "I spend on growth when I can afford it", "Not yet, but I'm planning to", "No, I'm focused on stability now"],
    },
    {
      qid: "q9",
      question: "How do you decide prices for your services/products?",
      options: ["Based on cost + markup", "Based on market/competitor rates", "Based on value provided to the client", "It's mostly intuitive / guesswork"],
    },
    {
      qid: "q10",
      question: "Have you made financial mistakes in business?",
      options: ["Yes, and I learned a lot", "A few small ones", "Not yet, I've been careful", "I'm worried I might be making them now"],
    },
    {
      qid: "q11",
      question: "Do you set monthly/quarterly financial goals?",
      options: ["Yes, strict revenue/profit targets", "Yes, flexible goals", "I have yearly goals, not shorter-term", "No, I don't set formal financial goals"],
    },
    {
      qid: "q12",
      question: "Would you like AI to suggest profit withdrawal timing?",
      options: ["Yes, that would be very useful", "Maybe, I'd like to see how it works", "No, I have my own system", "I'm not sure I'd trust it"],
    },
    {
      qid: "q13",
      question: "Do you want cash flow predictions from AI?",
      options: ["Yes, that would be a game-changer", "I'm curious to see its accuracy", "I prefer my own forecasting methods", "No, I don't need this"],
    },
    {
      qid: "q14",
      question: "Are you interested in AI competitor analysis tools?",
      options: ["Yes, for pricing and strategy", "Maybe, if it provides clear insights", "No, I prefer manual research", "I don't actively track competitors"],
    },
    {
      qid: "q15",
      question: "Do you prefer AI-guided financial decisions or full control?",
      options: ["I prefer full manual control", "AI guidance with my final say", "I'd automate routine decisions with AI", "I'm open to full AI automation"],
    },
    {
      qid: "q16",
      question: "Would you like combined business + personal advice?",
      options: ["Yes, an integrated view is essential", "I'd like to see both but keep them separate", "I only need business finance advice", "I only need personal finance advice"],
    },
    {
      qid: "q17",
      question: "Are you saving for retirement as a founder?",
      options: ["Yes, through SIPs or other investments", "I consider my business my retirement plan", "Not yet, but I know I should", "No, it's too early to think about that"],
    },
    {
      qid: "q18",
      question: "Do you want help setting aside taxes automatically?",
      options: ["Yes, please! That would be a huge help", "I'd like a tool to calculate it for me", "I have an accountant who handles it", "I can manage it myself"],
    },
    {
      qid: "q19",
      question: "Do you reinvest 100% of profits or save some outside the business?",
      options: ["I reinvest almost everything", "I save a portion outside the business", "I withdraw most profits for personal use", "It varies greatly depending on the month"],
    },
    {
      qid: "q20",
      question: "Would you like AI reminders for financial health check-ins?",
      options: ["Yes, a weekly/monthly nudge would be great", "Maybe a quarterly reminder", "No, I have my own schedule", "No, I would find it distracting"],
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
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-800">Young Entrepreneur Financial Survey</h1>
          <p className="text-md text-gray-600 mt-2">Help us understand your business's financial health.</p>
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

export default EntrepreneurFinancialSurvey;
