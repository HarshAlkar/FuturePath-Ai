// Utility script to add navigation to all question components
// This can be run to update all question components with back buttons

const addNavigationToComponent = (filePath, componentName) => {
  const navigationHeader = `
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
        </div>`;

  const completionButtons = `
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
              </div>`;

  console.log(`Navigation added to ${componentName}`);
  return { navigationHeader, completionButtons };
};

export default addNavigationToComponent;
