type Props = {
  navigateTitle: string;
  justifyStyle: string;
  itemsStyle: string;
  bgcolor?: string; // Optional background color
  width?: string; // Optional width for the rectangle
  onClick?: () => void; // Optional click handler
};
const NavigateRectangleSticky = (props: Props) => {
  const { navigateTitle, justifyStyle, itemsStyle, bgcolor, width, onClick } =
    props;
  return (
    <div
      className={`sticky top-0 ${
        width ? width : "w-2/10"
      } flex h-fit mr-1 pr-0 ${justifyStyle} ${itemsStyle} z-10`}
      onClick={onClick}
    >
      <div className="flex items-start justify-center m-0 p-0">
        <p
          className={`flex items-center text-center text-gray-500 w-full aspect-square ${bgcolor} rounded-2xl`}
        >
          {navigateTitle}
        </p>
      </div>
    </div>
  );
};

export default NavigateRectangleSticky;
