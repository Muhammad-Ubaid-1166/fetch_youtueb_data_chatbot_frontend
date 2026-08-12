import React, { useState, useEffect, useCallback } from 'react';
import { useVideoProcessor } from './hooks/useVideoProcessor';
import { useCopyForSections } from './hooks/useCopy';
import { LANGUAGES, QUICK_PREVIEW_URL } from './utils/constants';
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

const PIPELINE_STAGES = [
  { label: 'Fetching video data', desc: 'Metadata, transcript & thumbnail' },
  { label: 'Rewriting metadata', desc: 'SEO title, description & hashtags' },
  { label: 'Writing your script', desc: 'Step-by-step in your language' },
  { label: 'Planning & generating images', desc: 'AI visuals for every section' },
  { label: 'Recreating the thumbnail', desc: 'Vision analysis + regeneration' },
];

const FEATURE_CHIPS = [
  { label: 'Multi-language output', color: 'from-blue-500 to-indigo-500' },
  { label: 'AI image generation', color: 'from-violet-500 to-fuchsia-500' },
  { label: '2500+ word scripts', color: 'from-emerald-500 to-teal-500' },
];

interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  fallback: number;
  step?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

const Stepper: React.FC<StepperProps> = ({
  label,
  value,
  min,
  max,
  fallback,
  step = 1,
  disabled = false,
  onChange,
}) => {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-600">{label}:</label>
      <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
        <button
          type="button"
          onClick={() => onChange(clamp(value - step))}
          disabled={disabled || value <= min}
          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={`Decrease ${label}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(parseInt(e.target.value) || fallback)}
          disabled={disabled}
          className="w-16 text-center py-1.5 text-sm font-semibold text-gray-800 bg-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => onChange(clamp(value + step))}
          disabled={disabled || value >= max}
          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={`Increase ${label}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

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

  const handleQuickPreview = useCallback(async () => {
    setActiveTab('original');
    await processVideo(QUICK_PREVIEW_URL);
  }, [processVideo]);

  const languageOptions = LANGUAGES.map(lang => ({ value: lang, label: lang }));

  const renderLoading = () => (
    <div className="animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-12 h-12 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl animate-ping opacity-30"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Processing Video Pipeline</h3>
            <p className="text-gray-500 text-sm">The AI is working through every stage — this usually takes 2-5 minutes.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white/60 p-4 md:p-6">
          {PIPELINE_STAGES.map((stage, index) => (
            <div key={stage.label} className="flex items-start gap-4 py-3.5 border-b border-gray-100 last:border-0">
              <span
                className="relative inline-flex h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mt-1.5"
                style={{ animationDelay: `${index * 1.8}s` }}
              >
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-70 animate-ping"
                  style={{ animationDelay: `${index * 1.8}s` }}
                ></span>
              </span>
              <div>
                <p className="font-medium text-gray-800">{stage.label}</p>
                <p className="text-sm text-gray-500">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SkeletonLoader />
    </div>
  );

  const renderEmpty = () => (
    <div className="text-center py-16 animate-fade-in">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-inner">
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Process</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        Paste any YouTube URL above to fetch video data, rewrite metadata, generate scripts, and create AI images — or try the demo video.
      </p>
      <Button onClick={handleQuickPreview} loading={isLoading} className="h-12 px-6">
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Try the demo video
        </span>
      </Button>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {FEATURE_CHIPS.map(chip => (
          <span key={chip.label} className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${chip.color} shadow-sm`}>
            {chip.label}
          </span>
        ))}
      </div>
    </div>
  );

  const renderResults = () => {
    const imageCount = result.generated_image_urls?.length ?? 0;
    const stepsCount = result.script_steps?.total_steps ?? 0;
    const finalScriptWords = result.final_script ? result.final_script.split(/\s+/).length : 0;
    const successImages = result.generated_image_urls?.filter(img => img.status === 'success').length ?? 0;

    const stats = [
      { label: 'Script Words', value: finalScriptWords ? finalScriptWords.toLocaleString() : '—', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', accent: 'from-emerald-500 to-teal-500' },
      { label: 'Images Generated', value: imageCount ? `${successImages}/${imageCount}` : '—', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', accent: 'from-violet-500 to-fuchsia-500' },
      { label: 'Script Steps', value: stepsCount ? String(stepsCount) : '—', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a1 1 0 001 1h4a1 1 0 001-1M9 5a1 1 0 000-1h4a1 1 0 000 1', accent: 'from-indigo-500 to-blue-500' },
      { label: 'Output Language', value: language, icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129', accent: 'from-pink-500 to-rose-500' },
    ];

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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-4 flex items-center gap-4 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              <div className={`w-11 h-11 flex-shrink-0 bg-gradient-to-br ${stat.accent} rounded-xl flex items-center justify-center shadow-md`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-bold text-gray-800 truncate">{stat.value}</p>
              </div>
            </div>
          ))}
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
    <div className="min-h-screen relative overflow-x-clip">
      <div className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-blue-300/40 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/4 -right-32 w-[30rem] h-[30rem] bg-purple-300/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-[26rem] h-[26rem] bg-indigo-200/50 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 backdrop-blur text-blue-700 rounded-full text-sm font-medium mb-6 shadow-sm border border-blue-200/50">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4.125-1.625a1 1 0 00.788-.814l-4.125-1.625a1 1 0 01-.257-.356L10.394 2.08z" />
            </svg>
            AI-Powered YouTube Content Generator
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-5 tracking-tight">
            YouTube Content{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              Processor
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform YouTube videos with AI. Generate rewritten metadata,
            create scripts, and produce custom images — all in your preferred language.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {FEATURE_CHIPS.map(chip => (
              <span key={chip.label} className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${chip.color} shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}>
                {chip.label}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
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
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
                      disabled={isLoading}
                    />
                    {url && !isLoading && (
                      <button
                        type="button"
                        onClick={() => setUrl('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Clear URL"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="text-xs font-medium text-gray-400">Quick preview:</span>
                    <button
                      type="button"
                      onClick={handleQuickPreview}
                      disabled={isLoading}
                      className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/60 text-xs font-medium text-blue-700 hover:from-blue-100 hover:to-purple-100 hover:border-blue-300 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span className="max-w-[220px] truncate font-mono text-[11px]">
                        youtube.com/watch?v=vekmDxgPey8
                      </span>
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-56">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Output Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:1rem]"
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
                    {isLoading ? 'Processing...' : (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Fetch & Rewrite
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-gray-100">
                <Stepper
                  label="Min Script Words"
                  value={minScriptWordCount}
                  min={10}
                  max={10000}
                  fallback={10}
                  step={100}
                  disabled={isLoading}
                  onChange={setMinScriptWordCount}
                />

                <Stepper
                  label="Image Count"
                  value={defaultImageCount}
                  min={1}
                  max={50}
                  fallback={1}
                  disabled={isLoading}
                  onChange={setDefaultImageCount}
                />

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
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800">Processing Error</h4>
                  <p className="text-red-700 mt-1">{error}</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => processVideo()}
                      disabled={isLoading}
                    >
                      Try Again
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleQuickPreview}
                      disabled={isLoading}
                    >
                      Try demo video
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading
            ? renderLoading()
            : result
              ? renderResults()
              : renderEmpty()}
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