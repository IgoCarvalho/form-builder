import { Form } from "@/generated/prisma";
import { formatDistance } from "date-fns";
import { ArrowRight, Edit, NotepadText, ViewIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";

export function FormCard({ form }: { form: Form }) {
  return (
    <Card className="gap-2 ">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="truncate font-bold">{form.name}</span>

          {form.published && <Badge>Published</Badge>}
          {!form.published && <Badge variant={"destructive"}>Draft</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), {
            addSuffix: true,
          })}

          {form.published && (
            <span className="flex items-center gap-2">
              <ViewIcon className="text-muted-foreground" />
              <span>{form.visits.toLocaleString()}</span>
              <NotepadText className="text-muted-foreground" />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[20px] truncate text-sm text-muted-foreground mt-auto">
        {form.description || "No description"}
      </CardContent>

      <CardFooter>
        {form.published ? (
          <Button asChild className="w-full mt-2 text-base gap-4">
            <Link href={`/forms/${form.id}`}>
              View submissions <ArrowRight />
            </Link>
          </Button>
        ) : (
          <Button
            asChild
            variant={"secondary"}
            className="w-full mt-2 text-base gap-4"
          >
            <Link href={`/builder/${form.id}`}>
              Edit form <Edit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
