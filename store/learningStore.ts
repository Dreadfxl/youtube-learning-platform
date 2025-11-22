import { create } from 'zustand';

interface Module {
  id: number;
  title: string;
  description: string;
  video_url: string;
  channel?: string;
  duration?: string;
}

interface Syllabus {
  topic: string;
  modules: Module[];
  generated_at: string;
}

interface Transcript {
  transcript: Array<{
    text: string;
    start: number;
    duration: number;
  }>;
  full_text: string;
}

interface LearningStore {
  syllabus: Syllabus | null;
  selectedModule: Module | null;
  selectedModuleId: number | null;
  transcript: Transcript | null;
  videoTimestamp: number | null;
  error: string | null;
  setSyllabus: (syllabus: Syllabus) => void;
  setSelectedModule: (module: Module) => void;
  setTranscript: (transcript: Transcript) => void;
  setVideoTimestamp: (timestamp: number) => void;
  setError: (error: string | null) => void;
}

export const useLearningStore = create<LearningStore>((set) => ({
  syllabus: null,
  selectedModule: null,
  selectedModuleId: null,
  transcript: null,
  videoTimestamp: null,
  error: null,
  setSyllabus: (syllabus) => set({ syllabus, error: null }),
  setSelectedModule: (module) =>
    set({
      selectedModule: module,
      selectedModuleId: module.id,
      transcript: null,
    }),
  setTranscript: (transcript) => set({ transcript }),
  setVideoTimestamp: (timestamp) => set({ videoTimestamp: timestamp }),
  setError: (error) => set({ error }),
}));