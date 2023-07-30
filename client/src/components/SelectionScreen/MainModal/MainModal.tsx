import { FaLaptopCode } from 'react-icons/fa';
import Loader from '../../Loader/Loader';

type MainModalProps = {
  onSwitch: () => void;
  loading?: boolean;
};

function MainModal({ onSwitch, loading }: MainModalProps) {
  return (
    <div className='py-12 px-6 rounded border-2 border-[#110c27] w-full min-w-[300px] max-w-[400px] flex flex-col justify-center items-center gap-4 bg-[#110c27] absolute-center'>
      <h1 className='text-3xl font-bold text-center text-slate-50'>
        Welcome to PiXel Office
      </h1>
      <FaLaptopCode size={70} color='#fff' />
      <button onClick={onSwitch} className='btn w-full'>Join Public Room</button>
      {/* <button onClick={()=> onSwitch(MODAL_TYPES.CREATE)} className='btn-secondary w-full'>Create Room</button> */}
      {loading && <Loader text='Connecting to Server...' />}
    </div>
  );
}

export default MainModal;
