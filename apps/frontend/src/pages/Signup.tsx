import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Sparkles, UserRound } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { BACKEND_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SignupPayload = {
  username: string;
  password: string;
};

async function signup(credentials: SignupPayload) {
  const response = await axios.post<{ id: string; username: string }>(`${BACKEND_URL}/api/v1/signup`, credentials);
  return response.data;
}

function getSignupError(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data.message ?? "Unable to create account right now.";
  }

  return "Something went wrong. Please try again.";
}

export function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      window.localStorage.setItem("higgsy-user", JSON.stringify({ id: data.id, username: data.username }));
      navigate("/dashboard");
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate({ username: username.trim(), password });
  }

  return (
    <main className="grid min-h-[calc(100vh-72px)] bg-white lg:grid-cols-2">
      <section className="relative flex min-h-[260px] flex-col justify-between overflow-hidden bg-[#101010] px-8 py-9 text-white sm:px-12 lg:min-h-full lg:px-16 lg:py-14">
        <div className="pointer-events-none absolute -left-10 top-20 size-56 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute left-20 top-10 size-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full border border-white/10" />

        <div className="relative flex items-center gap-2 text-sm font-medium tracking-wide text-white/75">
          <Sparkles className="size-4 text-lime-300" />
          <span>BUILD YOUR STORY</span>
        </div>

        <div className="relative my-10 max-w-lg lg:my-0">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-lime-300">Start creating</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Launch your
            <br />
            <span className="text-white/55">next standout campaign.</span>
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">
            Create avatars, script scenes, and shape a visual identity your audience remembers.
          </p>
        </div>

        <p className="relative hidden text-xs text-white/35 lg:block">From first idea to final frame, all in one place.</p>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="mb-3 text-sm font-medium text-neutral-500">Create account</p>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">Get started with Higgsy</h2>
            <p className="mt-2 text-sm text-neutral-500">Sign up to build scenes, avatars, and ideas with AI.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="signup-username" className="text-neutral-700">Username</Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="signup-username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  required
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    mutation.reset();
                  }}
                  placeholder="Choose a username"
                  className="h-11 border-neutral-200 pl-10 focus-visible:border-neutral-400 focus-visible:ring-neutral-300/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-neutral-700">Password</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    mutation.reset();
                  }}
                  placeholder="Create a password"
                  className="h-11 border-neutral-200 pl-10 pr-11 focus-visible:border-neutral-400 focus-visible:ring-neutral-300/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-700"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {mutation.isError && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
                {getSignupError(mutation.error)}
              </p>
            )}

            <Button type="submit" disabled={mutation.isPending} className="h-11 w-full bg-neutral-950 text-white hover:bg-neutral-800">
              {mutation.isPending ? "Creating account..." : (
                <>
                  Create account
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link to="/signin" className="font-medium text-neutral-950 underline underline-offset-4 hover:text-neutral-600">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}