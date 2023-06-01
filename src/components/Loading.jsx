const Loading = () => {
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center fixed top-0 left-0 z-0">
      <div
        className="radial-progress bg-primary text-primary-content border-4 border-primary animate-spin"
        style={{ "--value": 25, '--size': '20rem' }}
      >
      </div>
    </div>
  );
};

export default Loading;
