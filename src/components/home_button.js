export default function HomeButton({ text }) {
  return (
    <button className="bg-transparent hover:text-red-700 text-white font-bold py-2 px-4 rounded">
      {text}
    </button>
  );
}
