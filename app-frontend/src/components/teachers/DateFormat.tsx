const Demo = () => {
  const date = new Date(2023, 2, 19, 15, 57, 25);

  const formatted = date.toLocaleString("en", {
    year: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }); // Mar 2023, 3:57 PM

  const formatted2 = date.toLocaleString("en", {
    year: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  }); // March 2023, 3:57 PM

  const formatted3 = date.toLocaleString("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  }); // March 19, 2023, 3:57 PM

  return (
    <div className="p-4">
      <p>formatted: {formatted}</p>
      <p>formatted: {formatted2}</p>
      <p>formatted: {formatted3}</p>
    </div>
  );
};
export default Demo;
