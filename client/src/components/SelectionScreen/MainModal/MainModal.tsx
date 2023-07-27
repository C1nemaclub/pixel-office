import { FaLaptopCode } from 'react-icons/fa';

type MainModalProps = {
  onJoin: () => void;
  onCreate: () => void;
};

function MainModal({ onJoin, onCreate }: MainModalProps) {
  return (
    <div className='py-12 px-6 border-2 max-w-[400px] flex flex-col justify-center items-center gap-4 bg-[#110c27]'>
      <h1 className='text-3xl font-bold text-center text-slate-50'>
        Welcome to PiXel Office
      </h1>
      <FaLaptopCode size={70} color='#fff' />
      <button onClick={onJoin} className='btn w-full'>Join Public Room</button>
      <button onClick={onCreate} className='btn-secondary w-full'>Create Room</button>
    </div>
  );
}

export default MainModal;
