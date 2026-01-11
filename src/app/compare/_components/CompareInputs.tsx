interface CompareInputsProps {
  tag1: string;
  setTag1: (val: string) => void;
  tag2: string;
  setTag2: (val: string) => void;
  onFight: () => void;
}

export default function CompareInputs({ tag1, setTag1, tag2, setTag2, onFight }: CompareInputsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="#TAG 1"
          value={tag1}
          onChange={(e) => setTag1(e.target.value)}
          className="bg-skin-bg p-3 rounded-lg border border-skin-primary/30 text-center font-bold uppercase text-skin-text focus:border-skin-primary outline-none"
        />
        <input
          type="text"
          placeholder="#TAG 2"
          value={tag2}
          onChange={(e) => setTag2(e.target.value)}
          className="bg-skin-bg p-3 rounded-lg border border-skin-primary/30 text-center font-bold uppercase text-skin-text focus:border-skin-primary outline-none"
        />
      </div>
      <button
        onClick={onFight}
        className="w-full bg-skin-primary text-black font-clash py-3 rounded-xl uppercase text-xl hover:bg-skin-secondary transition-colors shadow-lg active:scale-95 duration-200"
      >
        Fight!
      </button>
    </>
  );
}
