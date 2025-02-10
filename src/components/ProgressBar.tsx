import { useEffect, useState } from "react";

const PROGRESS_INTERVAL = 20;

const ProgressBar: React.FC<{ duration: number }> = ({ duration }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => prev + PROGRESS_INTERVAL);
    }, PROGRESS_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return <progress value={progress} max={duration}></progress>;
};

export default ProgressBar;
