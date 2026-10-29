import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Sparkles, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { BACKEND_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SigninCredentials = {
  username: string;
  password: string;
};

async function signin(credentials: SigninCredentials) {
  const response = await axios.post<{ id: string }>(`${BACKEND_URL}/api/v1/signin`, credentials);
  return response.data;
}

function getSigninError(error: Error) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data.message ?? "Unable to connect. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

export function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: signin,
    onSuccess: () => navigate("/dashboard"),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate({ username: username.trim(), password });
  }

  return (
    <main className="grid min-h-[calc(100vh-56px)] bg-white lg:grid-cols-2">
      <section className="relative flex min-h-[280px] flex-col justify-between overflow-hidden bg-[#101010] px-8 py-9 text-white sm:px-12 lg:min-h-full lg:px-16 lg:py-14">
        <div className="pointer-events-none absolute -right-28 top-16 size-80 rounded-full border border-white/10 sm:size-96" />
        <div className="pointer-events-none absolute -right-12 top-32 size-64 rounded-full border border-white/10 sm:size-80" />
        <div className="pointer-events-none absolute -right-2 top-48 size-48 rounded-full border border-white/10 sm:size-64" />

        <div className="relative flex items-center gap-2 text-sm font-medium tracking-wide text-white/75">
          <Sparkles className="size-4 text-lime-300" aria-hidden="true" />
          <span>HIGGSFIELD STUDIO</span>
        </div>

        <div className="relative my-12 max-w-lg lg:my-0">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-lime-300">
            Your creative space
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Make something
            <br />
            <span className="text-white/55">unforgettable.</span>
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">
            Sign in to pick up where your imagination left off.
          </p>
        </div>

        <p className="relative hidden text-xs text-white/35 lg:block">
          A little more possibility, every time you create.
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
        <div className="w-full max-w-md">
          <div className="mb-9">
            <p className="mb-3 text-sm font-medium text-neutral-500">Welcome back</p>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">Sign in to your account</h2>
            <p className="mt-2 text-sm text-neutral-500">Enter your details below to continue.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-neutral-700">Username</Label>
              <div className="relative">
                <UserRound
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                  aria-hidden="true"
                />
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  required
                  value={username}
                  onChange={event => {
                    setUsername(event.target.value);
                    mutation.reset();
                  }}
                  placeholder="Your username"
                  className="h-11 border-neutral-200 pl-10 focus-visible:border-neutral-400 focus-visible:ring-neutral-300/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-700">Password</Label>
              <div className="relative">
                <LockKeyhole
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={event => {
                    setPassword(event.target.value);
                    mutation.reset();
                  }}
                  placeholder="Your password"
                  className="h-11 border-neutral-200 pl-10 pr-11 focus-visible:border-neutral-400 focus-visible:ring-neutral-300/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(current => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-700"
                >
                  {showPassword
                    ? <EyeOff className="size-4" aria-hidden="true" />
                    : <Eye className="size-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            {mutation.isError && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
                {getSigninError(mutation.error)}
              </p>
            )}

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="h-11 w-full bg-neutral-950 text-white hover:bg-neutral-800"
            >
              {mutation.isPending ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <ArrowRight className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-neutral-950 underline underline-offset-4 hover:text-neutral-600">
              Create one
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
