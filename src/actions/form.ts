"use server";

import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formSchema, FormSchemaType } from "@/schemas/form";

export async function GetFormStats() {
  const user = await currentUser();

  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const submissions = stats._sum.submissions || 0;
  const visits = stats._sum.visits || 0;

  const submissionsRate = visits > 0 ? (submissions / visits) * 100 : 0;
  const bounceRate = 100 - submissionsRate;

  return {
    visits,
    submissions,
    submissionsRate,
    bounceRate,
  };
}

export async function CreateForm(data: FormSchemaType) {
  const validation = formSchema.safeParse(data);

  if (!validation.success) {
    throw new Error("Form not valid");
  }

  const user = await currentUser();

  const { name, description } = validation.data;

  const createdForm = await prisma.form.create({
    data: {
      name,
      description,
      userId: user.id,
    },
  });

  if (!createdForm) {
    throw new Error("Something went wrong");
  }

  return createdForm.id;
}

export async function GetForms() {
  const user = await currentUser();

  const userForms = await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return userForms;
}

export async function GetFormById(id: number) {
  const user = await currentUser();

  const formData = await prisma.form.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!formData) {
    throw new Error("Form not found!");
  }

  return formData;
}

export async function UpdateFormContent(formId: number, formContent: string) {
  const user = await currentUser();

  return await prisma.form.update({
    where: {
      userId: user.id,
      id: formId,
    },
    data: {
      content: formContent,
    },
  });
}

export async function PublishForm(formId: number) {
  const user = await currentUser();

  return await prisma.form.update({
    where: {
      id: formId,
      userId: user.id,
    },
    data: {
      published: true,
    },
  });
}

export async function GetFormContentByUrl(formUrl: string) {
  return await prisma.form.update({
    select: {
      content: true,
      name: true,
      description: true
    },
    where: {
      shareURL: formUrl,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
  });
}

export async function SubmitForm(formUrl: string, formContent: string) {
  return await prisma.form.update({
    data: {
      submissions: {
        increment: 1,
      },
      FormSubmissions: {
        create: {
          content: formContent,
        },
      },
    },
    where: {
      shareURL: formUrl,
      published: true,
    },
  });
}

export async function GetFormWithSubmissions(formId: number) {
  const user = await currentUser();

  return await prisma.form.findUnique({
    where: {
      id: formId,
      userId: user.id,
    },
    include: {
      FormSubmissions: true,
    },
  });
}
