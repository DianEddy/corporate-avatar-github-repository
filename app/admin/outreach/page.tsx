'use client'

import { FormEvent, useEffect, useState } from 'react'

type Message = { id: string; from: string; subject: string; date: string; snippet: string }

export default function OutreachPage() {
  const [mailbox, setMailbox] = useState('Loading mailbox…')
  const [messages, setMessages] = useState<Message[]>([])
  const [status, setStatus] = useState('Connecting to Gmail…')
  const [draft, setDraft] = useState({ to: '', subject: '', body: '' })

  async function loadInbox() {
    setStatus('Loading recent messages…')
    const response = await fetch('/api/outreach')
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    setMailbox(data.mailbox)
    setMessages(data.messages)
    setStatus('Ready for review')
  }

  useEffect(() => { loadInbox().catch((error) => setStatus(error.message)) }, [])

  async function saveDraft(event: FormEvent) {
    event.preventDefault()
    setStatus('Saving draft…')
    const response = await fetch('/api/outreach', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) })
    const data = await response.json()
    setStatus(response.ok ? data.message : data.error)
  }

  return <main className="outreach-shell">
    <header className="outreach-header"><div><p className="eyebrow">Private project desk</p><h1>Goodheart Partnerships</h1><p className="outreach-muted">Corporate Avatar: Off Duty sponsorship outreach</p></div><a href="/">Back to project</a></header>
    <section className="outreach-notice"><strong>{mailbox}</strong><span>{status}</span><small>Read and draft only. Every message stays unsent until a human approves it.</small></section>
    <div className="outreach-grid"><section className="outreach-panel"><div className="panel-heading"><div><p className="eyebrow">Inbox</p><h2>Recent conversations</h2></div><button type="button" onClick={() => loadInbox().catch((error) => setStatus(error.message))}>Refresh</button></div>{messages.length ? <div className="message-list">{messages.map((message) => <article className="message-row" key={message.id}><div><strong>{message.subject || '(No subject)'}</strong><p>{message.from}</p></div><time>{message.date}</time><span>{message.snippet}</span></article>)}</div> : <p className="outreach-muted">No recent messages loaded yet.</p>}</section><section className="outreach-panel"><p className="eyebrow">Compose for review</p><h2>Prepare a draft</h2><form onSubmit={saveDraft}><label>To<input type="email" required value={draft.to} onChange={(event) => setDraft({ ...draft, to: event.target.value })} /></label><label>Subject<input required value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} /></label><label>Message<textarea required rows={10} value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} /></label><button className="button button-dark" type="submit">Save Gmail draft</button></form></section></div>
  </main>
}
