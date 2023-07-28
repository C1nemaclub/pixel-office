import { FaLaptopCode,FaArrowLeft } from 'react-icons/fa';
import { MODAL_TYPES } from '../../App';


type JoinModalProps = {
  onJoin: () => void;
  onReturn: (modalType: string) => void;
};

function JoinModal({ onJoin, onReturn }: JoinModalProps) {
  return (
    <div className='py-12 px-6 max-w-[400px] flex flex-col justify-center items-center gap-4 bg-[#110c27] absolute-center'>
      {/* <FaArrowLeft onClick={()=> onReturn(MODAL_TYPES.MAIN)} size={30} color="#fff"  /> */}
      <h1 className='text-3xl font-bold text-center text-slate-50'>
        Welcome to PiXel Office
      </h1>
      <FaLaptopCode size={70} color='#fff' />
      <input  />
      <button onClick={onJoin} className='btn w-full'>Join Office</button>
    </div>
  );
}

export default JoinModal;
