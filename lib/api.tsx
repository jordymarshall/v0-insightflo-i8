async function generateWorkflow(promptText: string) {
  try {
    const res = await fetch("/api/generate-workflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ context: promptText }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  } catch (err) {
    console.error("API error:", err);
    return null;
  }
}

export { generateWorkflow };
