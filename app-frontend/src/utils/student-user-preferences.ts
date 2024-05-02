export const setStudentUserPreferences = (data: any) => {
  setShowPoints(data.showPoints);
  setShowLevels(data.showLevels);
  setShowBadges(data.showBadges);
  setShowProgressBars(data.showProgressBars);
  setShowLeaderboards(data.showLeaderboards);
};

export const getUserPreferences = () => {};

// points
export const getShowPoints = () => {
  return localStorage.getItem("showPoints");
};

export const setShowPoints = (showPoints: boolean) => {
  return localStorage.setItem("showPoints", showPoints.toString());
};

// levels
export const getShowLevels = () => {
  return localStorage.getItem("showLevels");
};

export const setShowLevels = (showLevels: boolean) => {
  return localStorage.setItem("showLevels", showLevels.toString());
};

// badges
export const getShowBadges = () => {
  return localStorage.getItem("showBadges");
};

export const setShowBadges = (showBadges: boolean) => {
  return localStorage.setItem("showBadges", showBadges.toString());
};

// progress bars
export const getShowProgressBars = () => {
  return localStorage.getItem("showProgressBars");
};

export const setShowProgressBars = (showProgressBars: boolean) => {
  return localStorage.setItem("showProgressBars", showProgressBars.toString());
};

// leaderboards
export const getShowLeaderboards = () => {
  return localStorage.getItem("showLeaderboards");
};

export const setShowLeaderboards = (showLeaderboards: boolean) => {
  return localStorage.setItem("showLeaderboards", showLeaderboards.toString());
};
