'use client';

import { useLearningStore } from '@/store/learningStore';

export default function SyllabusView() {
  const { syllabus, error, selectedModuleId, setSelectedModule } = useLearningStore();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">Error</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!syllabus) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Learning Syllabus</h2>
        <p className="text-gray-500 text-sm">
          Enter a topic above to generate your personalized learning path.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-2">{syllabus.topic}</h2>
      <p className="text-xs text-gray-500 mb-4">
        Generated {new Date(syllabus.generated_at).toLocaleString()}
      </p>

      <div className="space-y-3">
        {syllabus.modules?.map((module: any) => (
          <button
            key={module.id}
            onClick={() => setSelectedModule(module)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedModuleId === module.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {module.id}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 mb-1">{module.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{module.description}</p>
                {module.channel && (
                  <p className="text-xs text-gray-500 mt-1">📺 {module.channel}</p>
                )}
                {module.duration && (
                  <p className="text-xs text-gray-500">⏱️ {module.duration}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}