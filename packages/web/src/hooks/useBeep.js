import { useAudio } from './useAudio';
import beepBreakFile from '../BeepBreak.mp3';
import beepBreakLongFile from '../BeepBreakLong.mp3';
import beepWorkFile from '../BeepWork.mp3';
import beepWorkLongFile from '../BeepWorkLong.mp3';
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
