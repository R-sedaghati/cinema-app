import Image from "next/image";

type EmptyStateProps = {
  showImage?: boolean;
  message: string;
};

export default function TableEmptyState({
  showImage = false,
  message,
}: Readonly<EmptyStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center w-full py-10 text-center text-gray-600">
      {showImage && (
        <Image
          src="/assets/images/onmount-empty-state.webp"
          alt="emptyState"
          width={400}
          height={270}
        />
      )}
      <p className="mt-4 text-base">{message}</p>
    </div>
  );
}
