// src/components/ToggleSwitch.tsx
'use client';

import { useState } from 'react';

const ToggleSwitch = () => {
  const [enabled, setEnabled] = useState(true);

  return (
    <div
      onClick={() => setEnabled(!enabled)}
      className={`w-12 h-6 flex items-center rounded-full cursor-pointer transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-500'
      }`}
    >
      <div
        className={`h-5 w-5 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </div>
  );
};

export default ToggleSwitch;
