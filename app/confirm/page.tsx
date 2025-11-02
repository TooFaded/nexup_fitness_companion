import { redirect } from "next/navigation";

export default function ConfirmPage() {
  // Supabase will handle the confirmation via URL params
  // and redirect to the appropriate page
  redirect("/login");
}
