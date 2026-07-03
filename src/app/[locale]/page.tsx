import { SwaggerPage } from '@/components/swagger-page';

export default async function Page() {
  return (
    <div className="flex w-full flex-1 flex-col p-4 md:p-6">
      <div className="card bg-base-100 border-base-300 flex flex-1 flex-col rounded-xl border shadow-xl">
        <SwaggerPage />
      </div>
    </div>
  );
}
