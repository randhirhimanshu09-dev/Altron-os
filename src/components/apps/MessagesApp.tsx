import React, { useState } from 'react';
import { MessageSquare, Send, Mic, Volume2, ArrowLeft, CheckCheck } from 'lucide-react';
import { Contact, ChatMessage } from '../../types';
import { soundEngine } from '../../services/audioSynth';

interface MessagesAppProps {
  contacts: Contact[];
  messages: ChatMessage[];
  onSendMessage: (contactId: string, text: string) => void;
  onReadAloud: (text: string) => void;
}

export const MessagesApp: React.FC<MessagesAppProps> = ({
  contacts,
  messages,
  onSendMessage,
  onReadAloud,
}) => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');

  const activeContact = contacts.find(c => c.id === selectedContactId);
  const activeConversation = messages.filter(m => m.contactId === selectedContactId);

  const handleSend = () => {
    if (!inputText.trim() || !selectedContactId) return;
    soundEngine.playAcknowledge();
    onSendMessage(selectedContactId, inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white select-none">
      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-2">
          {selectedContactId ? (
            <button
              onClick={() => setSelectedContactId(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <MessageSquare className="w-4 h-4 text-blue-400" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-sm text-slate-100">
              {activeContact ? activeContact.name : 'ALTRON Messages'}
            </h3>
            {activeContact && (
              <p className="text-[10px] font-mono text-cyan-400">{activeContact.status}</p>
            )}
          </div>
        </div>

        {selectedContactId && activeConversation.length > 0 && (
          <button
            onClick={() => {
              const lastMsg = activeConversation[activeConversation.length - 1];
              onReadAloud(`Message from ${activeContact?.name}: ${lastMsg.text}`);
            }}
            title="Read latest message aloud"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Read Aloud</span>
          </button>
        )}
      </div>

      {/* Main View: Thread list OR Conversation */}
      {!selectedContactId ? (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="flex items-center justify-between px-2 pt-1 text-xs font-mono text-slate-400">
            <span>CONVERSATION THREADS</span>
            <span className="text-cyan-400">VOICE COMMAND: "Text [Name]"</span>
          </div>

          {contacts.map(contact => {
            const contactMsgs = messages.filter(m => m.contactId === contact.id);
            const lastMsg = contactMsgs[contactMsgs.length - 1];

            return (
              <div
                key={contact.id}
                onClick={() => setSelectedContactId(contact.id)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/30 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-11 h-11 rounded-full ${contact.avatarColor} text-white font-bold text-sm shadow`}>
                    {contact.initials}
                  </div>
                  <div className="max-w-[170px]">
                    <div className="font-semibold text-sm text-slate-200">{contact.name}</div>
                    <div className="text-xs text-slate-400 truncate">
                      {lastMsg ? lastMsg.text : 'No messages yet'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 text-[11px] font-mono text-slate-500">
                  <span>{lastMsg ? lastMsg.timestamp : ''}</span>
                  {contactMsgs.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Chat message bubbles */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeConversation.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
                <MessageSquare className="w-8 h-8 mb-2 opacity-40 text-cyan-400" />
                <p>No messages with {activeContact?.name}</p>
                <p className="mt-1 font-mono text-cyan-400/80">Speak: "Send message to {activeContact?.name}"</p>
              </div>
            ) : (
              activeConversation.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${
                    msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-cyan-600 text-white rounded-br-none shadow-md shadow-cyan-600/20'
                        : msg.sender === 'altron'
                        ? 'bg-slate-800/90 border border-cyan-500/30 text-cyan-200 rounded-bl-none'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/60'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] font-mono text-slate-500">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${activeContact?.name}...`}
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-white transition-all shadow-md shadow-cyan-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
