export default function FileInput({ loading }: { loading: boolean }) {
  return (
    <input
      type="file"
      accept="image/*"
      name="image"
      id="my-image"
      disabled={loading}
      className="text-[1.4rem] rounded-sm file:font-inherit file:font-medium file:px-4 file:py-4 file:mr-4 file:rounded-md file:border-none file:text-white file:bg-[var(--color-brand-600)] file:cursor-pointer file:transition-colors file:duration-200 hover:file:bg-[var(--color-brand-700)]"
    />
  );
}
