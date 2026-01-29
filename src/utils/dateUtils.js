// Get today's date in YYYY-MM-DD format
export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Archive data from the current day
export const archiveData = (state) => {
  return {
    work: {
      defaultTasks: state.work.defaultTasks,
      dailyTasks: state.work.dailyTasks
    },
    personal: state.personal,
    date: state.lastResetDate
  };
};

// Get sorted list of archived dates
export const getArchivedDates = (archive) => {
  return Object.keys(archive).sort((a, b) => new Date(b) - new Date(a));
};
