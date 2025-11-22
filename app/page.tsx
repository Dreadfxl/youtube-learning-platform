import TopicInput from '@/components/TopicInput';
import SyllabusView from '@/components/SyllabusView';
import VideoPlayer from '@/components/VideoPlayer';
import TranscriptPanel from '@/components/TranscriptPanel';
import ChatPanel from '@/components/ChatPanel';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            YouTube Learning Platform
          </h1>
          <p className="text-gray-600">
            Transform any topic into a structured learning path with AI-powered tutoring
          </p>
        </header>

        <TopicInput />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left: Syllabus */}
          <div className="lg:col-span-1">
            <SyllabusView />
          </div>

          {/* Center & Right: Video + Transcript + Chat */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TranscriptPanel />
              <ChatPanel />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}