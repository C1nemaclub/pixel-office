import {FaArrowLeft,FaArrowRight } from 'react-icons/fa';
import { charsImgArray } from '../../utils/contants';
import { useState } from 'react';
import CharacterCarousel from '../CharacterCarousel/CharacterCarousel';


type JoinModalProps = {
  onJoin: (selectedChar: number, name: string) => void;
  onReturn: (modalType: string) => void;
};

function JoinModal({ onJoin, onReturn }: JoinModalProps) {
  const [activeChar, setActiveChar] = useState<number>(0) 
  const [name, setName] = useState<string>('')

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!name) return;
      onJoin(activeChar, name)
  }

  return (
    <div className='py-12 px-6 w-full min-w-[300px] max-w-[400px] flex flex-col justify-center items-center gap-4 bg-[#110c27] absolute-center'>
      <h1 className='text-3xl font-bold text-center text-slate-50'>
        Pick your Avatar
      </h1>
      <form onSubmit={formSubmit} className="flex flex-col gap-4">
        <CharacterCarousel activeChar={activeChar} setActiveChar={setActiveChar} />
        <input className="custom-input w-full outline-none" placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)}/>
        <button className='btn w-full' type="submit">Join Office</button>
      </form>
    </div>
  );
}

export default JoinModal;
