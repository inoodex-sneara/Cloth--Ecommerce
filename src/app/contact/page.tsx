"use client";

import { useState } from "react";
import Link from "next/link";
import { submitContact } from "@/lib/api/contact";
import { apiErrorMessage } from "@/lib/api/client";

type Field = {
  name: "name" | "email" | "phone" | "subject" | "message";
  label: string;
  type: string;
  required?: boolean;
  textarea?: boolean;
};

const fields: Field[] = [
  { name: "name", label: "Full Name *", type: "text", required: true },
  { name: "email", label: "Email *", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "subject", label: "Subject", type: "text" },
  { name: "message", label: "Message *", type: "text", required: true, textarea: true },
];

export default function ContactPage() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function update(name: Field["name"], value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    setErr(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setOk(null);
    setErr(null);
    setSending(true);
    try {
      const msg = await submitContact({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        subject: values.subject.trim() || undefined,
        message: values.message.trim(),
      });
      setOk(msg);
      setValues({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (e) {
      setErr(apiErrorMessage(e));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1.5 text-sm text-zinc-500">
        <Link href="/" className="transition-colors hover:text-[#12509b]">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-zinc-800">Contact Us</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">
            Get in Touch
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Query, feedback ba order niye jeno kichhu janate chan — amra 24/7
            achi. Form ta puron kore patan.
          </p>

          {ok ? (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
              {ok}
            </div>
          ) : null}
          {err ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {err}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.slice(0, 4).map((f) => (
                <div key={f.name} className={f.name === "name" || f.name === "email" ? "" : "sm:col-span-1"}>
                  <label
                    htmlFor={`contact-${f.name}`}
                    className="mb-1.5 block text-sm font-semibold text-zinc-700"
                  >
                    {f.label}
                  </label>
                  <input
                    id={`contact-${f.name}`}
                    name={f.name}
                    type={f.type}
                    required={f.required}
                    autoComplete={f.name}
                    value={values[f.name]}
                    onChange={(e) => update(f.name, e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-colors focus:border-[#12509b] focus:ring-2 focus:ring-[#12509b]/15"
                  />
                </div>
              ))}
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="mb-1.5 block text-sm font-semibold text-zinc-700"
              >
                Message *
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={6}
                value={values.message}
                onChange={(e) => update("message", e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-colors focus:border-[#12509b] focus:ring-2 focus:ring-[#12509b]/15"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="rounded-lg bg-[#12509b] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0e3f7a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
              Customer Care
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              Order tracking, exchange/return, product query — shob ek jaygate.
              Saturday–Thursday, 9 AM – 10 PM.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
              Quick Links
            </h2>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="/order-tracking" className="font-medium text-[#12509b] hover:underline">
                Track your order
              </Link>
              <Link href="/pages/shipping-and-returns" className="font-medium text-[#12509b] hover:underline">
                Shipping &amp; Returns
              </Link>
              <Link href="/account/orders" className="font-medium text-[#12509b] hover:underline">
                Order history
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
