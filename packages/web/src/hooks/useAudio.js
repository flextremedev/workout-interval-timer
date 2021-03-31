export const useAudio = (url) => {
  const audio = new Audio(url);
  return { audio };
};
