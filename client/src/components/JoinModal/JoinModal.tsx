import { useState } from 'react';
import CharacterCarousel from '../CharacterCarousel/CharacterCarousel';
import Button from '../Button/Button';


type JoinModalProps = {
  onJoin: (selectedChar: number, name: string) => void;
  audioDevices: MediaDeviceInfo[]
  changeAudioSource: (deviceId: string) => void
};

function JoinModal({ onJoin, audioDevices, changeAudioSource }: JoinModalProps) {
  const [activeChar, setActiveChar] = useState<number>(4) 
  const [name, setName] = useState<string>('')
  
  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!name) return;
    if(name.length > 15) return;
      onJoin(activeChar, name)
  }

  const handleAudioSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeAudioSource(e.target.value)
  }

  return (
    <div className='py-12 px-6 rounded w-full min-w-[300px] max-w-[400px] flex flex-col justify-center items-center gap-4 bg-[#110c27] absolute-center'>
      <h1 className='text-3xl font-bold text-center text-slate-50'>
        Pick your Avatar
      </h1>
      <div className="w-full max-w-[400px]">
        <select name="audioDevice" onChange={handleAudioSourceChange}>
        {audioDevices.map((device)=>{
          return <option value={device.deviceId}>{device.label}</option>
        })}
        </select>
      </div>
      <form onSubmit={formSubmit} className="flex flex-col gap-4">
        <CharacterCarousel activeChar={activeChar} setActiveChar={setActiveChar} />
        <input className="custom-input w-full outline-none" placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)}/>
        <Button type="submit" className="w-full">Join Office</Button>
      </form>
    </div>
  );
}

export default JoinModal;
