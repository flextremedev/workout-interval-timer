import beepBreakFile from '../assets/BeepBreak.mp3';
import beepBreakLongFile from '../assets/BeepBreakLong.mp3';
import beepWorkFile from '../assets/BeepWork.mp3';
import beepWorkLongFile from '../assets/BeepWorkLong.mp3';

import { useAudio } from './useAudio';
export const useBeep = () => {
  const { audio: beepBreak } = useAudio(beepBreakFile);
  const { audio: beepWork } = useAudio(beepWorkFile);
  const { audio: beepBreakLong } = useAudio(beepBreakLongFile);
  const { audio: beepWorkLong } = useAudio(beepWorkLongFile);
  return {
    beepBreak,
    beepBreakLong,
    beepWork,
    beepWorkLong,
  };
};
