
type LoaderProps = {
  text?: string;
  centered?: boolean;
};

function Loader({ text = 'Loading...', centered = false }: LoaderProps) {
  return (
    <div className={`loader-container  ${centered ? 'absolute-center' : ''}`}>
      <span className={`text-[#fff]`}>{text}</span>
      <div className='loader'>
        <div className='inner_loader'></div>
      </div>
    </div>
  );
}

export default Loader;
