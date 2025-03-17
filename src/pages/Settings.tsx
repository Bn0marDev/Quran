
import { useEffect } from 'react';
import SettingsPanel from '@/components/settings/SettingsPanel';

const Settings = () => {
  // Set document title
  useEffect(() => {
    document.title = 'Settings - Quranic Cornerstone';
  }, []);

  return (
    <div className="page-container mt-24 animate-fade-in">
      <h1 className="text-3xl font-heading font-bold mb-6">
        Settings
      </h1>
      
      <SettingsPanel />
    </div>
  );
};

export default Settings;
