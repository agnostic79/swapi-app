import "./OfflineModal.css";

interface OfflineModalProps {
  onDismiss: () => void;
}

function OfflineModal({ onDismiss }: OfflineModalProps) {
  return (
    <div className="offline-overlay" role="dialog" aria-modal="true" aria-labelledby="offline-title">
      <div className="offline-panel">
        <svg className="offline-icon" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="none" stroke="var(--danger)" strokeWidth="2" opacity="0.3" />
          <path
            d="M16 26c8.837-8.837 23.163-8.837 32 0M22 34c4.686-4.686 15.314-4.686 20 0M28 42c1.657-1.657 6.343-1.657 8 0"
            fill="none"
            stroke="var(--danger)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line x1="12" y1="12" x2="52" y2="52" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="49" r="2.5" fill="var(--danger)" />
        </svg>

        <h2 id="offline-title" className="offline-title">
          Signal Lost
        </h2>
        <p className="offline-message">Your connection has dropped. Some data may not load until it's restored.</p>
        <button className="offline-dismiss" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default OfflineModal;
