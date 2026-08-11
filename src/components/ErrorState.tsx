import "./ErrorState.css";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <p className="error-state-title">// Transmission Failed</p>
      <p className="error-state-message">{message}</p>
      <button onClick={onRetry} className="error-state-retry">
        Retry
      </button>
    </div>
  );
}

export default ErrorState;
