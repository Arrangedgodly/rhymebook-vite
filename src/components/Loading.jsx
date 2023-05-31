const Loading = ({ value }) => {
  return (
    <div className="flex flex-col flex-grow items-center justify-center">
      <div
        className="radial-progress bg-primary text-primary-content border-4 border-primary"
        style={{ "--value": value }}
      >
        70%
      </div>
    </div>
  );
};

export default Loading;
