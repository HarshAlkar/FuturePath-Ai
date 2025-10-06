import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Edit3, Send, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Re-styled Survey Component
const StudentForm1830 = ({ onComplete }) => {
  // State to hold the answers and submission status
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  // The list of questions for the survey, all with 4 options
  const questions = [
    {
      qid: "q1",
      question: "How much pocket money do you receive monthly?",
      options: ["Below ₹500", "₹500 - ₹1,500", "₹1,500 - ₹3,000", "Above ₹3,000"],
    },
    {
      qid: "q2",
      question: "Who manages your savings right now?",
      options: ["My Parents", "I manage them myself", "I don't have savings", "A joint account"],
    },
    {
      qid: "q3",
      question: "Do you track how you spend your money?",
      options: ["Yes, meticulously", "Sometimes", "No, not at all", "I want to start"],
    },
    {
      qid: "q4",
      question: "What do you mostly spend on?",
      options: ["Food & Snacks", "Gaming/Entertainment", "Clothes & Accessories", "Books & Stationery"],
    },
    {
      qid: "q5",
      question: "Have you ever saved up for something specific?",
      options: ["Yes, and I bought it!", "Yes, I'm saving now", "No, not yet", "I've tried but gave up"],
    },
    {
      qid: "q6",
      question: "Do you find saving easy or hard?",
      options: ["Very easy", "It's okay", "Quite hard", "Almost impossible"],
    },
    {
      qid: "q7",
      question: "Have you tried any money-saving challenges?",
      options: ["Yes, and I completed it", "Yes, but didn't finish", "No, but I'm curious", "No, not interested"],
    },
    {
      qid: "q8",
      question: "Are you interested in learning about investing early?",
      options: ["Very interested!", "A little bit", "Not sure yet", "Not right now"],
    },
    {
      qid: "q9",
      question: "Would you like to start a small savings goal with us?",
      options: ["Yes, let's do it!", "Maybe later", "I'd like more info first", "No, thank you"],
    },
    {
      qid: "q10",
      question: "Do you borrow money from friends?",
      options: ["Often", "Sometimes", "Rarely", "Never"],
    },
    {
      qid: "q11",
      question: "How do you usually pay for things?",
      options: ["Mostly Cash", "Mostly UPI", "Parents' Card/Account", "I don't typically pay myself"],
    },
    {
      qid: "q12",
      question: "Have you ever bought something you later regretted?",
      options: ["Yes, definitely", "Maybe once or twice", "Many times, unfortunately", "No, I'm a careful buyer"],
    },
    {
      qid: "q13",
      question: "Do you understand what a budget is?",
      options: ["Yes, and I use one", "I know what it is, but don't use one", "I'm not sure", "No, what's that?"]
    },
    {
      qid: "q14",
      question: "Would you like weekly fun money tips?",
      options: ["Yes, please!", "Maybe", "Only if they're useful", "No, thanks"],
    },
    {
      qid: "q15",
      question: "Do you know how stocks work?",
      options: ["Yes, I understand the basics", "I've heard of them", "Not really", "No clue at all"],
    },
    {
      qid: "q16",
      question: "Have you tried virtual money management games?",
      options: ["Yes, they're fun!", "I've tried one", "No, but it sounds cool", "No, not interested"],
    },
    {
      qid: "q17",
      question: "Do you want to learn how to avoid online scams?",
      options: ["Yes, that's important", "I think I know enough", "Yes, but I'm cautious", "Maybe later"],
    },
    {
      qid: "q18",
      question: "Are you saving for a big purchase?",
      options: ["Yes, a gadget", "Yes, a trip", "Yes, something else", "No, not currently"],
    },
    {
      qid: "q19",
      question: "Do you prefer saving automatically or manually?",
      options: ["Automatically (e.g. auto-debit)", "Manually (I transfer myself)", "I don't save", "Not sure which is better"],
    },
    {
      qid: "q20",
      question: "Would you like to track your money using a simple app?",
      options: ["Yes, I need that!", "I already use one", "I prefer not to", "Maybe in the future"],
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
    // Check if all questions have been answered
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
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2 text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>
        
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-800">Student Finance Management</h1>
          <p className="text-md text-gray-600 mt-2">Help us understand your financial habits.</p>
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
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                >
                  <Edit3 className="w-5 h-5" />
                  Edit My Answers
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                >
                  <Home className="w-5 h-5" />
                  Go to Dashboard
                </button>
              </div>
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

export default StudentForm1830;
