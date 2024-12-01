export default function FileInput({
  required,
  loading,
  accept,
  name,
  id,
}: {
  required: boolean;
  loading: boolean;
  accept: string;
  name: string;
  id: string;
}) {
  return (
    <input
      required={required}
      type="file"
      accept={accept}
      name={name}
      disabled={loading}
      id={id}
      className="text-[1.4rem] rounded-sm file:font-inherit file:font-medium file:px-4 file:py-4 file:mr-4 file:rounded-md file:border-none file:text-[var(--color-grey-50)] file:bg-[var(--color-primary)] file:cursor-pointer file:transition-colors file:duration-200 hover:file:bg-[var(--color-brand-700)]"
    />
  );
}
