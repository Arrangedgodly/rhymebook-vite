const Loading = () => {
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center fixed top-0 left-0 z-0">
      <span className="loading loading-dots text-primary-content w-1/6 h-full"></span>
    </div>
  );
};

export default Loading;
