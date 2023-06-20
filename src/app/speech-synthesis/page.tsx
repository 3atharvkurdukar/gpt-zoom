import SpeechSynthesisForm from "~/components/SpeechSynthesisForm";

export default function SpeechSynthesisPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="">
        <SpeechSynthesisForm />
      </div>
    </main>
  );
}
