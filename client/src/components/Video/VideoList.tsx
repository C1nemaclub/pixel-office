import { FC } from 'react';

interface VideoListProps {
  children: React.ReactNode;
}

const VideoList: FC<VideoListProps> = ({ children }) => {
  return <div className='flex flex-wrap gap-4 px-8 py-2 w-3/4 m-auto fixed left-1/2 -translate-x-1/2 top-2 justify-center'>{children}</div>;
};

export default VideoList;
