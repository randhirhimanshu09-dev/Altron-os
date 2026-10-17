export type DeviceSkin = 'cyber' | 'android' | 'ios';

export type AppId = 
  | 'launcher' 
  | 'phone' 
  | 'messages' 
  | 'camera' 
  | 'music' 
  | 'maps' 
  | 'settings' 
  | 'diagnostics' 
  | 'setup';

export interface Contact {
  id: string;
  name: string;
  number: string;
  avatarColor: string;
  status: string;
  initials: string;
  isFavorite?: boolean;
}

export interface ChatMessage {
  id: string;
  contactId: string;
  sender: 'user' | 'contact' | 'altron';
  text: string;
  timestamp: string;
}

export interface TruecallerData {
  name: string;
  number: string;
  verified: boolean;
  spamScore: number; // 0 - 100
  spamReports: number;
  carrier: string;
  badge: 'Verified Business' | 'Verified Personal' | 'Spam Alert' | 'Unknown';
  location: string;
}

export interface ActiveCall {
  active: boolean;
  contactName: string;
  phoneNumber: string;
  duration: number; // in seconds
  status: 'dialing' | 'connected' | 'ended';
  isMuted: boolean;
  isSpeaker: boolean;
  callProvider: 'altron' | 'truecaller' | 'native' | 'whatsapp';
  truecallerInfo?: TruecallerData;
}

export interface PhoneSettings {
  flashlight: boolean;
  volume: number; // 0 - 100
  brightness: number; // 10 - 100
  wifi: boolean;
  bluetooth: boolean;
  airplaneMode: boolean;
  cellularSignal: number; // 1 - 4
  batteryLevel: number; // 0 - 100
  batteryCharging: boolean;
  screenLocked: boolean;
  activeSkin: DeviceSkin;
  voicePersona: 'Cyber' | 'Executive' | 'Nova';
  speechRate: number;
  speechPitch: number;
  autoVoiceResponse: boolean;
  defaultCallApp: 'altron' | 'truecaller' | 'native' | 'whatsapp';
  truecallerCallerIdEnabled: boolean;
  autoLaunchNativeDialer: boolean;
}

export interface DisplayCard {
  title: string;
  body: string;
  type: 'info' | 'call' | 'message' | 'toggle' | 'diagnostic' | 'navigation' | 'chat';
}

export interface GeminiCommandResult {
  speech: string;
  action: string;
  actionPayload: any;
  displayCard?: DisplayCard;
}

export interface VoiceLog {
  id: string;
  timestamp: string;
  transcript: string;
  response: string;
  actionExecuted?: string;
}
