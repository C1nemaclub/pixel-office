import {FaArrowLeft,FaArrowRight } from 'react-icons/fa';
import { charsImgArray } from '../../utils/contants';
import { useState } from 'react';


type JoinModalProps = {
  onJoin: () => void;
  onReturn: (modalType: string) => void;
};

function JoinModal({ onJoin, onReturn }: JoinModalProps) {
  const [activeChar, setActiveChar] = useState<number>(0) 
  return (
    <div className='py-12 px-6 w-full min-w-[300px] max-w-[400px] flex flex-col justify-center items-center gap-4 bg-[#110c27] absolute-center'>
      {/* <FaArrowLeft onClick={()=> onReturn(MODAL_TYPES.MAIN)} size={30} color="#fff"  /> */}
      <h1 className='text-3xl font-bold text-center text-slate-50'>
        Pick your Avatar
      </h1>
      <div className="flex items-center gap-2">
        <FaArrowLeft  size={45} color="#fff" className="cursor-pointer" onClick={()=> setActiveChar(prev => prev - 1)}/>
      <div className="w-[150px] overflow-hidden select-none">
        <div className="w-[1200px] flex justify-center align-center transition-all " style={{transform: `translateX(${activeChar * (-150)}px)`}}>
        {charsImgArray.map((url: string)=>{
          return <div className="w-[150px]"> 
            <img alt="character" src={url} className="w-full h-full object-cover"  />
            </div>
        })}
          </div>
        </div>
        <FaArrowRight size={45} color="#fff" className="cursor-pointer" onClick={()=> setActiveChar(prev => prev + 1)} />
      </div>
      <input className="custom-input w-full outline-none" placeholder='Name'/>
      <button onClick={onJoin} className='btn w-full'>Join Office</button>
    </div>
  );
}

export default JoinModal;
