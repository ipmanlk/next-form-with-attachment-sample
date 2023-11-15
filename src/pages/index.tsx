export default function Home() {
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/contact", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Success");
    } else {
      alert("Error");
    }
  };

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center">
      <form
        onSubmit={handleFormSubmit}
        encType="multipart/form-data"
        className="flex flex-col gap-5"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2"
        />
        <textarea name="message" placeholder="Message" className="border p-2" />
        <input type="file" name="file" />

        <button type="submit" className="bg-blue-400 rounded-lg p-2">
          Submit
        </button>
      </form>
    </div>
  );
}
