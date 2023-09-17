import { useState } from 'react';
import CharacterCarousel from '../CharacterCarousel/CharacterCarousel';
import Button from '../Button/Button';
import { useDeviceStore } from '../../store/deviceStore';
import Select from '../core/Select';
import { getRandomNumber } from '../../utils/utils';
import { AiTwotoneAudio, AiFillVideoCamera } from 'react-icons/ai';
import { Skeleton } from '../core/Skeleton';

type JoinModalProps = {
  onJoin: (selectedChar: number, name: string) => void;
  changeMediaSource: (deviceId: string, deviceType: string) => void;
};

function JoinModal({ onJoin, changeMediaSource }: JoinModalProps) {
  const [activeChar, setActiveChar] = useState<number>(getRandomNumber(16));
  const [name, setName] = useState<string>('');
  const { audioDevices, videoDevices } = useDeviceStore((state) => state);

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) return;
    if (name.length > 30) return;
    onJoin(activeChar, name);
  };

  return (
    <div className='py-12 px-6 rounded w-full min-w-[300px] max-w-[400px] flex flex-col justify-center items-center gap-4 bg-[#110c27] absolute-center'>
      <h1 className='text-3xl font-bold text-center text-slate-50'>Pick your Avatar</h1>
      <div className='w-full max-w-[400px] flex flex-col gap-2'>
        {audioDevices.length > 0 && videoDevices.length > 0 ? (
          <>
            <Select
              Icon={<AiTwotoneAudio color='#fff' size={25} className='shrink-0' />}
              options={audioDevices.map((device) => ({ value: device.deviceId, label: device.label }))}
              name='audio'
              onChange={changeMediaSource}
            />
            <Select
              Icon={<AiFillVideoCamera color='#fff' size={25} className='shrink-0' />}
              options={videoDevices.map((device) => ({ value: device.deviceId, label: device.label }))}
              name='video'
              onChange={changeMediaSource}
            />
          </>
        ) : (
          <>
            <Skeleton className='animate-pulse h-full py-6' />
            <Skeleton className='animate-pulse h-full py-6' />
          </>
        )}
      </div>
      <form onSubmit={formSubmit} className='flex flex-col gap-4'>
        <CharacterCarousel activeChar={activeChar} setActiveChar={setActiveChar} />
        <input className='custom-input w-full outline-none' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
        <Button type='submit' className='w-full'>
          Join Office
        </Button>
      </form>
    </div>
  );
}

export default JoinModal;
