import { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { ThemeToggle } from "@components/themeToggle";
import Image from "next/image";

export default function Home() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ passcode }),
    });

    setLoading(false);

    if (response.ok) {
      router.push("/share");
    } else {
      const data = await response.json();
      setError(data.message);
    }
  };

  const handleThemeClick = (e) => {
    e.preventDefault();
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Hello :)</h1>
        <Input
          type="text"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Enter passcode"
          className="text-base"
        />
        <section className="flex space-x-3">
          <Button type="submit"
            className="text-sm"
            variant="outline"
            disabled={loading}
          >
            {!loading ? (
              "Submit"
            ) : (
              <Image src="/images/bars-scale.svg"
                width={20} height={20}
                className="dark:invert"
                alt="..." />
            )}
          </Button>
          <Button type="button" className="text-sm"
            variant="secondary"
            onClick={handleThemeClick}>
            <ThemeToggle />
          </Button>
        </section>
      </form>

      {error && <p>{error}</p>}
    </main>
  );
}