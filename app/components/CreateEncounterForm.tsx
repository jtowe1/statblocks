interface CreateEncounterFormProps {
  onClose: () => void;
  onSave: (encounterName: string) => void;
  error?: string | null;
}

export default function CreateEncounterForm({ onClose, onSave, error }: CreateEncounterFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    onSave(name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-amber-50 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl text-amber-900 font-serif mb-4">Create Encounter</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-red-700 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-amber-900 mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Goblin Ambush"
              className="w-full p-2 border-2 border-amber-900 rounded bg-amber-50"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-amber-900 border-2 border-amber-900 rounded hover:bg-amber-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-900 text-amber-50 rounded hover:bg-amber-800"
            >
              Create Encounter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}