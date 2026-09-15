import React, { useState, useEffect } from "react";
import { ContactMessage } from "../../types";
import { loadContactMessages, saveContactMessages } from "../../data/siteConfig";
import { MessageSquare, Mail, Calendar, Trash2, CheckCircle } from "lucide-react";

export function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    setMessages(loadContactMessages());
  }, []);

  const markAsRead = (id: string) => {
    const newMessages = messages.map(m => m.id === id ? { ...m, isRead: true } : m);
    setMessages(newMessages);
    saveContactMessages(newMessages);
  };

  const deleteMessage = (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const newMessages = messages.filter(m => m.id !== id);
      setMessages(newMessages);
      saveContactMessages(newMessages);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
          User Feedback
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
          Contact Messages
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          View and manage support requests and feedback submitted through the contact form.
        </p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-600">No messages yet</h3>
            <p className="text-xs text-slate-400">When users submit the contact form, their messages will appear here.</p>
          </div>
        ) : (
          messages.slice().reverse().map((msg) => (
            <div key={msg.id} className={`bg-white p-5 rounded-xl border ${msg.isRead ? 'border-slate-200 opacity-75' : 'border-indigo-300 shadow-md'} transition relative`}>
              {!msg.isRead && (
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-rose-500 rounded-full animate-pulse border-2 border-white"></div>
              )}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {msg.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {msg.date}
                    </span>
                    <span className="font-semibold text-slate-700">From: {msg.name}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">{msg.subject}</h4>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100">
                      {msg.message}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0 md:flex-col md:items-end">
                  {!msg.isRead && (
                    <button
                      onClick={() => markAsRead(msg.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-[11px] flex items-center gap-1.5 transition"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-[11px] flex items-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
