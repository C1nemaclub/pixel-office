import { FC } from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { SOCIALS } from '../../utils/contants';

interface SocialsProps {}

const iconMapper: { [key: string]: JSX.Element } = {
  linkedin: <FaLinkedin size={30} />,
  github: <FaGithub size={30} />,
};

const Socials: FC<SocialsProps> = ({}) => {
  return (
    <div className='flex gap-4 justify-center items-center fixed right-6 bottom-6'>
      {SOCIALS.map((item: { link: string; icon: string }) => {
        return (
          <a
            key={item.link}
            href={item.link}
            target='_blank'
            rel='noreferrer'
            className='rounded-full p-2 bg-slate-50 w-full hover:bg-indigo-500 cursor-pointer'>
            {iconMapper[item.icon]}
          </a>
        );
      })}
    </div>
  );
};

export default Socials;
