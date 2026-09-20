import { notFound } from "next/navigation";
import type { Query } from "@/lib/publishing/types";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Permanent Identity Lab",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  openGraph: { images: [] },
  twitter: { images: [] },
};
export default async function IdentityLabPage({
  params,
  searchParams,
}: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Query>;
}) {
  // The laboratory, its alternative marks, and fictional records are not a public product.
  // Terminate production requests BEFORE loading the entire review application.
  if (process.env.NODE_ENV !== "development") notFound();
  const { LabDocument } = await import(
    "@/components/identity-lab/lab-document"
  );
  return (
    <LabDocument path={(await params).path ?? []} query={await searchParams} />
  );
}
