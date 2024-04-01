export default function TextArea({ value, onChange }) {
    return (
      <div>
        <textarea
          class="px-2 py-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 block"
          value={value}
          onChange={onChange}
          rows="4"
          cols="50"
        />
      </div>
    );
  }