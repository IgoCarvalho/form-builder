import { GetFormContentByUrl } from "@/actions/form";
import { FormElementInstance } from "@/components/form-elements";
import { FormSubmitter } from "@/components/form-submitter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

type SubmitPageProps = {
  params: Promise<{ formUrl: string }>;
};

export default async function SubmitPage({ params }: SubmitPageProps) {
  const { formUrl } = await params;

  const form = await GetFormContentByUrl(formUrl);

  if (!form) {
    throw new Error("Form not found");
  }

  const formContent = JSON.parse(form.content) as FormElementInstance[];

  return (
    <div className="flex justify-center items-center w-full p-8">
      <Card className="w-full max-w-[620px]">
        <CardHeader>
          <CardTitle className="text-2xl">{form.name}</CardTitle>
          <CardDescription>{form.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <FormSubmitter formUrl={formUrl} content={formContent} />
        </CardContent>
      </Card>
    </div>
  );
}
