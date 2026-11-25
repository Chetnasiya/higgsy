import { BrowserRouter, Link, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { Appbar } from "./components/Appbar";
import { Button } from "./components/ui/button";
import "./index.css";
import { Dashboard } from "./pages/Dashbaord";
import { LandingPage } from "./pages/Landing";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { VideoCreator } from "./pages/VideoCreator";

function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-lime-300/15 text-lime-300">
        <Sparkles className="size-6" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">404</h1>
      <p className="mt-2 text-lg text-neutral-300">Page not found</p>
      <p className="mt-1 max-w-sm text-sm text-neutral-500">
        The scene you are looking for doesn't exist or may have been moved.
      </p>
      <Button asChild className="mt-6 rounded-full bg-lime-300 text-neutral-950 hover:bg-lime-200">
        <Link to="/">Back to home</Link>
      </Button>
    </main>
  );
}

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-neutral-950 text-white">
          <Appbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/video-creator" element={<VideoCreator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
