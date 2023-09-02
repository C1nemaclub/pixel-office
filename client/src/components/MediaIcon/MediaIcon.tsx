import { FC } from 'react';

interface MediaIconProps {
  active: boolean;
  activeIcon: JSX.Element;
  disableIcon: JSX.Element;
  onClick?: () => void;
}

const MediaIcon: FC<MediaIconProps> = ({ active, activeIcon, disableIcon, onClick }) => {
  const className = active
    ? 'rounded-full bg-slate-900 opacity-80 w-fit p-3 cursor-pointer'
    : 'rounded-full bg-red-700 opacity-80 w-fit p-3 cursor-pointer';
  return (
    <div className={className} onClick={onClick}>
      {active ? activeIcon : disableIcon}
    </div>
  );
};

export default MediaIcon;
