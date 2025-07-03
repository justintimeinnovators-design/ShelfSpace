import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession();
  // console.log(session);
  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
