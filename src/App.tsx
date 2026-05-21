import React, { useState, useEffect, useCallback } from 'react';
import { useVideoProcessor } from './hooks/useVideoProcessor';
import { useCopyForSections } from './hooks/useCopy';
import { LANGUAGES } from './utils/constants';
import { Button } from './components/ui/Button';
import { Tabs } from './components/ui/Tab';
import type { TabItem } from './components/ui/Tab';
import { SkeletonLoader } from './components/ui/Skeleton';
import {
  VideoInfoSection,
  MetadataSection,
  TranscriptSection,
  ScriptStepsSection,
  FinalScriptSection,
  ImagePlanSection,
  GeneratedImagesSection,
  ThumbnailSection,
  AnnotatedTranscriptSection,
} from './components/sections';

type HealthStatus = 'loading' | 'healthy' | 'unhealthy';

const App: React.FC = () => {
  const {
    url,
    setUrl,
    language,
    setLanguage,
    minScriptWordCount,
    setMinScriptWordCount,
    defaultImageCount,
    setDefaultImageCount,
    result,
    isLoading,
    error,
    processVideo,
    checkServerHealth,
  } = useVideoProcessor();

  const [health, setHealth] = useState<HealthStatus>('loading');
  const [activeTab, setActiveTab] = useState('original');

  useEffect(() => {
    checkServerHealth().then((ok) => {
      setHealth(ok ? 'healthy' : 'unhealthy');
    });
  }, [checkServerHealth]);

  const { copiedSection, copyToClipboard, copyImageToClipboard } = useCopyForSections();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('original');
    await processVideo();
  }, [processVideo]);

  const languageOptions = LANGUAGES.map(lang => ({ value: lang, label: lang }));

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="animate-fade-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 md:p-12 mb-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-ping opacity-30"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Processing Video Pipeline</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              The AI is fetching metadata, rewriting content, generating scripts, and creating images. This may take a minute...
            </p>
          </div>
          <SkeletonLoader />
        </div>
      );
    }

    if (!result) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Process</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Enter a YouTube URL above to fetch video data, rewrite metadata, generate scripts, and create AI images.
          </p>
        </div>
      );
    }

    const imageCount = result.generated_image_urls?.length ?? 0;
    const stepsCount = result.script_steps?.total_steps ?? 0;

    const tabs: TabItem[] = [
      { id: 'original', label: 'Original Video', count: 1, gradient: 'from-slate-600 to-slate-800' },
      { id: 'rewritten', label: 'Rewritten Content', count: 1, gradient: 'from-blue-600 to-violet-600' },
      { id: 'script', label: 'Script', count: stepsCount || undefined, gradient: 'from-indigo-600 to-violet-600' },
      { id: 'images', label: 'Image Plan & Gallery', count: imageCount || undefined, gradient: 'from-violet-600 to-fuchsia-600' },
      { id: 'annotated', label: 'Annotated Transcript', count: 1, gradient: 'from-teal-600 to-cyan-600' },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Processing Results</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Completed
          </div>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="space-y-8">
          {activeTab === 'original' && (
            <>
              <VideoInfoSection
                data={result}
                copiedSection={copiedSection}
                onCopy={copyToClipboard}
              />
              {result.transcript && (
                <TranscriptSection
                  data={result}
                  copiedSection={copiedSection}
                  onCopy={copyToClipboard}
                />
              )}
            </>
          )}

          {activeTab === 'rewritten' && (
            <MetadataSection
              data={result}
              copiedSection={copiedSection}
              onCopy={copyToClipboard}
            />
          )}

          {activeTab === 'script' && (
            <>
              <ScriptStepsSection
                data={result}
                copiedSection={copiedSection}
                onCopy={copyToClipboard}
              />
              <FinalScriptSection
                data={result}
                copiedSection={copiedSection}
                onCopy={copyToClipboard}
              />
            </>
          )}

          {activeTab === 'images' && (
            <>
              <ImagePlanSection
                data={result}
                copiedSection={copiedSection}
                onCopy={copyToClipboard}
              />
              <GeneratedImagesSection
                data={result}
                copiedSection={copiedSection}
                onCopyText={copyToClipboard}
                onCopyImage={copyImageToClipboard}
              />
            </>
          )}

          {activeTab === 'annotated' && (
            <AnnotatedTranscriptSection
              data={result}
              copiedSection={copiedSection}
              onCopy={copyToClipboard}
            />
          )}
        </div>

        <ThumbnailSection
          data={result}
          copiedSection={copiedSection}
          onCopyText={copyToClipboard}
          onCopyImage={copyImageToClipboard}
        />
      </div>
    );
  };

  const healthDotColor = health === 'healthy' ? 'bg-green-500' : health === 'unhealthy' ? 'bg-red-500' : 'bg-yellow-400';
  const healthLabel = health === 'healthy' ? 'API Online' : health === 'unhealthy' ? 'API Offline' : 'Checking...';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4.125-1.625a1 1 0 00.788-.814l-4.125-1.625a1 1 0 01-.257-.356L10.394 2.08z" />
            </svg>
            AI-Powered YouTube Content Generator
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            YouTube Content{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              Processor
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform YouTube videos with AI. Generate rewritten metadata, 
            create scripts, and produce custom images — all in your preferred language.
          </p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <span className={`w-2.5 h-2.5 rounded-full ${healthDotColor} transition-colors duration-500`}></span>
            <span className="text-xs text-gray-500 font-medium">{healthLabel}</span>
          </div>
        </header>

        <main>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 mb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube Video URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="w-full lg:w-56">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Output Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
                    disabled={isLoading}
                  >
                    {languageOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    type="submit"
                    disabled={isLoading || !url.trim()}
                    loading={isLoading}
                    className="w-full lg:w-auto h-14 px-8 text-lg"
                  >
                    {isLoading ? 'Processing...' : 'Fetch & Rewrite'}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-600">Min Script Words:</label>
                  <input
                    type="number"
                    value={minScriptWordCount}
                    onChange={(e) => setMinScriptWordCount(parseInt(e.target.value) || 2500)}
                    className="w-28 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-center"
                    min={100}
                    max={10000}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-600">Image Count:</label>
                  <input
                    type="number"
                    value={defaultImageCount}
                    onChange={(e) => setDefaultImageCount(parseInt(e.target.value) || 15)}
                    className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-center"
                    min={1}
                    max={50}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex-1"></div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Processing may take 2-5 minutes
                </div>
              </div>
            </form>
          </div>

          {error && (
            <div className="mb-8 bg-red-50/80 backdrop-blur border border-red-200 rounded-2xl p-6 animate-shake">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800">Processing Error</h4>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {renderContent()}
        </main>

        <footer className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-white/60 backdrop-blur rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <span className="text-sm font-medium">FastAPI</span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">LangGraph</span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">AI Images</span>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Built with modern web technologies
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;