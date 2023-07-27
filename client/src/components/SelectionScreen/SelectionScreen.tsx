import { Dispatch } from 'react';
import charsheet from '../../assets/chars/spritesheet.png';
import { SetStateAction } from 'jotai';

type SelectionScreenProps = {
  setName: Dispatch<SetStateAction<string>>;
  name: string
};

function SelectionScreen({ setName, name}: SelectionScreenProps) {
  return <div className='w-1/2 h-full m-auto text-center'>
    <form>
      <label htmlFor="name">Name</label>
      <input value={name} onChange={(e)=>setName(e.target.value)} placeholder='Name...' />
    </form>

  </div>;
}

export default SelectionScreen;
