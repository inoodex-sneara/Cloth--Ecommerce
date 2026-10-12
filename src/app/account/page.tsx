"use client";

import {
  getMe,
  loadToken,
  login,
  logout,
  register,
  saveSession,
  type MeProfile,
} from "@/lib/api/auth";
import { apiErrorMessage } from "@/lib/api/client";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  MapPin,
  Mail,
  Package,
  Phone,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const inputClass =
  "h-11 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-[#12509b] focus:ring-2 focus:ring-[#12509b]/10";

const labelClass =
  "block text-xs font-bold uppercase tracking-wider text-zinc-700";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form States
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Register States
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status & Feedback
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState("");

  // Auth session / profile
  const [checked, setChecked] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [profile, setProfile] = useState<MeProfile | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const token = loadToken();
    if (!token) {
      Promise.resolve().then(() => {
        if (!cancelled) setChecked(true);
      });
      return () => {
        cancelled = true;
      };
    }
    getMe()
      .then((p) => {
        if (cancelled) return;
        setProfile(p);
        setSignedIn(true);
      })
      .catch(() => {
        // invalid/expired token — treat as signed out
      })
      .finally(() => {
        if (!cancelled) setChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrMsg("");
    try {
      const session = await login({
        identifier: identifier.trim(),
        password,
      });
      saveSession(session);
      showToast(`Welcome back, ${session.user.name}!`);
      setTimeout(() => router.push("/"), 900);
    } catch (err) {
      setErrMsg(apiErrorMessage(err));
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (registerPassword !== confirmPassword) {
      setErrMsg("Passwords do not match!");
      return;
    }
    setSubmitting(true);
    setErrMsg("");
    try {
      const session = await register({
        name: fullName.trim(),
        phone: registerPhone.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
        password_confirmation: confirmPassword,
      });
      saveSession(session);
      showToast("Account created successfully! Welcome to Loomora.");
      setTimeout(() => router.push("/"), 900);
    } catch (err) {
      setErrMsg(apiErrorMessage(err));
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await logout();
    setSignedIn(false);
    setProfile(null);
    setLoggingOut(false);
    showToast("Signed out successfully.");
  };

  if (signedIn) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] flex-1 items-center justify-center bg-[#f4f6fb] px-4 py-10 sm:py-14">
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-zinc-900 px-5 py-3.5 text-sm font-medium text-white shadow-2xl">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check className="h-4 w-4 stroke-[3]" />
            </span>
            <span>{toast}</span>
          </div>
        )}

        <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-200 bg-white px-6 py-8 shadow-[0_25px_60px_-25px_rgba(18,80,155,0.35)] sm:px-10 sm:py-12">
          <div className="text-center">
            <Link href="/" className="inline-flex flex-col items-center leading-none">
              <span className="text-3xl font-black tracking-tight text-[#12509b]">
                Loomora
              </span>
              <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-500">
                lifestyle ltd
              </span>
            </Link>
          </div>

          {profile && (
            <div className="mt-8">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#12509b]/10 text-xl font-black text-[#12509b]">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-extrabold tracking-tight text-zinc-900">
                    {profile.name}
                  </h1>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-500">
                    {profile.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {profile.email}
                      </span>
                    )}
                    {(profile.phone ?? profile.customer?.phone) && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {profile.phone ?? profile.customer?.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    <Package className="h-3.5 w-3.5" />
                    Total Orders
                  </div>
                  <p className="mt-1.5 text-2xl font-black text-zinc-900">
                    {profile.customer?.ordersCount ?? 0}
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    <Wallet className="h-3.5 w-3.5" />
                    Total Spent
                  </div>
                  <p className="mt-1.5 text-2xl font-black text-[#12509b]">
                    ৳ {(profile.customer?.totalSpent ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {(profile.customer?.city || profile.customer?.address) && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#12509b]" />
                  <span>
                    {profile.customer?.address}
                    {profile.customer?.city && `, ${profile.customer.city}`}
                  </span>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <Link
                  href="/account/orders"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#12509b] text-sm font-bold tracking-wider text-white shadow-md shadow-[#12509b]/25 transition-all hover:bg-[#1660b8] active:scale-[0.99]"
                >
                  <Package className="h-4 w-4" />
                  MY ORDERS
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 text-sm font-bold tracking-wider text-zinc-700 transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? "SIGNING OUT..." : "SIGN OUT"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!checked) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] flex-1 items-center justify-center bg-[#f4f6fb] px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-200 border-t-[#12509b]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] flex-1 items-center justify-center bg-[#f4f6fb] px-4 py-10 sm:py-14">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-zinc-900 px-5 py-3.5 text-sm font-medium text-white shadow-2xl">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-4 w-4 stroke-[3]" />
          </span>
          <span>{toast}</span>
        </div>
      )}

      {/* Auth Card */}
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-200 bg-white px-6 py-8 shadow-[0_25px_60px_-25px_rgba(18,80,155,0.35)] sm:px-10 sm:py-12">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex flex-col items-center leading-none">
            <span className="text-3xl font-black tracking-tight text-[#12509b]">
              Loomora
            </span>
            <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-500">
              lifestyle ltd
            </span>
          </Link>
        </div>

        <div className="mt-8">
            {/* Toggle Tabs */}
            <div className="flex rounded-xl bg-zinc-100 p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${
                  mode === "login"
                    ? "bg-white text-[#12509b] shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${
                  mode === "register"
                    ? "bg-white text-[#12509b] shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* LOGIN FORM */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="mt-7 space-y-4">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
                    Welcome back
                  </h1>
                  <p className="mt-1.5 text-sm text-zinc-500">
                    Sign in with your mobile number or email to continue.
                  </p>
                </div>

                {/* Email / Phone Field */}
                <div className="space-y-1.5 pt-2">
                  <label className={labelClass}>
                    Phone Number or Email
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="01XXXXXXXXX or you@example.com"
                      className={inputClass}
                    />
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setToast(
                          "A password reset link/OTP will be sent to your registered number."
                        );
                        setTimeout(() => setToast(null), 3000);
                      }}
                      className="text-xs font-semibold text-[#12509b] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`${inputClass} pr-11`}
                    />
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-0.5 text-xs">
                  <label className="flex cursor-pointer items-center gap-2 text-zinc-700">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300 text-[#12509b] focus:ring-[#12509b]"
                    />
                    <span>Remember me</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#12509b] text-sm font-bold tracking-wider text-white shadow-md shadow-[#12509b]/25 transition-all hover:bg-[#1660b8] hover:shadow-lg active:scale-[0.99] disabled:opacity-70"
                >
                  {submitting ? "SIGNING IN..." : "SIGN IN"}
                  <ArrowRight className="h-4 w-4" />
                </button>

                {errMsg && (
                  <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                    {errMsg}
                  </p>
                )}

                {/* Social Login Divider */}
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200" />
                  </div>
                  <span className="relative bg-white px-3 text-xs font-semibold uppercase text-zinc-400">
                    Or Sign In With
                  </span>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setToast("Connecting with Google...");
                      setTimeout(() => setToast(null), 2500);
                    }}
                    className="flex h-11 items-center justify-center gap-2.5 rounded-lg border border-zinc-300 bg-white text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setToast("Connecting with Facebook...");
                      setTimeout(() => setToast(null), 2500);
                    }}
                    className="flex h-11 items-center justify-center gap-2.5 rounded-lg border border-zinc-300 bg-white text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    <svg
                      className="h-4 w-4 fill-[#1877F2]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>
              </form>
            )}

            {/* REGISTER FORM */}
            {mode === "register" && (
              <form onSubmit={handleRegister} className="mt-7 space-y-4">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
                    Create your account
                  </h1>
                  <p className="mt-1.5 text-sm text-zinc-500">
                    Sign up with your details to start shopping with member
                    perks.
                  </p>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5 pt-2">
                  <label className={labelClass}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className={inputClass}
                    />
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="tel"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      pattern="01[0-9]{9}"
                      className={inputClass}
                    />
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className={labelClass}>
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        minLength={6}
                        className={`${inputClass} pr-11`}
                      />
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass}>
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        minLength={6}
                        className={`${inputClass} pr-11`}
                      />
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <button
                        type="button"
                        aria-label="Toggle confirm password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Agree Terms */}
                <div className="pt-1">
                  <label className="flex cursor-pointer items-start gap-2 text-xs text-zinc-600">
                    <input
                      required
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#12509b] focus:ring-[#12509b]"
                    />
                    <span>
                      I agree to the{" "}
                      <a
                        href="#"
                        className="font-semibold text-[#12509b] hover:underline"
                      >
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="font-semibold text-[#12509b] hover:underline"
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#12509b] text-sm font-bold tracking-wider text-white shadow-md shadow-[#12509b]/25 transition-all hover:bg-[#1660b8] hover:shadow-lg active:scale-[0.99] disabled:opacity-70"
                >
                  {submitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                  <ArrowRight className="h-4 w-4" />
                </button>

                {errMsg && (
                  <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                    {errMsg}
                  </p>
                )}
              </form>
            )}

            <p className="mt-6 text-center text-xs leading-relaxed text-zinc-400">
              By continuing, you agree to Loomora Lifestyle Ltd&apos;s Terms of
              Use and Privacy Policy.
            </p>
          </div>
      </div>
    </div>
  );
}
