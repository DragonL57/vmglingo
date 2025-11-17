import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getUserGrammarWeaknesses,
  getUserConfusingWords,
  getMistakeStatistics,
  getImprovementSuggestions,
} from "@/actions/mistake-tracking";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Separator } from "@/components/ui/separator";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress } from "@/db/queries";

const ProgressPage = async () => {
  const userProgressData = getUserProgress();
  const weaknessesData = getUserGrammarWeaknesses();
  const confusingWordsData = getUserConfusingWords();
  const statisticsData = getMistakeStatistics();
  const suggestionsData = getImprovementSuggestions();

  const [userProgress, weaknesses, confusingWords, statistics, suggestions] =
    await Promise.all([
      userProgressData,
      weaknessesData,
      confusingWordsData,
      statisticsData,
      suggestionsData,
    ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const getMistakeTypeName = (type: string) => {
    const names: Record<string, string> = {
      ARTICLE: "Mạo từ",
      PREPOSITION: "Giới từ",
      TENSE: "Thì",
      SUBJECT_VERB_AGREEMENT: "Sự hòa hợp chủ ngữ - động từ",
      WORD_ORDER: "Trật tự từ",
      VOCABULARY: "Từ vựng",
      SPELLING: "Chính tả",
      PLURAL_SINGULAR: "Số ít/Số nhiều",
      PRONOUN: "Đại từ",
      ADJECTIVE_ADVERB: "Tính từ/Trạng từ",
      COMPARATIVE_SUPERLATIVE: "So sánh",
      MODAL_VERB: "Động từ khuyết thiếu",
      PASSIVE_ACTIVE: "Câu bị động/Chủ động",
      CONDITIONAL: "Câu điều kiện",
      OTHER: "Khác",
    };
    return names[type] || type;
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return "text-red-500";
    if (severity >= 3) return "text-orange-500";
    if (severity >= 2) return "text-yellow-500";
    return "text-blue-500";
  };

  const getSeverityBg = (severity: number) => {
    if (severity >= 4) return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
    if (severity >= 3) return "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800";
    if (severity >= 2) return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800";
    return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800";
  };

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={false}
        />
        <Promo />
      </StickyWrapper>

      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image src="/mascot_sad.svg" alt="Progress" height={90} width={90} />

          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">
            📊 Tiến độ học tập của bạn
          </h1>

          <p className="mb-6 text-center text-lg text-muted-foreground">
            Theo dõi lỗi và nhận gợi ý cải thiện từ AI
          </p>

          <Separator className="mb-4 h-0.5" />

          {/* Thống kê tổng quan */}
          <div className="mb-8 w-full">
            <h2 className="mb-4 text-xl font-bold">📈 Thống kê lỗi</h2>
            {statistics.total > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Tổng số lỗi: <span className="font-semibold">{statistics.total}</span>
                </p>
                {statistics.byType.map((stat: { type: string; count: number; percentage: number }) => (
                  <div
                    key={stat.type}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span className="font-medium">{getMistakeTypeName(stat.type)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {stat.count} lần ({stat.percentage}%)
                      </span>
                      <div className="h-2 w-20 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Chưa có dữ liệu lỗi
              </p>
            )}
          </div>

          <Separator className="mb-4 h-0.5" />

          {/* Điểm yếu cần cải thiện */}
          <div className="mb-8 w-full">
            <h2 className="mb-4 text-xl font-bold">⚠️ Điểm yếu cần cải thiện</h2>
            {weaknesses.length > 0 ? (
              <div className="space-y-3">
                {weaknesses.map((weakness: { id: number; mistakeType: string; severity: number; count: number }) => (
                  <div
                    key={weakness.id}
                    className={`rounded-lg border p-4 ${getSeverityBg(weakness.severity)}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">
                        {getMistakeTypeName(weakness.mistakeType)}
                      </h3>
                      <span className={`text-sm font-medium ${getSeverityColor(weakness.severity)}`}>
                        Mức độ: {weakness.severity}/5
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Đã mắc lỗi: {weakness.count} lần
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Chưa có điểm yếu nào được ghi nhận
              </p>
            )}
          </div>

          <Separator className="mb-4 h-0.5" />

          {/* Gợi ý cải thiện từ AI */}
          <div className="mb-8 w-full">
            <h2 className="mb-4 text-xl font-bold">💡 Gợi ý cải thiện từ AI</h2>
            {suggestions.length > 0 ? (
              <div className="space-y-4">
                {suggestions.map((suggestion: { mistakeType: string; suggestion: string }, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      <h3 className="font-semibold">
                        {getMistakeTypeName(suggestion.mistakeType)}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed">{suggestion.suggestion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Hãy hoàn thành bài tập để nhận gợi ý từ AI
              </p>
            )}
          </div>

          <Separator className="mb-4 h-0.5" />

          {/* Các từ dễ nhầm lẫn */}
          <div className="w-full">
            <h2 className="mb-4 text-xl font-bold">🔄 Các từ bạn hay nhầm lẫn</h2>
            {confusingWords.length > 0 ? (
              <div className="space-y-3">
                {confusingWords.map((word: { id: number; word1: string; word2: string; mistakeCount: number; explanation: string | null }) => (
                  <div
                    key={word.id}
                    className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-red-500">{word.word1}</span>
                        <span>↔️</span>
                        <span className="font-semibold text-green-500">{word.word2}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {word.mistakeCount} lần
                      </span>
                    </div>
                    {word.explanation && (
                      <p className="text-sm">{word.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Chưa có từ nào được ghi nhận
              </p>
            )}
          </div>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default ProgressPage;
