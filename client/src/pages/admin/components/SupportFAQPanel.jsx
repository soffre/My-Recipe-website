import React, { useState } from 'react';
import { 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  MessageSquare, 
  User, 
  RefreshCw 
} from 'lucide-react';

export default function SupportFAQPanel() {
  // 1. Initial Mock Support Dataset State
  const [tickets, setTickets] = useState([
    {
      id: 'ticket_101',
      senderName: 'Solomon Kebede',
      email: 'solomon@gmail.com',
      subject: 'Injera fermentation issue',
      message: "Hello Tafach Team, my teff batter isn't souring correctly after 3 days. Any advice?",
      receivedTime: '3 hours ago',
      status: 'PENDING',
      replyText: ''
    },
    {
      id: 'ticket_102',
      senderName: 'Helen Smith',
      email: 'helen.s@yahoo.com',
      subject: 'Cloudinary Avatar Upload bug',
      message: 'I tried uploading a JPEG recipe cover but it gave me an unmarshaling data error code.',
      receivedTime: 'Yesterday',
      status: 'PENDING',
      replyText: ''
    },
    {
      id: 'ticket_103',
      senderName: 'Michael D.',
      email: 'mike.cooks@outlook.com',
      subject: 'Password Reset Link',
      message: 'I received the recovery code via email but it expired before I typed it in.',
      receivedTime: '2 days ago',
      status: 'REPLIED',
      replyText: 'Hi Michael, I manually reset your code window. Please check your inbox for a fresh token link.'
    }
  ]);

  // Selected Ticket State (default to first ticket)
  const [selectedTicketId, setSelectedTicketId] = useState('ticket_101');
  const [replyInput, setReplyInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState(null); // toast message string

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  // 3. Dispatch SMTP Reply handler
  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    setIsSending(true);

    // Simulate async dispatch
    setTimeout(() => {
      setTickets(prev => prev.map(t => 
        t.id === selectedTicket.id 
          ? { ...t, status: 'REPLIED', replyText: replyInput.trim() } 
          : t
      ));
      
      setIsSending(false);
      setReplyInput('');
      setToastMessage('Email task queued securely into Redis cluster successfully!');
      
      // Clear toast after 4 seconds
      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    }, 1500);
  };

  return (
    <div className="font-brand space-y-grid-3 animate-fadeIn">
      {/* Page Header and Toast Alert Notification */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-grid-2 border-b border-tafach-border">
        <div>
          <h3 className="font-bold text-sm text-tafach-dark">User Support & Communications Console</h3>
          <p className="text-xs text-tafach-muted">Moderate incoming customer inquiries and dispatch replies via SMTP queues.</p>
        </div>

        {toastMessage && (
          <div className="px-3 py-1.5 rounded-lg bg-tafach-green/10 border border-tafach-green/20 text-tafach-green font-medium text-xs flex items-center gap-1.5 animate-bounce">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {toastMessage}
          </div>
        )}
      </div>

      {/* 2. Interactive Ticket Explorer Interface (Dual-Column Layout) */}
      <div className="flex flex-col md:flex-row gap-grid-3 items-stretch min-h-[500px]">
        
        {/* Left Pane: Ticket List Column (width md:w-1/3) */}
        <div className="w-full md:w-1/3 flex flex-col gap-2 overflow-y-auto pr-1">
          <span className="text-[11px] font-bold text-tafach-muted uppercase tracking-wider block mb-1">
            Inbound Messages ({tickets.length})
          </span>
          <div className="flex flex-col gap-2.5">
            {tickets.map((ticket) => {
              const isSelected = ticket.id === selectedTicketId;
              return (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`active:scale-95 transition-transform text-left p-grid-2 rounded-2xl border text-xs flex flex-col gap-2 transition-all duration-150 ${
                    isSelected 
                      ? 'bg-white border-tafach-orange shadow-md ring-1 ring-tafach-orange' 
                      : 'bg-white border-tafach-border hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-mono text-tafach-muted font-bold">{ticket.id}</span>
                    <span className="text-[10px] text-tafach-muted flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {ticket.receivedTime}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-bold text-tafach-dark truncate">{ticket.subject}</h5>
                    <span className="text-tafach-muted block truncate">{ticket.senderName}</span>
                  </div>

                  <div className="flex items-center justify-between w-full pt-1 border-t border-slate-100">
                    <span className="text-slate-500 truncate max-w-[150px]">{ticket.message}</span>
                    
                    {/* Status Badge Indicators */}
                    {ticket.status === 'PENDING' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-tafach-orange font-bold">
                        <span className="h-2 w-2 rounded-full bg-tafach-orange animate-pulse" />
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-tafach-green font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Replied
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Active Conversation Thread Window (width md:w-2/3) */}
        <div className="w-full md:w-2/3 bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm flex flex-col justify-between">
          <div className="space-y-4 flex-1">
            {/* Header Ticket Information */}
            <div className="pb-3 border-b border-tafach-border flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-tafach-orange font-bold text-xs bg-tafach-orange/5 px-2 py-0.5 rounded">
                    {selectedTicket.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedTicket.status === 'PENDING' 
                      ? 'bg-tafach-orange/15 text-tafach-orange' 
                      : 'bg-tafach-green/15 text-tafach-green'
                  }`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <h4 className="font-bold text-base text-tafach-dark leading-snug">
                  {selectedTicket.subject}
                </h4>
              </div>
              <div className="text-right text-xs text-tafach-muted shrink-0">
                <span>Received: {selectedTicket.receivedTime}</span>
              </div>
            </div>

            {/* Sender Bio Card */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                <User className="h-4.5 w-4.5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-tafach-dark">{selectedTicket.senderName}</p>
                <p className="text-slate-500 font-mono">{selectedTicket.email}</p>
              </div>
            </div>

            {/* Incoming Message Block */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-tafach-muted uppercase tracking-wider block">
                User Query Message
              </span>
              <div className="bg-slate-50/70 p-grid-2 rounded-xl border border-slate-100 text-sm text-slate-800 leading-relaxed font-sans">
                {selectedTicket.message}
              </div>
            </div>

            {/* 3. Reply Submission or Historical Trail Box */}
            <div className="pt-2">
              {selectedTicket.status === 'REPLIED' ? (
                // Historical Audit Trail block
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-tafach-muted uppercase tracking-wider block">
                    Sent Reply Audit Trail
                  </span>
                  <div className="bg-emerald-50 border-l-4 border-tafach-green p-3 rounded-r-xl text-xs text-slate-800 font-sans leading-relaxed">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-tafach-green">Tafach Support Team Reply</strong>
                      <span className="text-[10px] text-slate-500">SMTP Dispatched</span>
                    </div>
                    <p className="italic">"{selectedTicket.replyText}"</p>
                  </div>
                </div>
              ) : (
                // Active compose reply area
                <form onSubmit={handleSendReply} className="space-y-3">
                  <span className="text-[10px] font-bold text-tafach-muted uppercase tracking-wider block">
                    Compose SMTP Email Response
                  </span>
                  <textarea
                    rows="4"
                    placeholder="Type your response to the user here..."
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    className="tafach-input font-sans text-xs w-full focus:ring-1 focus:ring-tafach-orange focus:border-tafach-orange"
                    disabled={isSending}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSending}
                    className="active:scale-95 transition-transform bg-tafach-orange hover:bg-tafach-orange/95 disabled:bg-orange-300 text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md shadow-tafach-orange/15"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Queuing SMTP Reply into Redis Task Queue...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3 w-3" />
                        <span>📨 Dispatch Official SMTP Reply</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Footer details */}
          <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-tafach-muted">
            <span>Ticket Thread: {selectedTicket.id}</span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              SMTP SMTP-TLS encryption active
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
