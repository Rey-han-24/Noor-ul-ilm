/**
 * Dashboard Bookmarks Page
 * User's saved verses and hadiths
 * Styled with royal black & gold theme
 */

export default function BookmarksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
          <span className="text-[var(--gold)]">✦</span> Bookmarks
        </h1>
        <p className="text-[var(--foreground-muted)] mt-1">Your saved verses and hadiths</p>
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl p-8 border border-[var(--card-border)] text-center">
        <div className="text-4xl mb-4">🔖</div>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">No Bookmarks Yet</h2>
        <p className="text-[var(--foreground-muted)] max-w-md mx-auto">
          Save your favorite verses and hadiths while reading to access them quickly here.
        </p>
      </div>
    </div>
  );
}
