import { CustomsCaseClient } from "./CustomsCaseClient";

export default async function CustomsCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CustomsCaseClient id={id} />;
}
