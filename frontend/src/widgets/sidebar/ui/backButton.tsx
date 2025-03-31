import { ArrowLeft } from 'lucide-react';

type BackButtonProps = {
  onClick: () => void;
};

export const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <button onClick={onClick} className="text-sm">
      <ArrowLeft />
    </button>
  );
};
