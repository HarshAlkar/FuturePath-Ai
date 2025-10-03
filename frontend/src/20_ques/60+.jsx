import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Edit3, Send } from "lucide-react";

// Main App Component
function App() {
  return <RetiredFinancialSurvey />;
}

// Survey Component for Retired Senior Citizens (60+)
const RetiredFinancialSurvey = ({ onComplete }) => {
  // State to hold the answers and submission status
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // The list of questions for the survey
  const questions = [
    {
      qid: "q1",
      question: "Are you living off pension, savings, or rental income?",
      options: ["Mainly Pension", "Mainly Savings/Investments", "Mainly Rental Income", "A mix of all three"],
    },
    {
      qid: "q2",
      question: "Do you worry about outliving your money?",
      options: ["Yes, it's a constant worry", "Sometimes, I think about it", "Not really, I have a solid plan", "No, I am financially secure"],
    },
    {
      qid: "q3",
      question: "Do you have medical/emergency funds?",
      options: ["Yes, a dedicated fund is in place", "Yes, but it could be larger", "I rely on my general savings", "No, I don't have a specific fund"],
    },
    {
      qid: "q4",
      question: "Are you managing finances independently?",
      options: ["Yes, I manage everything myself", "Mostly, with some help from family", "My children/family manage it for me", "I use a professional advisor"],
    },
    {
      qid: "q5",
      question: "Do you prefer low-risk, fixed returns?",
      options: ["Exclusively, safety is key", "Mostly, but open to some low-risk growth", "I like a balanced approach", "I'm not sure what's best for me"],
    },
    {
      qid: "q6",
      question: "Are you interested in passive income options?",
      options: ["Yes, to supplement my current income", "I'm curious but cautious", "No, I prefer to preserve my capital", "I already have sufficient passive income"],
    },
    {
      qid: "q7",
      question: "Have you done wealth transfer or will planning?",
      options: ["Yes, my will and estate plan are complete", "I've started the process", "I'm planning to do it soon", "No, I haven't addressed this yet"],
    },
    {
      qid: "q8",
      question: "Do you use digital banking comfortably?",
      options: ["Yes, I use it regularly", "For some things, but I prefer the bank branch", "I find it a bit difficult", "No, I avoid it completely"],
    },
    {
      qid: "q9",
      question: "Are you worried about online scams?",
      options: ["Yes, very worried", "Somewhat worried, I'm cautious", "I feel confident I can spot them", "I'm not very aware of the risks"],
    },
    {
      qid: "q10",
      question: "How do you track monthly expenses?",
      options: ["With a diary or notebook", "Using a mobile app or spreadsheet", "I have a general mental estimate", "I don't track them closely"],
    },
    {
      qid: "q11",
      question: "Do you have help from family for financial decisions?",
      options: ["Yes, I always consult my children/family", "For major decisions only", "No, I prefer to decide independently", "They help, but I make the final call"],
    },
    {
      qid: "q12",
      question: "Do you feel confident learning new financial tools?",
      options: ["Yes, if they are simple and clear", "I'm willing to try with some guidance", "Not really, I prefer traditional methods", "No, I find new technology overwhelming"],
    },
    {
      qid: "q13",
      question: "Have you faced any financial difficulties recently?",
      options: ["Yes, due to medical costs", "Yes, due to rising living costs", "A few minor issues", "No, things have been stable"],
    },
    {
      qid: "q14",
      question: "Do you track medical expenses closely?",
      options: ["Yes, I keep all bills and records", "I track major expenses only", "Not very closely", "My insurance handles most of it"],
    },
    {
      qid: "q15",
      question: "Would you like simplified money management tools?",
      options: ["Yes, a very simple tool would be great", "I'm open to trying one", "I'm comfortable with my current method", "I don't think I need one"],
    },
    {
      qid: "q16",
      question: "Are you open to WhatsApp/SMS financial summaries?",
      options: ["Yes, a weekly summary would be nice", "Maybe a monthly one", "No, I prefer not to get financial info via message", "I'm not sure about the security"],
    },
    {
      qid: "q17",
      question: "Would you like AI to optimize your retirement fund usage?",
      options: ["Yes, to make my funds last longer", "I'd be interested to see its suggestions", "I trust my current plan/advisor", "No, I wouldn't be comfortable with that"],
    },
    {
      qid: "q18",
      question: "Do you want reminders for bills and payments?",
      options: ["Yes, that would be very helpful", "I already have a system for reminders", "Maybe, for important bills only", "No, I don't need them"],
    },
    {
      qid: "q19",
      question: "Are you interested in safe, small investments for steady returns?",
      options: ["Yes, like FDs or senior citizen schemes", "I'm open to learning about new options", "I prefer to keep my money in savings", "I'm not looking to invest further"],
    },
    {
      qid: "q20",
      question: "Would you like AI to monitor your account for suspicious activity?",
      options: ["Yes, that would provide peace of mind", "I'd trust it more than just bank alerts", "I'm not sure how it would work", "No, I prefer to monitor it myself"],
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
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-800">Senior Citizen Financial Survey (60+)</h1>
          <p className="text-md text-gray-600 mt-2">Help us understand your financial needs.</p>
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

export default RetiredFinancialSurvey;
