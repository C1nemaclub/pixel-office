import { BiSolidRightArrow, BiSolidLeftArrow } from 'react-icons/bi';
import { charsImgArray } from '../../utils/contants';

type CharacterCarouselProps = {
  activeChar: number;
  setActiveChar: React.Dispatch<React.SetStateAction<number>>;
};

function CharacterCarousel({
  activeChar,
  setActiveChar,
}: CharacterCarouselProps) {
  return (
    <div className='flex items-center gap-2'>
      <button
        onClick={() => setActiveChar((prev) => prev - 1)}
        disabled={activeChar === 0}
        type='button'
      >
        <BiSolidLeftArrow
          size={45}
          className={`text-slate-50 cursor-pointer hover:text-indigo-500 ${
            activeChar === 0 ? 'opacity-0' : ''
          }`}
        />
      </button>
      <div className='w-[150px] overflow-hidden select-none'>
        <div
          className='w-[2400px] flex justify-center align-center transition-all duration-300 '
          style={{ transform: `translateX(${activeChar * -150}px)` }}
        >
          {charsImgArray.map((url: string) => {
            return (
              <div className='w-[150px]' key={url}>
                <img
                  alt='character'
                  src={url}
                  className='w-full h-full object-cover'
                />
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={() => setActiveChar((prev) => prev + 1)}
        disabled={activeChar === charsImgArray.length - 1}
        type='button'
      >
        <BiSolidRightArrow
          size={45}
          className={`text-slate-50 cursor-pointer hover:text-indigo-500 ${
            activeChar === charsImgArray.length - 1 ? 'opacity-0' : ''
          }`}
        />
      </button>
    </div>
  );
}

export default CharacterCarousel;
