interface NoteTask {
  id: number;
  note: string;
  group: string | null;
  platform: string;
}

interface AlertMsg {
  type: 'info' | 'success' | 'error';
  msg: string;
}

interface Note {
  content: string;
  jikeGroup: string;
  tags: string[];
}

interface SysSetting {
  typefullyApiKey: string;
  jikeGroups: string;
  commonTags: string;
  darkMode: boolean;
}