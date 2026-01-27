/**
 * Dashboard Reading History Page
 * User's reading history
 * Styled with royal black & gold theme
 */

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
          <span className="text-[var(--gold)]">✦</span> Reading History
        </h1>
        <p className="text-[var(--foreground-muted)] mt-1">Track your learning journey</p>
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl p-8 border border-[var(--card-border)] text-center">
        <div className="text-4xl mb-4">📜</div>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">No History Yet</h2>
        <p className="text-[var(--foreground-muted)] max-w-md mx-auto">
          Your reading history will appear here as you explore the Quran and Hadith.
        </p>
      </div>
    </div>
  );
}
