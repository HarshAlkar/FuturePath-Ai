import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Edit3, Send } from "lucide-react";

// Main App Component
function App() {
  return <EstablishedBusinessOwnerSurvey />;
}

// Survey Component for Established Business Owners (30-60)
const EstablishedBusinessOwnerSurvey = ({ onComplete }) => {
  // State to hold the answers and submission status
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // The list of questions for the survey
  const questions = [
    {
      qid: "q1",
      question: "Do you track personal vs business net worth?",
      options: ["Yes, both are tracked meticulously", "I track business net worth; personal is less formal", "I have a general idea but don't track formally", "No, I don't track net worth for either"],
    },
    {
      qid: "q2",
      question: "How are you planning for retirement?",
      options: ["Through business value and personal investments", "My business is my primary retirement plan", "Through real estate and other assets", "I haven't started formal retirement planning"],
    },
    {
      qid: "q3",
      question: "Are you diversifying beyond your main business?",
      options: ["Yes, I have significant investments elsewhere", "I'm starting to diversify into other assets", "No, all capital is in my primary business", "I'm considering it but haven't acted yet"],
    },
    {
      qid: "q4",
      question: "Do you have succession or exit plans?",
      options: ["Yes, a formal, documented plan is in place", "I have some ideas but nothing is formalized", "I'm thinking about it, but it's far off", "No, I have not planned for this"],
    },
    {
      qid: "q5",
      question: "How do you handle financial risks?",
      options: ["With a structured risk management framework", "By maintaining large cash reserves", "Intuitively, based on experience", "I tend to avoid risks as much as possible"],
    },
    {
      qid: "q6",
      question: "Do you face cash flow gaps?",
      options: ["Rarely, our cash flow is very stable", "Occasionally, during certain business cycles", "Yes, it's a recurring challenge we manage", "Frequently, it's a major point of stress"],
    },
    {
      qid: "q7",
      question: "Are you using credit or loans for business?",
      options: ["Yes, strategically for growth", "Only occasionally for short-term needs", "I try to avoid debt and bootstrap", "No, my business is completely debt-free"],
    },
    {
      qid: "q8",
      question: "Do you automate salary/vendor payments?",
      options: ["Yes, most payments are fully automated", "Some are automated, others are manual", "No, all payments are processed manually", "I use an accountant/service for this"],
    },
    {
      qid: "q9",
      question: "Do you measure ROI for business expenses?",
      options: ["Yes, for all major expenses", "For some expenses, but not all", "Not formally, but I have an intuitive sense", "No, I don't track ROI on expenses"],
    },
    {
      qid: "q10",
      question: "Would you like AI-based financial dashboards?",
      options: ["Yes, a real-time dashboard would be ideal", "I'm open to it if it's better than my current setup", "I prefer my current system of reports", "No, I don't think I need this"],
    },
    {
      qid: "q11",
      question: "Do you consult advisors or decide solo?",
      options: ["I rely on a team of advisors (CA, planner)", "I consult advisors for major decisions only", "I primarily make decisions on my own", "I discuss with a business partner or spouse"],
    },
    {
      qid: "q12",
      question: "How do you manage financial stress?",
      options: ["Through structured planning and data", "By focusing on long-term goals", "By discussing with advisors/support system", "I find it difficult to manage"],
    },
    {
      qid: "q13",
      question: "Are you balancing family wealth & business risks?",
      options: ["Yes, with clear separation and legal structures", "I try to, but the lines are often blurred", "It's a constant challenge and a source of worry", "My family wealth is tied to the business"],
    },
    {
      qid: "q14",
      question: "Do you want to reduce active management in the future?",
      options: ["Yes, I'm building systems to step back", "Maybe, but I enjoy being hands-on", "No, I plan to be actively involved long-term", "I haven't thought about my future involvement"],
    },
    {
      qid: "q15",
      question: "Have you faced decision fatigue financially?",
      options: ["Yes, frequently", "Sometimes, with complex decisions", "Rarely, I have a clear framework", "No, I enjoy making these decisions"],
    },
    {
      qid: "q16",
      question: "Would you trust AI to alert for red flags?",
      options: ["Yes, I'd value an AI's impartial analysis", "I'd use it as a secondary check", "I'm skeptical but willing to see proof", "No, I trust my own intuition and advisors"],
    },
    {
      qid: "q17",
      question: "Do you want tax optimization strategies via AI?",
      options: ["Yes, if it finds opportunities my CA might miss", "I'd be interested in seeing its suggestions", "I rely solely on my human tax advisor", "No, I'm not comfortable using AI for taxes"],
    },
    {
      qid: "q18",
      question: "Would you prefer simplified summaries or deep analytics?",
      options: ["High-level summaries and KPIs", "Deep-dive analytics with drill-down", "A combination of both would be perfect", "Just show me the problems to solve"],
    },
    {
      qid: "q19",
      question: "Are you open to AI-based insurance & wealth suggestions?",
      options: ["Yes, for both business and personal needs", "Maybe for analysis, not for final selection", "I prefer to work with a human advisor", "No, I'm not interested in this"],
    },
    {
      qid: "q20",
      question: "Would you like AI to suggest passive income options?",
      options: ["Yes, based on my risk profile and capital", "I'm curious to see what it would suggest", "I have my own ideas for passive income", "No, my focus is on my active business"],
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
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-800">Established Business Owner Survey (30-60)</h1>
          <p className="text-md text-gray-600 mt-2">Help us understand your financial landscape.</p>
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

export default EstablishedBusinessOwnerSurvey;
