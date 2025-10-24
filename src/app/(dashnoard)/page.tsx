import { GetForms, GetFormStats } from "@/actions/form";
import CreateFormButton from "@/components/create-form-button";
import { FormCard } from "@/components/form-card";
import { StatsCard } from "@/components/stats-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { BookCheck, MousePointerClick, Split, View } from "lucide-react";
import { Suspense } from "react";

export default async function HomePage() {
  return (
    <div className="container mx-auto px-4 pt-4">
      <Suspense fallback={<StatsCards loading />}>
        <StatsCardsWrapper />
      </Suspense>

      <Separator className="my-6" />
      <h2 className="text-4xl font-bold col-span-2">Your forms</h2>
      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormButton />

        <Suspense
          fallback={[...Array(5)].map((_, index) => (
            <FormCardsSkeleton key={index} />
          ))}
        >
          <FormCards />
        </Suspense>
      </div>
    </div>
  );
}

async function StatsCardsWrapper() {
  const stats = await GetFormStats();

  return (
    <div className="container pt-4">
      <StatsCards data={stats} loading={false} />
    </div>
  );
}

interface StatsCardsProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}

function StatsCards({ data, loading }: StatsCardsProps) {
  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total visits"
        icon={<View />}
        helperText="All time form visits"
        value={data?.visits.toLocaleString() || "0"}
        loading={loading}
        className="bg-blue-400 border-blue-500 dark:bg-blue-800 dark:border-blue-700"
      />
      <StatsCard
        title="Total submissions"
        icon={<BookCheck />}
        helperText="All time form submissions"
        value={data?.submissions.toLocaleString() || "0"}
        loading={loading}
        className="bg-yellow-400 border-yellow-500 dark:bg-yellow-800 dark:border-yellow-700"
      />

      <StatsCard
        title="Submission rate"
        icon={<MousePointerClick />}
        helperText="Visits that result in form submissions"
        value={data?.submissionsRate.toLocaleString() + "%" || "0"}
        loading={loading}
        className="bg-emerald-400 border-emerald-500 dark:bg-emerald-800 dark:border-emerald-700"
      />
      <StatsCard
        title="Bounce rate"
        icon={<Split />}
        helperText="Visits that leave without interacting"
        value={data?.bounceRate.toLocaleString() + "%" || "0"}
        loading={loading}
        className="bg-rose-400 border-rose-500 dark:bg-rose-800 dark:border-rose-700"
      />
    </div>
  );
}

function FormCardsSkeleton() {
  return <Skeleton className="border-2 border-primary/20 h-[190px] w-full" />;
}

async function FormCards() {
  const forms = await GetForms();

  return (
    <>
      {forms.map((formData) => (
        <FormCard key={formData.id} form={formData} />
      ))}
    </>
  );
}
