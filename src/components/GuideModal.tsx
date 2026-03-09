interface GuideModalProps {
  onClose: () => void;
}

export default function GuideModal({ onClose }: GuideModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl w-full p-6 flex flex-col gap-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold">How to Use</h3>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
            <span className="bg-white/10 rounded-lg p-2 text-base">👆</span>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold opacity-80">Quick tap</span>
              <span className="opacity-60">Tap the +1 or +2 buttons to add points instantly.</span>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
            <span className="bg-white/10 rounded-lg p-2 text-base">✋</span>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold opacity-80">Press and hold the score area</span>
              <span className="opacity-60">Hold on a player's score to manually enter any value or set an exact score.</span>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
            <span className="bg-white/10 rounded-lg p-2 text-base">↩️</span>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold opacity-80">Rewind history</span>
              <span className="opacity-60">In the History tab, tap the rewind button on any entry to roll scores back to that point.</span>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3 text-sm">
          <span className="bg-white/10 rounded-lg p-2 text-base">📱</span>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold opacity-80">Lock your screen orientation</span>
            <span className="opacity-60">We recommend locking your phone in portrait mode for the best experience.</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-4 rounded-xl bg-white/10 active:bg-white/20 font-semibold text-lg"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
