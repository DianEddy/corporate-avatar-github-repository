import { NextResponse } from 'next/server'
import { createGmailDraft, gmailErrorMessage, getMailboxProfile, listRecentMessages } from '@/lib/gmail'

export async function GET() {
  try {
    const [mailbox, messages] = await Promise.all([getMailboxProfile(), listRecentMessages()])
    return NextResponse.json({ mailbox, messages })
  } catch (error) {
    return NextResponse.json({ error: gmailErrorMessage(error) }, { status: 502 })
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
