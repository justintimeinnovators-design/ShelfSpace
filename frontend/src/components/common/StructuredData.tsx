type StructuredDataProps = {
  data: Record<string, unknown>;
};

/**
 * Structured Data.
 * @param { data } - { data } value.
 */
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}


