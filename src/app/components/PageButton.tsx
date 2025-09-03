type Props = {
  //styles: React.CSSProperties;
  onClickRight: () => void;
  onClickLeft: () => void;
};
const PageButton = (props: Props) => {
  const { onClickRight, onClickLeft } = props;
  //const pageStyles = Object.values(styles).join(" ");
  return (
    <div className={`flex justify-between `}>
      <div className="flex  items-baseline-last" onClick={onClickLeft}>
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent transform rotate-90 border-t-blue-500"></div>
        <div className="ml-0 p-0 text-red-400"> 前へ</div>
      </div>

      <div className=" flex  items-baseline-last" onClick={onClickRight}>
        <div className="mr-0 p-0 text-red-400"> 次へ</div>
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent transform rotate-270 border-t-blue-500"></div>
      </div>
    </div>
  );
};
export default PageButton;
