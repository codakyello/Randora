function SpinnerMini({ className }: { className?: string }) {
  return (
    <div
      className={`spinner-mini text-[var(--color-grey-700)] ${className}`}
    ></div>
  );
}

export default SpinnerMini;
