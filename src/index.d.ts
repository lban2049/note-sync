interface NoteTask {
  id: number;
  note: string;
  platform: string;
}

interface AlertMsg {
  type: 'info' | 'success' | 'error';
  msg: string;
}