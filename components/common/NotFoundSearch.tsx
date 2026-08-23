/* eslint-disable @next/next/no-img-element */

const NotFoundSearch = () => {
  return (
    <div className="flex flex-col gap-6 justify-center items-center p-8 text-center">
      <img
        src={"./not-found-search.svg"}
        width={138}
        height={136}
        alt="یافت نشد"
      />
      <div className="font-h3-bold font-semibold text-zinc-500">
        نتیجه‌ای یافت نشد!
      </div>
    </div>
  );
};

export default NotFoundSearch;
