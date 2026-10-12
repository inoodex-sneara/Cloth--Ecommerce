import { apiFetch } from "./client";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

type ContactResponse = {
  success: boolean;
  message?: string;
  data?: { id: number; created_at: string };
};

export async function submitContact(payload: ContactPayload): Promise<string> {
  const res = await apiFetch<ContactResponse>("/contact", {
    method: "POST",
    body: payload,
  });
  return res.message ?? "Thank you! Your message has been sent.";
}
