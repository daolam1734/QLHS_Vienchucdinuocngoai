import { Loader } from 'lucide-react';
import './LoadingOverlay.css';

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Đang tải...' }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <Loader className="loading-spinner" size={48} />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
