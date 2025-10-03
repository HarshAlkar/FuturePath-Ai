import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Edit3, Send } from "lucide-react";

// Main App Component
function App() {
  return <UnemployedFinancialSurvey />;
}

// Survey Component for Unemployed Individuals (All Ages)
const UnemployedFinancialSurvey = ({ onComplete }) => {
  // State to hold the answers and submission status
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // The list of questions for the survey
  const questions = [
    {
      qid: "q1",
      question: "Are you actively job hunting or on a break?",
      options: ["Actively job hunting daily", "Casually looking for roles", "Taking a planned break or upskilling", "Not currently looking"],
    },
    {
      qid: "q2",
      question: "How long have you been without stable income?",
      options: ["Less than a month", "1-3 months", "3-6 months", "More than 6 months"],
    },
    {
      qid: "q3",
      question: "Do you have an emergency fund?",
      options: ["Yes, and it's sufficient for now", "Yes, but it's running low", "I had one, but it's now depleted", "No, I did not have one"],
    },
    {
      qid: "q4",
      question: "Are you cutting expenses or maintaining lifestyle?",
      options: ["Cutting all non-essential expenses", "Cutting back on some things", "Trying to maintain my previous lifestyle", "My expenses have unfortunately increased"],
    },
    {
      qid: "q5",
      question: "Are you worried about accumulating debt?",
      options: ["Yes, it's a major concern", "Somewhat worried", "I'm managing to avoid debt so far", "I have already accumulated some debt"],
    },
    {
      qid: "q6",
      question: "Are you interested in side gigs or freelancing?",
      options: ["Yes, I'm actively seeking them", "I'm open to it for quick cash", "Maybe, if the right opportunity comes", "No, I'm focused on a full-time job"],
    },
    {
      qid: "q7",
      question: "Do you prioritize bills or savings right now?",
      options: ["Paying bills is the only priority", "I'm using savings to pay bills", "I can't afford to do either right now", "I'm trying to do a little of both"],
    },
    {
      qid: "q8",
      question: "Are you considering selling assets for liquidity?",
      options: ["Yes, it's something I'm considering", "It would be an absolute last resort", "No, I don't have assets to sell", "No, I don't want to do that"],
    },
    {
      qid: "q9",
      question: "Are you receiving financial help from family?",
      options: ["Yes, regularly", "Yes, I've received some help", "I'm trying to avoid it", "No, I am managing on my own"],
    },
    {
      qid: "q10",
      question: "Do you want to set a survival budget with AI?",
      options: ["Yes, I need a strict plan", "I'd be interested to see what it suggests", "I prefer to make my own budget", "No, thank you"],
    },
    {
      qid: "q11",
      question: "Would you like help tracking minimal expenses?",
      options: ["Yes, that would be very helpful", "I already have a method for it", "Maybe, if it's extremely simple", "No, I can manage this"],
    },
    {
      qid: "q12",
      question: "Are you interested in financial stress reduction tips?",
      options: ["Yes, I definitely need some", "I'm open to any suggestions", "I'm not sure they would help me", "No, I'm managing the stress fine"],
    },
    {
      qid: "q13",
      question: "Do you want AI to recommend part-time income options?",
      options: ["Yes, based on my skills and location", "I'm curious to see the recommendations", "I prefer to find opportunities myself", "No, I'm not looking for part-time work"],
    },
    {
      qid: "q14",
      question: "Are you open to micro-saving (₹10–₹50 daily)?",
      options: ["Yes, every little bit helps", "I could try, but it seems difficult now", "I don't think it would make a difference", "No, I cannot afford to save anything"],
    },
    {
      qid: "q15",
      question: "Would you like spending alerts when you exceed limits?",
      options: ["Yes, I absolutely need those", "Maybe for certain spending categories", "No, that would cause more anxiety", "I don't have set limits right now"],
    },
    {
      qid: "q16",
      question: "Do you want the app to motivate or strictly control expenses?",
      options: ["Strict control to enforce discipline", "Motivation with positive reinforcement", "A neutral, data-only approach", "I don't want either persona"],
    },
    {
      qid: "q17",
      question: "Should AI auto-plan the first ₹5000 when you get income again?",
      options: ["Yes, plan for bills and necessities", "I'd like to see the plan before approving", "No, I want full control over it", "It's too early to think about that"],
    },
    {
      qid: "q18",
      question: "Are you interested in learning new money management skills?",
      options: ["Yes, now is the perfect time to learn", "I'm open to it if it's free", "I feel I know enough already", "I'm too busy job hunting to learn"],
    },
    {
      qid: "q19",
      question: "Would you like access to cost-cutting tips or hacks?",
      options: ["Yes, I need all the tips I can get", "I'm interested in practical, easy hacks", "I feel like I've already cut everything", "No, I don't need them"],
    },
    {
      qid: "q20",
      question: "Do you want AI to monitor and optimize expenses until you're employed again?",
      options: ["Yes, continuous monitoring would be great", "I'd use it for a weekly review", "No, that feels too intrusive", "I'm not sure I would trust it"],
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
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-800">Financial Survey for Unemployed Individuals</h1>
          <p className="text-md text-gray-600 mt-2">Let's understand your current financial situation.</p>
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

export default UnemployedFinancialSurvey;
