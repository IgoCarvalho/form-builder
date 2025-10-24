import { GetFormWithSubmissions } from "@/actions/form";
import { ElementsType, FormElementInstance } from "@/components/form-elements";
import { FormLinkShare } from "@/components/form-link-share";
import { StatsCard } from "@/components/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, formatDistance } from "date-fns";
import { BookCheck, MousePointerClick, Split, View } from "lucide-react";

type FormWithSubmissions = Awaited<ReturnType<typeof GetFormWithSubmissions>>;

export default async function BuilderPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const form = await GetFormWithSubmissions(Number(id));

  if (!form) {
    throw new Error("Form not found");
  }

  const { submissions, visits } = form;

  const submissionsRate = visits > 0 ? (submissions / visits) * 100 : 0;
  const bounceRate = 100 - submissionsRate;

  return (
    <>
      <div className="py-10 px-4 border-b border-muted">
        <div className="flex justify-between container mx-auto">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>
          <Button className="w-[250px]" asChild>
            <a href={`/submit/${form.shareURL}`} target="_blank">
              Visit
            </a>
          </Button>
        </div>
      </div>

      <div className="py-4  border-b border-muted">
        <div className="container mx-auto flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={form.shareURL} />
        </div>
      </div>

      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container mx-auto">
        <StatsCard
          title="Total visits"
          icon={<View />}
          helperText="All time form visits"
          value={visits.toLocaleString() || "0"}
          className="bg-blue-400 border-blue-500 dark:bg-blue-800 dark:border-blue-700"
        />
        <StatsCard
          title="Total submissions"
          icon={<BookCheck />}
          helperText="All time form submissions"
          value={submissions.toLocaleString() || "0"}
          className="bg-yellow-400 border-yellow-500 dark:bg-yellow-800 dark:border-yellow-700"
        />

        <StatsCard
          title="Submission rate"
          icon={<MousePointerClick />}
          helperText="Visits that result in form submissions"
          value={submissionsRate.toLocaleString() + "%" || "0"}
          className="bg-emerald-400 border-emerald-500 dark:bg-emerald-800 dark:border-emerald-700"
        />
        <StatsCard
          title="Bounce rate"
          icon={<Split />}
          helperText="Visits that leave without interacting"
          value={bounceRate.toLocaleString() + "%" || "0"}
          className="bg-rose-400 border-rose-500 dark:bg-rose-800 dark:border-rose-700"
        />
      </div>

      <div className="container mx-auto pt-10 px-4">
        <FormSubmissionsTable form={form} />
      </div>
    </>
  );
}

type TableColumn = {
  type: ElementsType;
  id: string;
  label: string;
  required: boolean;
};

type TableRowData = {
  [key: string]: any;
  submittedAt: Date;
};

function FormSubmissionsTable({ form }: { form: FormWithSubmissions }) {
  if (!form) return null;

  const formContent = JSON.parse(form.content) as FormElementInstance[];

  const visibleFields: ElementsType[] = [
    "TextField",
    "CheckboxField",
    "DateField",
    "NumberField",
    "SelectField",
    "TextareaField",
  ];

  const formFields = formContent.reduce<TableColumn[]>((acc, current) => {
    if (!visibleFields.includes(current.type)) return acc;

    const columnInfo = {
      type: current.type,
      id: current.id,
      label: current.extraAttributes?.label || "",
      required: current.extraAttributes?.required || false,
    };

    return [...acc, columnInfo];
  }, []);

  const formSubmissions: TableRowData[] = form.FormSubmissions.map(
    (submission) => {
      const submissionContent = JSON.parse(submission.content);

      return {
        ...submissionContent,
        submittedAt: submission.createdAt,
      };
    }
  );

  return (
    <>
      <h1 className="text-2xl font-bold my-4">Submissions {form.name}</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {formFields.map((field) => (
                <TableHead key={field.id} className="uppercase">
                  {field.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">
                Submitted at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formSubmissions.map((submission, index) => (
              <TableRow key={index}>
                {formFields.map((field) => (
                  <TableCell key={field.id}>
                    <ValueRender
                      type={field.type}
                      value={submission[field.id]}
                    />
                  </TableCell>
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(submission.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function ValueRender({ type, value }: { type: ElementsType; value: string }) {
  if (type === "DateField") {
    if (!value) return null;

    const date = new Date(value);

    return <Badge>{format(date, "dd/MM/yyyy")}</Badge>;
  }

  if (type === "CheckboxField") {
    const checked = String(value) === "true" ? true : false;

    return <Checkbox checked={checked} disabled />;
  }

  return value;
}
