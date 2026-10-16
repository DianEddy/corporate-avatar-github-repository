'use client'

import { FormEvent, useEffect, useState } from 'react'

type Message = { id: string; from: string; subject: string; date: string; snippet: string }
type Draft = { id: string; to: string; subject: string; body: string; updatedAt: string }
type Prospect = { id: string; organisation: string; market: string; fit: string; contact: string; status: string }

export default function OutreachPage() {
  const [mailbox, setMailbox] = useState('Loading mailbox…')
  const [messages, setMessages] = useState<Message[]>([])
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [status, setStatus] = useState('Connecting to Gmail…')
  const [draft, setDraft] = useState({ to: '', subject: '', body: '' })

  async function loadInbox() {
    setStatus('Loading recent messages…')
    const response = await fetch('/api/outreach')
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    setMailbox(data.mailbox)
    setMessages(data.messages)
    setDrafts(data.drafts ?? [])
    setProspects(data.prospects ?? [])
    setStatus(data.error ? `Gmail: ${data.error}` : 'Ready for review')
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
    <div className="outreach-grid">
      <section className="outreach-panel">
        <div className="panel-heading"><div><p className="eyebrow">First batch</p><h2>UK &amp; Ireland prospects</h2></div><span className="outreach-muted">{prospects.length} targets</span></div>
        <p className="outreach-muted">These are review candidates, not approved contacts. Confirm the right person and public contact route before outreach.</p>
        <div className="message-list">{prospects.map((prospect) => <article className="message-row" key={prospect.id}><div><strong>{prospect.organisation}</strong><p>{prospect.market} · {prospect.status}</p></div><span>{prospect.fit}<br />{prospect.contact}</span></article>)}</div>
      </section>
      <section className="outreach-panel">
        <div className="panel-heading"><div><p className="eyebrow">Approval queue</p><h2>Gmail drafts</h2></div><button type="button" onClick={() => loadInbox().catch((error) => setStatus(error.message))}>Refresh</button></div>
        {drafts.length ? <div className="message-list">{drafts.map((item) => <article className="message-row" key={item.id}><div><strong>{item.subject || '(No subject)'}</strong><p>To: {item.to || 'No recipient'}</p></div><span>{item.body.trim() ? `${item.body.slice(0, 180)}${item.body.length > 180 ? '…' : ''}` : 'This Gmail draft has no readable body yet. Open it in Gmail to review the full content.'}</span></article>)}</div> : <p className="outreach-muted">No Gmail drafts yet. Use the composer below to prepare the first message.</p>}
      </section>
      <section className="outreach-panel">
        <p className="eyebrow">Compose for review</p><h2>Prepare a draft</h2>
        <form onSubmit={saveDraft}><label>To<input type="email" required value={draft.to} onChange={(event) => setDraft({ ...draft, to: event.target.value })} /></label><label>Subject<input required value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} /></label><label>Message<textarea required rows={10} value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} /></label><button className="button button-dark" type="submit">Save Gmail draft</button></form>
      </section>
      <section className="outreach-panel"><div className="panel-heading"><div><p className="eyebrow">Inbox</p><h2>Recent conversations</h2></div></div>{messages.length ? <div className="message-list">{messages.map((message) => <article className="message-row" key={message.id}><div><strong>{message.subject || '(No subject)'}</strong><p>{message.from}</p></div><time>{message.date}</time><span>{message.snippet}</span></article>)}</div> : <p className="outreach-muted">No recent messages loaded yet.</p>}</section>
    </div>
  </main>
}
