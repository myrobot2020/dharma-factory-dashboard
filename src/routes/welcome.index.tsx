import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import heroImg from "@/assets/dama-hero.jpg";
import { PrimaryButton, GhostButton } from "@/components/onboarding/Chip";

export const Route = createFileRoute("/welcome/")({
  head: () => ({
    meta: [
      { title: "DAMA — A quiet place for the Dhamma" },
      { name: "description", content: "Read suttas, reflect daily, remember the path." },
      { property: "og:title", content: "DAMA — A quiet place for the Dhamma" },
      { property: "og:description", content: "Read suttas, reflect daily, remember the path." },
      { property: "og:url", content: "/welcome" },
    ],
    links: [{ rel: "canonical", href: "/welcome" }],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col">
      <div className="overflow-hidden rounded-md border border-border">
        <img src={heroImg} alt="Ink mountain landscape" className="h-56 w-full object-cover" />
      </div>
      <div className="mt-8 flex-1">
        <h1 className="font-serif text-4xl leading-tight text-foreground">
          A quiet place to read, reflect, and remember the Dhamma.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Daily suttas. Simple practice. No noise.
        </p>
      </div>
      <div className="mt-8 space-y-2">
        <PrimaryButton onClick={() => navigate({ to: "/welcome/value" })}>Continue</PrimaryButton>
        <Link to="/onboarding" className="block">
          <GhostButton>I already have the app</GhostButton>
        </Link>
      </div>
    </div>
  );
}
