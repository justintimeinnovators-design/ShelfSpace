import { LibraryFeatureWithBoundary } from "../../../components/library/LibraryFeature";

export const dynamic = "force-dynamic";

interface LibraryPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Library Page.
 * @param { searchParams } - { search Params } value.
 */
export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const resolvedSearchParams = await searchParams;
  return <LibraryFeatureWithBoundary searchParams={resolvedSearchParams || {}} />;
}
