import { GetFormById } from "@/actions/form";
import { FormBuilder } from "@/components/form-builder";
import React from "react";

export default async function BuilderPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params

  const form = await GetFormById(Number(id))

  return <FormBuilder form={form}></FormBuilder>;
}
