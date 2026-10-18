import { NextResponse } from 'next/server'
import { createGmailDraft, gmailErrorMessage, getMailboxProfile, listGmailDrafts, listRecentMessages } from '@/lib/gmail'

const prospects = [
  { id: 'p1', organisation: 'BBC Studios', market: 'UK', fit: 'Entertainment and unscripted storytelling', contact: 'Confirm partnerships contact', email: 'Not yet verified', status: 'Research ready' },
  { id: 'p2', organisation: 'Sky', market: 'UK', fit: 'Media, culture and audience reach', contact: 'Confirm brand partnerships contact', email: 'Not yet verified', status: 'Research ready' },
  { id: 'p3', organisation: 'RTÉ', market: 'Ireland', fit: 'Irish broadcast and cultural programming', contact: 'Confirm commissioning or partnerships contact', email: 'Not yet verified', status: 'Research ready' },
  { id: 'p4', organisation: 'Virgin Media Television', market: 'Ireland', fit: 'Entertainment and local audience engagement', contact: 'Confirm commercial partnerships contact', email: 'Not yet verified', status: 'Research ready' },
  { id: 'p5', organisation: 'The Prince\'s Trust', market: 'UK & Ireland', fit: 'Youth opportunity and social impact', contact: 'Confirm corporate partnerships contact', email: 'Not yet verified', status: 'Research ready' }, 
]

export async function GET() {
  try {
    const [mailbox, messages, drafts] = await Promise.all([getMailboxProfile(), listRecentMessages(), listGmailDrafts()])
    return NextResponse.json({ mailbox, messages, drafts, prospects })
  } catch (error) {
    return NextResponse.json({
      mailbox: 'Gmail authorization required',
      messages: [],
      drafts: [],
      prospects,
      error: gmailErrorMessage(error),
    })
  }
}

export async function POST(request: Request) {
  try {
    const input = await request.json() as { to?: string; subject?: string; body?: string }
    if (!input.to || !input.subject || !input.body) return NextResponse.json({ error: 'To, subject and body are required.' }, { status: 400 })
    const id = await createGmailDraft({ to: input.to, subject: input.subject, body: input.body })
    return NextResponse.json({ id, message: 'Draft saved in Gmail for review. Nothing was sent.' })
  } catch (error) {
    return NextResponse.json({ error: gmailErrorMessage(error) }, { status: 502 })
  }
}
