import { Dispatch } from 'react';
import charsheet from '../../assets/chars/spritesheet.png';
import { SetStateAction } from 'jotai';

type SelectionScreenProps = {
  setName: Dispatch<SetStateAction<string>>;
};

function SelectionScreen({ setName }: SelectionScreenProps) {
  setName('Test');
  return <div className='w-1/2 h-full m-auto text-center'>SelectionScreen</div>;
}

export default SelectionScreen;
