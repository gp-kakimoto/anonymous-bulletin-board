type Props = {
  onClickRight: () => void;
  onClickLeft: () => void;
};
const PageButton = (props: Props) => {
  const { onClickRight, onClickLeft } = props;

  return (
    <div className="sticky top-9/10 flex justify-center w-full z-0 h-max-fit">
      <div className="relative w-2/10 h-fit items-baseline-last ml-1 flex justify-end">
        {/* dummy area */}{" "}
      </div>
      <div
        className="w-7/10 flex h-fit items-baseline-last justify-start mr-0 z-0"
        onClick={onClickLeft}
      >
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent transform rotate-90 border-t-blue-500"></div>
        <div className="m-0 p-0"> 前へ</div>
      </div>

      <div
        className="w-1/10  h-fit flex col items-baseline-last justify-end ml-1 mb-0"
        onClick={onClickRight}
      >
        <div className="m-0 p-0"> 次へ</div>
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent transform rotate-270 border-t-blue-500"></div>
      </div>
    </div>
  );
};
export default PageButton;
