import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Edit3, Send } from "lucide-react";

// Main App Component
function App() {
  return <FinancialHealthSurvey />;
}

// Survey Component for 18-30 Age Group
const FinancialHealthSurvey = ({ onComplete }) => {
  // State to hold the answers and submission status
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // The list of questions for the survey
  const questions = [
    {
      qid: "q1",
      question: "Do you get an allowance or part-time income?",
      options: ["Allowance Only", "Part-time Income Only", "Both", "Neither"],
    },
    {
      qid: "q2",
      question: "What is your monthly income range?",
      options: ["Below ₹5,000", "₹5,000 - ₹15,000", "₹15,000 - ₹30,000", "Above ₹30,000"],
    },
    {
      qid: "q3",
      question: "What do you mostly spend on?",
      options: ["Food & Socializing", "Shopping & Subscriptions", "Rent & Bills", "Travel & Hobbies"],
    },
    {
      qid: "q4",
      question: "Are you currently saving any part of your income?",
      options: ["Yes, a fixed amount regularly", "Yes, whatever is left over", "Rarely, if ever", "No, not at all"],
    },
    {
      qid: "q5",
      question: "Have you tried investing small amounts yet?",
      options: ["Yes, in stocks/crypto", "Yes, in mutual funds/SIPs", "I'm planning to start soon", "No, I haven't considered it"],
    },
    {
      qid: "q6",
      question: "How do you feel about financial risks?",
      options: ["I'm comfortable with high-risk, high-reward", "I prefer moderate and balanced risks", "I'm very risk-averse", "I'm not sure what my risk tolerance is"],
    },
    {
      qid: "q7",
      question: "Are you interested in learning about SIPs or mutual funds?",
      options: ["Very interested, I want to learn more", "Somewhat interested", "I know the basics already", "Not a priority for me right now"],
    },
    {
      qid: "q8",
      question: "Do you have any online subscriptions?",
      options: ["Yes, one or two", "Yes, several for entertainment/work", "Only essential ones", "No, I avoid them"],
    },
    {
      qid: "q9",
      question: "Do you track your expenses via apps or manually?",
      options: ["Yes, I use an app diligently", "I use a spreadsheet or notebook", "I try to, but not consistently", "No, I don't track my spending"],
    },
    {
      qid: "q10",
      question: "Do you plan for unexpected expenses?",
      options: ["Yes, I have a dedicated emergency fund", "I try to keep some buffer cash", "Not formally, but I'm aware of it", "No, I deal with them as they come"],
    },
    {
      qid: "q11",
      question: "Are you more of a spender or a saver?",
      options: ["Definitely a spender", "Primarily a saver", "It's a 50/50 split", "It depends on the month"],
    },
    {
      qid: "q12",
      question: "Would you like AI help setting financial goals?",
      options: ["Yes, that sounds very helpful", "I'm open to trying it", "I prefer setting my own goals", "No, I'm not interested in AI for finance"],
    },
    {
      qid: "q13",
      question: "Where do you usually take financial advice from?",
      options: ["Online (Fin-influencers, Blogs)", "Family and friends", "Financial advisors or professionals", "I figure it out on my own"],
    },
    {
      qid: "q14",
      question: "Have you faced financial stress recently?",
      options: ["Yes, frequently", "Yes, occasionally", "Rarely", "No, I feel financially secure"],
    },
    {
      qid: "q15",
      question: "Would you like automated saving nudges?",
      options: ["Yes, daily or weekly reminders would be great", "Yes, maybe a monthly summary", "I'm not sure if they would work for me", "No, I would find them annoying"],
    },
    {
      qid: "q16",
      question: "Are you saving for travel, gadgets, or education?",
      options: ["Mainly for travel/experiences", "Mainly for a big purchase (gadget, vehicle)", "Mainly for further education or courses", "I'm not saving for a specific large goal"],
    },
    {
      qid: "q17",
      question: "Do you have your own bank account?",
      options: ["Yes, and I manage it fully", "Yes, but my parents have access/oversight", "I have a joint account", "No, I do not"],
    },
    {
      qid: "q18",
      question: "Do you have any pending loans?",
      options: ["Yes, a student loan", "Yes, a personal or credit card loan", "Yes, other types of loans", "No, I am loan-free"],
    },
    {
      qid: "q19",
      question: "Would you prefer daily, weekly, or monthly financial coaching?",
      options: ["Daily, for constant guidance", "Weekly, for regular check-ins", "Monthly, for big-picture planning", "I don't need financial coaching"],
    },
    {
      qid: "q20",
      question: "Do you want to simulate investments before trying them?",
      options: ["Yes, a simulation would be amazing", "I'd be interested to try it", "Maybe, if it's simple to use", "No, I prefer learning with real money"],
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
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-800">Young Adult Financial Survey (18-30)</h1>
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

export default FinancialHealthSurvey;
