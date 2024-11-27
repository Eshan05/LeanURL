import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ passcode }),
    });

    if (response.ok) {
      router.push("/share");
    } else {
      const data = await response.json();
      setError(data.message);
    }
  };

  return (
    <div>
      <h1>Enter Passcode</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Enter passcode"
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
