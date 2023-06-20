import Image from "next/image";
import Link from "next/link";

interface CardInfo {
  title: string;
  description: string;
  href: string;
}

const cards: CardInfo[] = [
  {
    title: "Transcribe",
    description: `Convert audio into text transcription.`,
    href: "/transcribe",
  },
  {
    title: "Chat",
    description: `Get answers from an AI assistant.`,
    href: "/chat",
  },
  {
    title: "Speech Synthesis",
    description: `Bring your text to life with AI voice.`,
    href: "/speech-synthesis",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex w-full mx-5 items-center justify-center gap-4">
        <Image
          src="/zoom.png"
          alt="Zoom"
          width={100}
          height={100}
          className="flex-none"
        />
        <div className="w-12 h-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="fill-gray-800 dark:fill-gray-100"
          >
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
          </svg>
        </div>
        <Image
          src="/chatgpt.png"
          alt="ChatGPT"
          width={100}
          height={100}
          className="flex-none"
        />
      </div>
      <div className="flex max-w-md gap-x-4">
        <label htmlFor="meeting-link" className="sr-only">
          Meeting Link
        </label>
        <input
          id="meeting-link"
          name="meeting-link"
          type="url"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-800 dark:text-gray-100 border-gray-100 dark:border-gray-700 text-xl focus:ring-1 ring-indigo-200 dark:ring-indigo-700"
          placeholder="Enter meeting link"
        />
        <button
          type="submit"
          className="flex-none rounded-md bg-indigo-700 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 text-xl"
        >
          Join
        </button>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-3 lg:text-left gap-4">
        {cards.map((card) => (
          <Card key={card.title} {...card} />
        ))}
      </div>
    </main>
  );
}

const Card = ({ title, description, href }: CardInfo) => (
  <Link
    href={href}
    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
  >
    <h2 className={`mb-3 text-2xl font-semibold`}>
      {title}
      <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
        -&gt;
      </span>
    </h2>
    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{description}</p>
  </Link>
);
